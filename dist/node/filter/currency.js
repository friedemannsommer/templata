"use strict";
var remove_previous_buffer_1 = require("../lib/remove-previous-buffer");
var string_trim_1 = require("../lib/string-trim");
function currency(input) {
    return input.replace(/(?:([0-9]+?[\.\,]+?[0-9]+?)|([0-9]+?))(?:\s|[^0-9]|$)/g, function (match, floatString) {
        if (floatString.indexOf(',') > -1) {
            return parseFloat(floatString.replace(',', '.')).toFixed(2);
        }
        else {
            return parseFloat(floatString).toFixed(2);
        }
    });
}
function filterCurrency(name, input, buffer, compiler) {
    compiler.registerImport('__f_currency', currency);
    return buffer.APPEND + '__f_currency(' + string_trim_1.default(remove_previous_buffer_1.default(input, buffer)) + ')' + buffer.POST_APPEND;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = filterCurrency;
