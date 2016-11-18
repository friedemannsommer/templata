const Compiler = require('./dist/node/lib/compiler.js').default
const template = require('./dist/node/template.js').default

/* eslint-disable object-shorthand */
module.exports = {
    Compiler: Compiler,
    compiler: Compiler,
    template: template
}
