/// <reference path="../typings/index.d.ts" />

import regexEscape from './regex-escape'
import objectKeys from './object-keys'
import stringTrim from './string-trim'
import escape from './escape'

enum RegEx {
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
        EMPTY_APPEND_BUFFER: /\s*\+\s*([\'\"]{1})(?=\1)/g,
        EMPTY_START_APPEND_BUFFER: null,
        EMPTY_START_BUFFER: null
    }

    protected matchExpressions: Templata.Object.MatchExpressions = {
        BLOCK_LIST: null
    }

    protected buffer: Templata.Object.Buffer = {
        APPEND: '\'+(',
        POST_APPEND: ')+\'',
        START: null,
        END: '\';\n'
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

    public registerHelper(operator: string, callback: Templata.Interface.Helper): Compiler {
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

    public registerFilter(name: string, callback: Templata.Interface.Filter): Compiler {
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

    public registerProvider(name: string, callback: Templata.Interface.Provider): Compiler {
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

    public on(name: string, callback: Templata.Interface.Listener): Compiler {
        if (this._listener.hasOwnProperty(name)) {
            this._listener[name].push(callback)
        } else {
            this._listener[name] = [callback]
        }

        return this
    }

    public off(name: string, callback: Templata.Interface.Listener): Compiler {
        if (!this._listener.hasOwnProperty(name)) {
            return this
        }

        let index: number = -1
        let length: number = (<Function[]>this._listener[name]).length

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

        let index: number = -1
        let length: number = (<Function[]>this._listener[name]).length

        while (++index < length) {
            (<Templata.Interface.Listener>this._listener[name][index]).apply(undefined, [name, this, ...data])
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

    public initialize(helper: Templata.Interface.InitializeFunction): Compiler {
        helper(this)

        return this
    }

    public compile(template: string): Templata.Interface.CompileFunction {
        if (typeof template !== 'string') {
            throw new Error(`Expected parameter "template" tobe typeof "string" but instead got "${typeof template}"`)
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

        this.matchExpressions.BLOCK_LIST.lastIndex = 0

        while ((match = this.matchExpressions.BLOCK_LIST.exec(input)) !== null) {
            matches.push(
                {
                    start: match.index,
                    content: this._parseBlock(match),
                    end: match.index + match[RegEx.FULL_MATCH].length
                }
            )
        }

        return matches
    }

    private _parseBlock(match: RegExpExecArray): string {
        let input: string = match[RegEx.FULL_MATCH].slice(
            Compiler.settings.DELIMITER.OPENING_BLOCK.length,
            match[RegEx.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length
        )
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
        let closing: boolean = this._isClosingBlock(blockString)
        let selfClosing: boolean = this._isSelfClosingBlock(blockString, operator, closing)
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

        return blockString.slice(
            (closing)
                ? Compiler.settings.DELIMITER.CLOSING.length
                : 0,
            (index > 0)
                ? index
                : blockString.length
        )
    }

    private _isClosingBlock(blockString: string): boolean {
        return blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING
    }

    private _isSelfClosingBlock(blockString: string, operator: string, closing: boolean): boolean {
        if (!closing) {
            return (
                blockString.slice(
                    (operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length
                )
            ) === Compiler.settings.DELIMITER.SPACE + operator
        }

        return false
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
        return 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){'
            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});'
            + 'var ' + Compiler.settings.VARIABLE_PRINT + '=\'\';'
            + this.buffer.START + template + this.buffer.END
            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';}'
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
            .replace(this.replaceExpressions.EMPTY_START_APPEND_BUFFER, '$1+=')
            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '')
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
