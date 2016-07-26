import regexEscape from './regex-escape'
import objectKeys from './object-keys'
import stringTrim from './string-trim'
import unescape from './unescape'
import escape from './escape'

enum Match {
    FULL_MATCH = 0
}

export default class Compiler implements Templata.Interface.Compiler {
    public static settings: Templata.Object.CompilerSettings = {
        VARIABLE_NAME: 'local',
        VARIABLE_PRINT: '__print',
        DELIMITER: {
            FILTER_SEPERATOR: '|',
            OPENING_BLOCK: '{{',
            CLOSING_BLOCK: '}}',
            CLOSING: '/',
            SPACE: ' '
        }
    }

    protected replaceExpressions: Templata.Object.RegularExpressions = {
        NEW_LINE: /\r|\n|\t|\/\*[\s\S]*?\*\//g,
        AFTER_HTML_TAG: />\s+/g,
        BEFORE_HTML_TAG: /\s+</g,
        EMPTY_COMMENT_TAG: /<!--[\s\S]*?-->/g,
        EMPTY_LINES: /^(?:\s*?)$/gm,
        EMPTY_START_BUFFER: null,
        EMPTY_APPEND_BUFFER: null
    }

    protected buffer: Templata.Object.Buffer = {
        APPEND: '\'+(',
        POST_APPEND: ')+\'',
        START: null,
        END: '\';\n'
    }

    private importNames: string[]
    private importValues: any[]
    private blockRegex: RegExp
    private helper: Object
    private filter: Object

    constructor(imports: Object = {}, helper: Object = {}, filter: Object = {}) {
        this.setupImports(imports)
        this.helper = helper
        this.filter = filter

        this.setupRegularExpressions()
        this.setupBuffer()
    }

    public registerImport(name: string, imports: any): void {
        if (this.importNames.indexOf(name) < 0) {
            this.importNames.push(name)
            this.importValues.push(imports)
        }
    }

    public removeImport(name: string): void {
        let index: number = this.importNames.indexOf(name)

        if (index > -1) {
            this.importNames.splice(index, 1)
            this.importValues.splice(index, 1)
        }
    }

    public registerHelper(operator: string, callback: Templata.Interface.Helper): void {
        if (operator.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING) {
            throw Error(`Helper cannot start with "${Compiler.settings.DELIMITER.CLOSING}"!`)
        }

        this.helper[operator] = callback
    }

    public removeHelper(operator: string): void {
        delete this.helper[operator]
    }

    public registerFilter(name: string, callback: Templata.Interface.Filter): void {
        this.filter[name] = callback
    }

    public removeFilter(name: string): void {
        delete this.filter[name]
    }

