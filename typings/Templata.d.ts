declare module Templata {
    export module Interface {
        export class Compiler {
            constructor(imports: Object, helper: Object, filter: Object)
            registerImport(name: string, imports: any): void
            removeImport(name: string): void
            registerHelper(operator: string, callback: Helper): void
            removeHelper(operator: string): void
            registerFilter(name: string, callback: Filter): void
            removeFilter(name: string): void
            compile(template: string): (data: Object) => string
        }

        export interface Filter extends Function {
            (name: string, input: string, buffer: Templata.Object.Buffer, compiler: Compiler): string
        }

        export interface Helper extends Function {
            (operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Compiler): string
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
            DELIMITER: Delimiter
        }

        export interface Delimiter extends Object {
            FILTER_SEPERATOR: string
            OPENING_BLOCK: string
            CLOSING_BLOCK: string
            CLOSING: string
            SPACE: string
        }
    }
}
