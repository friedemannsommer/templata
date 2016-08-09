# Templata (Template Compiler)
[![Build Status](https://api.travis-ci.org/friedemannsommer/templata.svg)](https://travis-ci.org/friedemannsommer/templata)
[![Coverage Status](https://coveralls.io/repos/github/friedemannsommer/templata/badge.svg)](https://coveralls.io/github/friedemannsommer/templata)
[![Code Climate](https://codeclimate.com/github/friedemannsommer/templata/badges/gpa.svg)](https://codeclimate.com/github/friedemannsommer/templata)
[![Issue Count](https://codeclimate.com/github/friedemannsommer/templata/badges/issue_count.svg)](https://codeclimate.com/github/friedemannsommer/templata)
[![Dependencies](https://david-dm.org/friedemannsommer/templata.svg)](https://david-dm.org/friedemannsommer/templata)
[![Development Dependencies](https://david-dm.org/friedemannsommer/templata/dev-status.svg)](https://david-dm.org/friedemannsommer/templata?type=dev)
## Example
```typescript
/**
 * TypeScript Browser / Client
 **/
import template from '/path/to/src/template';
/**
 * JavaScript Browser
 **/
let template = Templata.default;
/**
 * NodeJS
 **/
const template = require('templata').template;

// define template string
let templateString: string = `<span class="name">{{= local.name}}</span>`;
// pass template string to templateCompiler
let compiledTemplate: CompiledTemplateFunction = template(templateString);
// run the compiled template with data
let output: string = compiledTemplate({name: 'John White'});
// use the template
console.log(output); // <span class="name">John White</span>
```
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
## FAQ
> Q: How can I create my own Helper?  
> A: You should take a look at "src/helper" there are several example implementations.

> Q: How can I create my own Filter?  
> A: You should take a look at "src/filter" there are several example implementations.

> Q: Why a Template Compiler with out any Logic itself?  
> A: I needed a simple modifieable Parser which allows me to create my own Logic.

> Q: Why should I "import" Functions into the Template?  
> A: You don't need to. But I recommend to just pass a reference to your Function.