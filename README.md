# Templata (Template Compiler)
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
let templateString:string = `<span class="name">{{= local.name}}</span>`;
// pass template string to templateCompiler
let compiledTemplate:CompiledTemplateFunction = template(templateString);
// run the compiled template with data
let output:string = compiledTemplate({name: 'John White'});
// use the template
console.log(output); // <span class="name">John White</span>
```
## Interpolation
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
## Conditional
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
## Iteration
```html
<!-- start loop -->
{{~ local.arrayOrObject :value,key: ~}}
<!-- use value or key in here -->
{{= key =}}: {{= value =}}
<!-- end loop -->
{{/~}}
```
## JavaScript
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
## Comments
```html
{{* comment which is not visible after compilation *}}
```