    public compile(template: string): Templata.Interface.CompileFunction {
        template = escape(template)

        let matches: Object[] = this.matchBlocks(template)
        let previous: Object
        let length: number = matches.length
        let parts: string[] = []
        let index: number = -1

        while (++index < length) {
            if (!previous) {
                parts.push(template.slice(0, matches[index]['start']))
                parts.push(matches[index]['content'])
            } else {
                parts.push(template.slice(previous['end'], matches[index]['start']))
                parts.push(matches[index]['content'])
            }

            previous = matches[index]
        }

        parts.push(template.slice(previous['end']))

        template = parts.join('')

        // strip whitespace
        template = template
            .replace(this.replaceExpressions.EMPTY_COMMENT_TAG, '')
            .replace(this.replaceExpressions.BEFORE_HTML_TAG, '<')
            .replace(this.replaceExpressions.AFTER_HTML_TAG, '>')
            .replace(this.replaceExpressions.NEW_LINE, '')

        // add function source body
        template = 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){\n'
            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});\n'
            + 'var ' + Compiler.settings.VARIABLE_PRINT + ' = \'\';\n'
            + this.buffer.START + template + this.buffer.END
            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';\n}'

        // fix bad code
        template = template
            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '$+=')
            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_LINES, '')

        return this.createTemplateFunction(template)
    }

    private createTemplateFunction(source: string): Templata.Interface.CompileFunction {
        try {
            return Function.call(
                Function.prototype,
                this.importNames.join(','),
                'return ' + source
            ).apply(undefined, this.importValues)
        } catch (e) {
            throw e
        }
    }

    private matchBlocks(input: string): Object[] {
        let match: RegExpExecArray
        let matches: Object[] = []

        this.blockRegex.lastIndex = 0

        while ((match = this.blockRegex.exec(input)) !== null) {
            matches.push(
                {
                    start: match.index,
                    content: this.parseBlock(match),
                    end: match.index + match[Match.FULL_MATCH].length
                }
            )
        }

        return matches
    }

    private parseBlock(match: RegExpExecArray): string {
        let input: string = unescape(match[Match.FULL_MATCH].slice(
            Compiler.settings.DELIMITER.OPENING_BLOCK.length,
            match[Match.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length
        ))

        let properties: Templata.Object.BlockProperties = this.getBlockProperties(input)

        if (this.helper[properties.OPERATOR]) {
            if (properties.FILTER.length > 0) {
                return this.callFilterList(properties.FILTER, this.callHelper(properties))
            } else {
                return this.callHelper(properties)
            }
        }

        return input
    }

    private getBlockProperties(blockString: string): Templata.Object.BlockProperties {
        let operator: string = this.getBlockOperator(blockString)
        let closing: boolean = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING
        let selfClosing: boolean = (!closing)
            ? (blockString.slice((operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length))
            === Compiler.settings.DELIMITER.SPACE + operator
            : false
        let parameter: string = this.getBlockParameter(blockString, operator, selfClosing)
        let filter: string[] = this.getBlockFilter(parameter)

        return {
            OPERATOR: operator,
            FILTER: filter,
            PARAMETER: this.removeBlockFilter(parameter),
            CLOSING: closing,
            SELF_CLOSING: selfClosing
        }
    }

    private getBlockOperator(blockString: string): string {
        let index: number = blockString.indexOf(Compiler.settings.DELIMITER.SPACE, 0)
        let closing: boolean = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING
        return blockString.slice((closing) ? 1 : 0, (index > 0) ? index : blockString.length)
    }

    private getBlockParameter(blockString: string, operator: string, selfClosing: boolean): string {
        let start: number = operator.length + Compiler.settings.DELIMITER.SPACE.length
        let end: number = (selfClosing)
            ? blockString.length - (operator.length + Compiler.settings.DELIMITER.SPACE.length)
            : blockString.length

        return blockString.slice(start, end)
    }

    private getBlockFilter(parameter: string): string[] {
        let filter: string[] = []
        let filterSeperator: string = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE
        let index: number = parameter.indexOf(filterSeperator)
        let previous: number

        while (index > 0) {
            previous = index
            index = parameter.indexOf(filterSeperator, index + 1)

            if (index > 0) {
                filter.push(stringTrim(parameter.slice(previous + filterSeperator.length, index)))
            }
        }

        if (previous && previous > -1) {
            filter.push(stringTrim(parameter.slice(previous + filterSeperator.length)))
        }

        return filter
    }

    private removeBlockFilter(parameter: string): string {
        let filterSeperator: string = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE
        let index: number = parameter.indexOf(filterSeperator)

        if (index > 0) {
            return parameter.slice(0, index)
        }

        return parameter
    }

    private callFilterList(filterList: string[], input: string): string {
        let filterLength: number = filterList.length
        let index: number = -1

        while (++index < filterLength) {
            input = this.callFilter(filterList[index], input)
        }

        return input
    }

    private callHelper(properties: Templata.Object.BlockProperties): string {
        try {
            return this.helper[properties.OPERATOR](
                properties.OPERATOR,
                properties.PARAMETER,
                properties.SELF_CLOSING,
                properties.CLOSING,
                this.buffer,
                this
            )
        } catch (e) {
            return ''
        }
    }

    private callFilter(name: string, input: string): string {
        try {
            return this.filter[name](name, input, this.buffer, this)
        } catch (e) {
            return input
        }
    }

    private setupImports(imports: Object): void {
        let length: number = 0
        let index: number = -1

        this.importNames = objectKeys(imports)
        this.importValues = Array(this.importNames.length)

        length = this.importNames.length

        while (++index < length) {
            this.importValues[index] = imports[this.importNames[index]]
        }
    }

    private setupRegularExpressions(): void {
        this.blockRegex = new RegExp(
            regexEscape(Compiler.settings.DELIMITER.OPENING_BLOCK)
            + '.+?'
            + regexEscape(Compiler.settings.DELIMITER.CLOSING_BLOCK),
            'g'
        )

        this.replaceExpressions.EMPTY_APPEND_BUFFER = new RegExp(
            '(' + Compiler.settings.VARIABLE_PRINT
            + '\\+\\=[\\\'\\"]{2}\\;)' + '|(\\+[\\\'\\"]{2})',
            'g'
        )

        this.replaceExpressions.EMPTY_START_BUFFER = new RegExp(
            '(' + Compiler.settings.VARIABLE_PRINT
            + ')\\+\\=[\\\'\\"]{2}\\+',
            'g'
        )
    }

    private setupBuffer(): void {
        let variableRegex: RegExp = /__variable__/g

        this.buffer.START = Compiler.settings.VARIABLE_PRINT + '+=\''
    }
}
