/// <reference path="../typings/index.d.ts" />

import escape from './escape'
import objectKeys from './object-keys'
import regexEscape from './regex-escape'
import stringTrim from './string-trim'

enum RegEx {
    FULL_MATCH = 0
}

export default class Compiler implements Templata.ICompiler {
    public static settings: Templata.ICompilerSettings = {
        DELIMITER: {
            CLOSING: '/',
            CLOSING_BLOCK: '}}',
            FILTER_SEPERATOR: '|',
            OPENING_BLOCK: '{{',
            SPACE: ' '
        },
        VARIABLE_NAME: 'local',
        VARIABLE_PRINT: '__print'
    }

    protected replaceExpressions: Templata.IRegularExpressions = {
        AFTER_HTML_TAG: />\s+/g,
        BEFORE_HTML_TAG: /\s+</g,
        EMPTY_APPEND_BUFFER: /\s*\+\s*([\'\"]{1})\1/g,
        EMPTY_COMMENT_TAG: /<!--[\s\S]*?-->/g,
        EMPTY_LINES: /^(?:\s*?)$/gm,
        EMPTY_START_APPEND_BUFFER: null,
        EMPTY_START_BUFFER: null,
        NEW_LINE: /\r|\n|\t|\/\*[\s\S]*?\*\//g
    }

    protected matchExpressions: Templata.IMatchExpressions = {
        BLOCK_LIST: null
    }

    protected buffer: Templata.IBuffer = {
        APPEND: '\'+(',
        END: '\';',
        POST_APPEND: ')+\'',
        START: null
    }

    private _importNames: string[]
    private _importValues: any[]
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
    }

    public registerImport(name: string, imports: any): Compiler {
        if (!this.hasImport(name)) {
            this._importNames.push(name)
            this._importValues.push(imports)
        }

        return this
    }

    public hasImport(name: string): boolean {
        return this._importNames.indexOf(name) >= 0
    }

    public removeImport(name: string): Compiler {
        let index: number = this._importNames.indexOf(name)

        if (index > -1) {
            this._importNames.splice(index, 1)
            this._importValues.splice(index, 1)
        }

        return this
    }

    public registerHelper(operator: string, callback: Templata.IHelper): Compiler {
        if (operator.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING) {
            throw Error(`Helper cannot start with "${Compiler.settings.DELIMITER.CLOSING}"!`)
        }

        this._helper[operator] = callback

        return this
    }

    public hasHelper(operator: string): boolean {
        return typeof this._helper[operator] === 'function'
    }

    public removeHelper(operator: string): Compiler {
        delete this._helper[operator]

        return this
    }

    public registerFilter(name: string, callback: Templata.IFilter): Compiler {
        this._filter[name] = callback

        return this
    }

    public hasFilter(name: string): boolean {
        return typeof this._filter[name] === 'function'
    }

    public removeFilter(name: string): Compiler {
        delete this._filter[name]

        return this
    }

    public registerProvider(name: string, callback: Templata.IProvider): Compiler {
        this._provider[name] = callback

        return this
    }

    public hasProvider(name: string): boolean {
        return typeof this._provider[name] === 'function'
    }

    public removeProvider(name: string): Compiler {
        delete this._provider[name]

        return this
    }

    public on(name: string, callback: Templata.IListener): Compiler {
        if (this._listener.hasOwnProperty(name)) {
            this._listener[name].push(callback)
        } else {
            this._listener[name] = [callback]
        }

        return this
    }

    public off(name: string, callback: Templata.IListener): Compiler {
        if (!this._listener.hasOwnProperty(name)) {
            return this
        }

        let length: number = (<Function[]>this._listener[name]).length
        let index: number = -1

        while (++index < length) {
            if (this._listener[name][index] === callback) {
                (<Function[]>this._listener[name]).splice(index, 1)
                length = this._listener[name].length
            }
        }

        return this
    }

    public dispatch(name: string, ...data: any[]): void {
        if (!this._listener.hasOwnProperty(name)) {
            return void 0
        }

        const length: number = (<Function[]>this._listener[name]).length
        let index: number = -1

        while (++index < length) {
            (<Templata.IListener>this._listener[name][index]).apply(undefined, [name, this, ...data])
        }
    }

    public callProvider(name: string, ...args: any[]): any {
        return this._provider[name].apply(undefined, [name, ...args])
    }

    public initialize(helper: Templata.IInitializeFunction): Compiler {
        helper(this)

        return this
    }

    public compile(template: string): Templata.ICompileFunction {
        if (typeof template !== 'string') {
            throw new Error(`Expected parameter "template" to be typeof "string" but instead got "${typeof template}"`)
        }

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

    private _createTemplateFunction(source: string): Templata.ICompileFunction {
        this.dispatch('COMPILE_END')

        return new Function(
            this._importNames.join(','),
            'return ' + source
        ).apply(undefined, this._importValues)
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

    private _addFnBody(template: string): string {
        return 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){'
            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});'
            + 'var ' + Compiler.settings.VARIABLE_PRINT + '=\'\';'
            + this.buffer.START + template + this.buffer.END
            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';}'
    }

    private _optimizeFnSource(template: string): string {
        return template
            .replace(this.replaceExpressions.EMPTY_START_APPEND_BUFFER, '$1+=')
            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_LINES, '')
    }

