# Templata (Template Compiler)
![CI](https://github.com/friedemannsommer/templata/workflows/Node%20CI/badge.svg)
[![coverage](https://img.shields.io/coveralls/friedemannsommer/templata.svg?maxAge=2592000)](https://coveralls.io/github/friedemannsommer/templata)
[![development dependencies](https://img.shields.io/david/dev/friedemannsommer/templata.svg?maxAge=2592000)](https://david-dm.org/friedemannsommer/templata?type=dev)
[![npm](https://img.shields.io/npm/dt/templata.svg?maxAge=2592000)](https://www.npmjs.com/package/templata)
[![npm version](https://img.shields.io/npm/v/templata.svg?maxAge=2592000)](https://www.npmjs.com/package/templata)
[![GitHub version](https://img.shields.io/github/tag/friedemannsommer/templata.svg?maxAge=2592000)](https://github.com/friedemannsommer/templata)
[![license](https://img.shields.io/npm/l/templata.svg?maxAge=2592000)](https://www.npmjs.com/package/templata)

## FAQ
> Q: How can I create a custom helper?  
> A: You should take a look at ["src/helper"](https://github.com/friedemannsommer/templata/blob/master/src/helper) there are several example implementations.

> Q: How can I create a custom filter?  
> A: You should take a look at ["src/filter"](https://github.com/friedemannsommer/templata/tree/master/src/filter) there are several example implementations.

> Q: Why a template compiler with out any logic itself?  
> A: I needed a simple modifiable parser which allows me to create my own logic.

> Q: Why should I "import" functions into the template?  
> A: You don't need to. But I recommend to just pass a reference to your function instead of passing your function source

## Compiler API
```typescript
class Compiler {
    static settings: CompilerSettings
    constructor(imports?: Object, helper?: Object, filter?: Object, provider?: Object)
    registerImport(name: string, imports: any): Compiler
    hasImport(name: string): boolean
    removeImport(name: string): Compiler
    registerHelper(operator: string, callback: Helper): Compiler
    hasHelper(operator: string): boolean
    removeHelper(operator: string): Compiler
    registerFilter(name: string, callback: Filter): Compiler
    hasFilter(name: string): boolean
    removeFilter(name: string): Compiler
    registerProvider(name: string, callback: Provider): Compiler
    hasProvider(name: string): boolean
    removeProvider(name: string): Compiler
    callProvider(name: string, ...args: any[]): any
    on(name: string, callback: Listener): Compiler
    off(name: string, callback: Listener): Compiler
    dispatch(name: string, ...data: any[]): void
    initialize(fn: InitializeFunction): Compiler
    compile(template: string): (data: Object) => string
}

interface Buffer extends Object {
    POST_APPEND: string
    APPEND: string
    START: string
    END: string
}

interface CompilerSettings extends Object {
    VARIABLE_NAME: string
    VARIABLE_PRINT: string
    DELIMITER: {
        FILTER_SEPERATOR: string
        OPENING_BLOCK: string
        CLOSING_BLOCK: string
        CLOSING: string
        SPACE: string
    }
}

interface Filter extends Function {
    (name: string, input: string, buffer: Templata.Object.Buffer, compiler: Compiler): string
}

interface Helper extends Function {
    (operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Compiler): string
}

interface Provider extends Function {
    (name: string, ...args: any[]): void
}

interface Listener extends Function {
    (name: string, compiler: Compiler, ...data: any[]): void
}

interface CompileFunction extends Function {
    (data: Object): string
}

interface InitializeFunction extends Function {
    (compiler: Compiler): void
}
```

## Default helper (optional)
### Interpolation
```html
<!-- render name -->
<span class="name">{{= local.name =}}</span>
<!-- render HTML-Encoded adCode -->
<input type="text" value="{{! local.adCode !}}">
<!-- use filter -->
<span class="name">{{= local.name | lowercase =}}</span>
<span class="name">{{= local.name | uppercase =}}</span>
<span class="price">{{= local.price | currency =}}</span>
```
### Conditional
```html
<!-- if(condition) -->
{{? true ?}}
<!-- else if(condition) -->
{{?? false ??}}
<!-- else -->
{{? ?}}
<!-- close if -->
{{/?}}
```
### Iteration
```html
<!-- start loop -->
{{~ local.arrayOrObject :value,key: ~}}
<!-- use value or key in here -->
{{= key =}}: {{= value =}}
<!-- end loop -->
{{/~}}
```
### JavaScript
```html
<!-- define custom variable -->
{{- var variable = 'example content'; -}}
<!-- do whate ever you want -->
{{- function localFn(x, y){return x > y;} -}}
<!-- use your custom code -->
<!-- prints "EXAMPLE CONTENT" -->
{{= variable | uppercase =}}
<!-- prints "5 is bigger then 2" -->
{{? localFn(5,2) ?}}{{= '5 is bigger then 2' =}}{{/?}}
```
### Comments
```html
{{* comment which is not visible after compilation *}}
```
