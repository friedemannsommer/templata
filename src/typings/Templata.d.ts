declare module Templata {
    export module Interface {
        export class Compiler {
            constructor(imports?: Object, helper?: Object, filter?: Object, provider?: Object)
            registerImport(name: string, imports: any): void
            removeImport(name: string): void
            registerHelper(operator: string, callback: Helper): void
            removeHelper(operator: string): void
            registerFilter(name: string, callback: Filter): void
            removeFilter(name: string): void
            registerProvider(name: string, callback: Provider): void
            removeProvider(name: string): void
            callProvider(name: string, ...args: any[]): any
            on(name: string, callback: Listener): void
            off(name: string, callback: Listener): void
            dispatch(name: string, data: any): void
            compile(template: string): (data: Object) => string
        }

        export interface Filter extends Function {
            (name: string, input: string, buffer: Templata.Object.Buffer, compiler: Compiler): string
        }

        export interface Helper extends Function {
            (operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Compiler): string
        }

        export interface Provider extends Function {
            (name: string, ...args: any[]): void
        }

        export interface Listener extends Function {
            (name: string, compiler: Compiler, data?: any): void
        }

        export interface CompileFunction extends Function {
            (data: Object): string
        }
    }

    export module Object {
        export interface BlockProperties extends Object {
            OPERATOR: string
            PARAMETER: string
            FILTER: string[]
            CLOSING: boolean
            SELF_CLOSING: boolean
        }

        export interface Buffer extends Object {
            POST_APPEND: string
            APPEND: string
            START: string
            END: string
        }

        export interface CompilerSettings extends Object {
            VARIABLE_NAME: string
            VARIABLE_PRINT: string
            DELIMITER: Delimiter
        }

        export interface Delimiter extends Object {
            FILTER_SEPERATOR: string
            OPENING_BLOCK: string
            CLOSING_BLOCK: string
            CLOSING: string
            SPACE: string
        }

        export interface RegularExpressions extends Object {
            NEW_LINE: RegExp
            AFTER_HTML_TAG: RegExp
            BEFORE_HTML_TAG: RegExp
            EMPTY_COMMENT_TAG: RegExp
            EMPTY_LINES: RegExp
            EMPTY_START_BUFFER: RegExp
            EMPTY_APPEND_BUFFER: RegExp
        }
    }
}