    private _concatTemplateParts(matches: Templata.IMatchObject[], template: string): string {
        const length: number = matches.length
        let previous: Templata.IMatchObject = null
        let result: string = ''
        let index: number = -1

        while (++index < length) {
            if (previous !== null) {
                result += template.slice(previous.end, matches[index].start)
                    + matches[index].content
            } else {
                result += template.slice(0, matches[index].start)
                    + matches[index].content
            }

            previous = matches[index]
        }

        if (previous !== null) {
            result += template.slice(previous.end)
        }

        return result
    }

    private _matchBlocks(input: string): Templata.IMatchObject[] {
        const matches: Templata.IMatchObject[] = []
        let match: RegExpExecArray

        this.matchExpressions.BLOCK_LIST.lastIndex = 0
        match = this.matchExpressions.BLOCK_LIST.exec(input)

        while (match !== null) {
            matches.push(
                {
                    content: this._parseBlock(match),
                    end: match.index + match[RegEx.FULL_MATCH].length,
                    start: match.index
                }
            )

            match = this.matchExpressions.BLOCK_LIST.exec(input)
        }

        return matches
    }

    private _parseBlock(match: RegExpExecArray): string {
        const input: string = match[RegEx.FULL_MATCH].slice(
            Compiler.settings.DELIMITER.OPENING_BLOCK.length,
            match[RegEx.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length
        )
        const properties: Templata.IBlockProperties = this._getBlockProperties(input)

        if (this._helper[properties.OPERATOR]) {
            if (properties.FILTER.length > 0) {
                return this._callFilterList(properties.FILTER, this._callHelper(properties))
            } else {
                return this._callHelper(properties)
            }
        }

        return input
    }

    private _getBlockProperties(blockString: string): Templata.IBlockProperties {
        const operator: string = this._getBlockOperator(blockString)
        const closing: boolean = this._isClosingBlock(blockString)
        const selfClosing: boolean = this._isSelfClosingBlock(blockString, operator, closing)
        const parameter: string = this._getBlockParameter(blockString, operator, selfClosing)
        const filter: string[] = this._getBlockFilter(parameter)

        return {
            CLOSING: closing,
            FILTER: filter,
            OPERATOR: operator,
            PARAMETER: this._removeBlockFilter(parameter),
            SELF_CLOSING: selfClosing
        }
    }

    private _getBlockOperator(blockString: string): string {
        const index: number = blockString.indexOf(Compiler.settings.DELIMITER.SPACE, 0)
        const closing: boolean = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING
        let operatorOffset: number = 0
        let operatorEnd: number = blockString.length

        if (closing) {
            operatorOffset = Compiler.settings.DELIMITER.CLOSING.length
        }

        if (index > 0) {
            operatorEnd = index
        }

        return blockString.slice(operatorOffset, operatorEnd)
    }

    private _isClosingBlock(blockString: string): boolean {
        return blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING
    }

    private _isSelfClosingBlock(blockString: string, operator: string, closing: boolean): boolean {
        if (!closing) {
            const closingOperator: string = blockString.slice(
                (operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length
            )

            return closingOperator === (Compiler.settings.DELIMITER.SPACE + operator)
        }

        return false
    }

    private _getBlockParameter(blockString: string, operator: string, selfClosing: boolean): string {
        const start: number = operator.length + Compiler.settings.DELIMITER.SPACE.length
        const end: number = (selfClosing)
            ? blockString.length - (operator.length + Compiler.settings.DELIMITER.SPACE.length)
            : blockString.length

        return blockString.slice(start, end)
    }

    private _getBlockFilter(parameter: string): string[] {
        const filter: string[] = []
        const filterSeperator: string = Compiler.settings.DELIMITER.SPACE
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

        if (previous !== undefined && previous > -1) {
            filter.push(stringTrim(parameter.slice(previous + filterSeperator.length)))
        }

        return filter
    }

    private _removeBlockFilter(parameter: string): string {
        const filterSeperator: string = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE
        let index: number = parameter.indexOf(filterSeperator)

        if (index > 0) {
            return parameter.slice(0, index)
        }

        return parameter
    }

    private _callFilterList(filterList: string[], input: string): string {
        const filterLength: number = filterList.length
        let index: number = -1

        while (++index < filterLength) {
            input = this._callFilter(filterList[index], input)
        }

        return input
    }

    private _callHelper(properties: Templata.IBlockProperties): string {
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
        this.matchExpressions.BLOCK_LIST = new RegExp(
            '__OPENING_BLOCK__.+?__CLOSING_BLOCK__'
                .replace('__OPENING_BLOCK__', regexEscape(Compiler.settings.DELIMITER.OPENING_BLOCK))
                .replace('__CLOSING_BLOCK__', regexEscape(Compiler.settings.DELIMITER.CLOSING_BLOCK)),
            'g'
        )

        this.replaceExpressions.EMPTY_START_BUFFER = new RegExp(
            '__VARIABLE_PRINT__\\s*?\\+=\\s*?([\\\'\\"]{1})\\\u0031\\;'
                .replace('__VARIABLE_PRINT__', regexEscape(Compiler.settings.VARIABLE_PRINT)),
            'g'
        )

        this.replaceExpressions.EMPTY_START_APPEND_BUFFER = new RegExp(
            '(__VARIABLE_PRINT__)\\s*?\\+\\=\\s*?([\\\'\\"]{1})\\\u0032\\s*?\\+'
                .replace('__VARIABLE_PRINT__', regexEscape(Compiler.settings.VARIABLE_PRINT)),
            'g'
        )
    }

    private _setupBuffer(): void {
        this.buffer.START = Compiler.settings.VARIABLE_PRINT + '+=\''
    }
}
