/* tslint:disable no-internal-module no-namespace */
declare module Templata {
    export class ICompiler {
        public static settings: Templata.ICompilerSettings
        public constructor(imports?: object, helper?: object, filter?: object, provider?: object)
        public registerImport(name: string, imports: any): ICompiler
        public hasImport(name: string): boolean
        public removeImport(name: string): ICompiler
        public registerHelper(operator: string, callback: IHelper): ICompiler
        public hasHelper(operator: string): boolean
        public removeHelper(operator: string): ICompiler
        public registerFilter(name: string, callback: IFilter): ICompiler
        public hasFilter(name: string): boolean
        public removeFilter(name: string): ICompiler
        public registerProvider(name: string, callback: IProvider): ICompiler
        public hasProvider(name: string): boolean
        public removeProvider(name: string): ICompiler
        public callProvider(name: string, ...args: any[]): any
        public on(name: string, callback: IListener): ICompiler
        public off(name: string, callback: IListener): ICompiler
        public dispatch(name: string, ...data: any[]): void
        public initialize(fn: IInitializeFunction): ICompiler
        public compile(template: string): (data: object) => string
    }

    export type IFilter = (
        name: string,
        input: string,
        buffer: Templata.IBuffer,
        compiler: ICompiler
    ) => string

    export type IHelper = (
        operator: string,
        parameter: string,
        selfClosing: boolean,
        closingTag: boolean,
        buffer: Templata.IBuffer,
        compiler: ICompiler
    ) => string

    export type IProvider = (
        name: string,
        ...args: any[]
    ) => void

    export type IListener = (
        name: string,
        compiler: ICompiler,
        ...data: any[]
    ) => void

    export type ICompileFunction = (data: object) => string

    export type IInitializeFunction = (compiler: ICompiler) => void

    export interface IGenricIndexObject<T> {
        [name: string]: T
    }

    export interface IGenricIndexObjectArray<T> {
        [name: string]: T[]
    }

    export interface IBlockProperties extends Object {
        OPERATOR: string
        PARAMETER: string
        FILTER: string[]
        CLOSING: boolean
        SELF_CLOSING: boolean
    }

    export interface IBuffer extends Object {
        POST_APPEND: string
        APPEND: string
        START: string
        END: string
    }

    export interface ICompilerSettings extends Object {
        VARIABLE_NAME: string
        VARIABLE_PRINT: string
        DELIMITER: IDelimiter
    }

    export interface IDelimiter extends Object {
        FILTER_SEPERATOR: string
        OPENING_BLOCK: string
        CLOSING_BLOCK: string
        CLOSING: string
        SPACE: string
    }

    export interface IRegularExpressions extends Object {
        NEW_LINE: RegExp
        AFTER_HTML_TAG: RegExp
        BEFORE_HTML_TAG: RegExp
        EMPTY_COMMENT_TAG: RegExp
        EMPTY_LINES: RegExp
        EMPTY_APPEND_BUFFER: RegExp
        EMPTY_START_APPEND_BUFFER: RegExp
        EMPTY_START_BUFFER: RegExp
    }

    export interface IMatchExpressions extends Object {
        BLOCK_LIST: RegExp
    }

    export interface IMatchObject extends Object {
        content: string
        end: number
        start: number
    }
}
