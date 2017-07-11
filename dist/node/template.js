"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("./lib/compiler");
var comment_1 = require("./helper/comment");
var condition_1 = require("./helper/condition");
var encode_value_1 = require("./helper/encode-value");
var iterate_1 = require("./helper/iterate");
var print_1 = require("./helper/print");
var pure_javascript_1 = require("./helper/pure-javascript");
var currency_1 = require("./filter/currency");
var lowercase_1 = require("./filter/lowercase");
var uppercase_1 = require("./filter/uppercase");
var defaultHelper = {
    '!': encode_value_1.default,
    '*': comment_1.default,
    '-': pure_javascript_1.default,
    '=': print_1.default,
    '?': condition_1.default,
    '??': condition_1.default,
    '~': iterate_1.iterate
};
var defaultFilter = {
    currency: currency_1.default,
    lowercase: lowercase_1.default,
    uppercase: uppercase_1.default
};
function template(templateString, imports) {
    if (imports === void 0) { imports = {}; }
    return new compiler_1.default(imports, defaultHelper, defaultFilter).initialize(iterate_1.initialize).compile(templateString);
}
exports.default = template;
