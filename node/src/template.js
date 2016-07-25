"use strict";
var compiler_1 = require('./lib/compiler');
var pure_javascript_1 = require('./helper/pure-javascript');
var encode_value_1 = require('./helper/encode-value');
var condition_1 = require('./helper/condition');
var iterate_1 = require('./helper/iterate');
var comment_1 = require('./helper/comment');
var print_1 = require('./helper/print');
var lowercase_1 = require('./filter/lowercase');
var uppercase_1 = require('./filter/uppercase');
var currency_1 = require('./filter/currency');
var defaultHelper = {
    '??': condition_1.default,
    '-': pure_javascript_1.default,
    '!': encode_value_1.default,
    '?': condition_1.default,
    '~': iterate_1.default,
    '*': comment_1.default,
    '=': print_1.default
};
var defaultFilter = {
    'lowercase': lowercase_1.default,
    'uppercase': uppercase_1.default,
    'currency': currency_1.default
};
function template(template, imports) {
    if (imports === void 0) { imports = {}; }
    return new compiler_1.default(imports, defaultHelper, defaultFilter).compile(template);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = template;
