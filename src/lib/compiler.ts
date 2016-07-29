import '../typings/index.d.ts'

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

    private _importNames: string[]
    private _importValues: any[]
    private _blockRegex: RegExp
    private _listener: Object
    private _provider: Object
    private _helper: Object
    private _filter: Object

    constructor(imports: Object = {}, helper: Object = {}, filter: Object = {}, provider: Object = {}) {
        this._setupImports(imports)
        this._provider = provider
        this._helper = helper
        this._filter = filter
        this._listener = {}
        
        this._setupRegularExpressions()
        this._setupBuffer()
        this._bootUp()
    }

    public registerImport(name: string, imports: any): void {
        if (this._importNames.indexOf(name) < 0) {
            this._importNames.push(name)
            this._importValues.push(imports)
        }
    }

    public removeImport(name: string): void {
        let index: number = this._importNames.indexOf(name)

        if (index > -1) {
            this._importNames.splice(index, 1)
            this._importValues.splice(index, 1)
        }
    }

    public registerHelper(operator: string, callback: Templata.Interface.Helper): void {
        if (operator.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING) {
            throw Error(`Helper cannot start with "${Compiler.settings.DELIMITER.CLOSING}"!`)
        }

        this._helper[operator] = callback
    }

    public removeHelper(operator: string): void {
        delete this._helper[operator]
    }

    public registerFilter(name: string, callback: Templata.Interface.Filter): void {
        this._filter[name] = callback
    }

    public removeFilter(name: string): void {
        delete this._filter[name]
    }

    public registerProvider(name: string, callback: Templata.Interface.Provider): void {
        this._provider[name] = callback
    }

    public removeProvider(name: string): void {
        delete this._provider[name]
    }

    public on(name: string, callback: Templata.Interface.Listener): void {
        if (this._listener.hasOwnProperty(name)) {
            this._listener[name].push(callback)
        } else {
            this._listener[name] = [callback]
        }
    }

    public off(name: string, callback: Templata.Interface.Listener): void {
        if (!this._listener.hasOwnProperty(name)) {
            return void 0
        }

        let index: number = -1
        let length: number = (<Function[]>this._listener[name]).length

        while (++index < length) {
            if (this._listener[name][index] === callback) {
                (<Function[]>this._listener[name]).splice(index, 1)
                length = this._listener[name].length
            }
        }
    }

    public dispatch(name: string, data?: any): void {
        if (!this._listener.hasOwnProperty(name)) {
            return void 0
        }

        let index: number = -1
        let length: number = (<Function[]>this._listener[name]).length

        while (++index < length) {
            (<Templata.Interface.Listener>this._listener[name][index])(name, this, data)
        }
    }

    public callProvider(name: string, ...args: any[]): any {
        try {
            return this._provider[name].apply(undefined, [name, ...args])
        } catch (e) {
            // bubble the error to caller
            throw e
        }
    }

    public compile(template: string): Templata.Interface.CompileFunction {
        this.dispatch('COMPILE_START')

        template = escape(template)

        return this._createTemplateFunction(
            this._optimizeTemplate(
                this._concatTemplateParts(
                    this._matchBlocks(template),
                    template
                )
            )
        )
    }

    private _createTemplateFunction(source: string): Templata.Interface.CompileFunction {
        this.dispatch('COMPILE_END')

        try {
            return new Function(
                this._importNames.join(','),
                'return ' + source
            ).apply(undefined, this._importValues)
        } catch (e) {
            // bubble the error to caller
            throw e
        }
    }

    private _matchBlocks(input: string): Object[] {
        let match: RegExpExecArray
        let matches: Object[] = []

        this._blockRegex.lastIndex = 0

        while ((match = this._blockRegex.exec(input)) !== null) {
            matches.push(
                {
                    start: match.index,
                    content: this._parseBlock(match),
                    end: match.index + match[Match.FULL_MATCH].length
                }
            )
        }

        return matches
    }

    private _parseBlock(match: RegExpExecArray): string {
        let input: string = unescape(match[Match.FULL_MATCH].slice(
            Compiler.settings.DELIMITER.OPENING_BLOCK.length,
            match[Match.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length
        ))

        let properties: Templata.Object.BlockProperties = this._getBlockProperties(input)

        if (this._helper[properties.OPERATOR]) {
            if (properties.FILTER.length > 0) {
                return this._callFilterList(properties.FILTER, this._callHelper(properties))
            } else {
                return this._callHelper(properties)
            }
        }

        return input
    }

    private _getBlockProperties(blockString: string): Templata.Object.BlockProperties {
        let operator: string = this._getBlockOperator(blockString)
        let closing: boolean = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING
        let selfClosing: boolean = (!closing)
            ? (blockString.slice((operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length))
            === Compiler.settings.DELIMITER.SPACE + operator
            : false
        let parameter: string = this._getBlockParameter(blockString, operator, selfClosing)
        let filter: string[] = this._getBlockFilter(parameter)

        return {
            OPERATOR: operator,
            FILTER: filter,
            PARAMETER: this._removeBlockFilter(parameter),
            CLOSING: closing,
            SELF_CLOSING: selfClosing
        }
    }

    private _getBlockOperator(blockString: string): string {
        let index: number = blockString.indexOf(Compiler.settings.DELIMITER.SPACE, 0)
        let closing: boolean = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING
        return blockString.slice((closing) ? 1 : 0, (index > 0) ? index : blockString.length)
    }

    private _getBlockParameter(blockString: string, operator: string, selfClosing: boolean): string {
        let start: number = operator.length + Compiler.settings.DELIMITER.SPACE.length
        let end: number = (selfClosing)
            ? blockString.length - (operator.length + Compiler.settings.DELIMITER.SPACE.length)
            : blockString.length

        return blockString.slice(start, end)
    }

    private _getBlockFilter(parameter: string): string[] {
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

    private _concatTemplateParts(matches: Object[], template: string): string {
        let previous: Object
        let index: number = -1
        let parts: string[] = []
        let length: number = matches.length

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

        if (previous) {
            parts.push(template.slice(previous['end']))
            template = parts.join('')
        }

        return template
    }

    private _addFnBody(template: string): string {
        return 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){\n'
            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});\n'
            + 'var ' + Compiler.settings.VARIABLE_PRINT + ' = \'\';\n'
            + this.buffer.START + template + this.buffer.END
            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';\n}'
    }

    private _removeBlockFilter(parameter: string): string {
        let filterSeperator: string = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE
        let index: number = parameter.indexOf(filterSeperator)

        if (index > 0) {
            return parameter.slice(0, index)
        }

        return parameter
    }

    private _optimizeTemplate(template: string): string {
        return this._optimizeFnSource(
            this._addFnBody(
                template
                    .replace(this.replaceExpressions.EMPTY_COMMENT_TAG, '')
                    .replace(this.replaceExpressions.BEFORE_HTML_TAG, '<')
                    .replace(this.replaceExpressions.AFTER_HTML_TAG, '>')
                    .replace(this.replaceExpressions.NEW_LINE, '')
            )
        )
    }

    private _optimizeFnSource(template: string): string {
        return template
            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '$1+=')
            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_LINES, '')
    }

    private _callFilterList(filterList: string[], input: string): string {
        let filterLength: number = filterList.length
        let index: number = -1

        while (++index < filterLength) {
            input = this._callFilter(filterList[index], input)
        }

        return input
    }

    private _callHelper(properties: Templata.Object.BlockProperties): string {
        try {
            return this._helper[properties.OPERATOR](
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

    private _callFilter(name: string, input: string): string {
        try {
            return this._filter[name](
                name,
                input,
                this.buffer,
                this
            )
        } catch (e) {
            return input
        }
    }

    private _bootUp(): void {
        let keys: string[] = objectKeys(this._helper)
        let index: number = -1
        let length: number = keys.length

        while (++index < length) {
            if (typeof this._helper[keys[index]]['bootUp'] === 'function') {
                this._helper[keys[index]]['bootUp'](keys[index], this)
            }
        }
    }

    private _setupImports(imports: Object): void {
        let length: number = 0
        let index: number = -1

        this._importNames = objectKeys(imports)
        this._importValues = Array(this._importNames.length)

        length = this._importNames.length

        while (++index < length) {
            this._importValues[index] = imports[this._importNames[index]]
        }
    }

    private _setupRegularExpressions(): void {
        this._blockRegex = new RegExp(
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

    private _setupBuffer(): void {
        this.buffer.START = Compiler.settings.VARIABLE_PRINT + '+=\''
    }
}
