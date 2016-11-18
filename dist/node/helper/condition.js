"use strict";
var string_trim_1 = require("../lib/string-trim");
var unescape_1 = require("../lib/unescape");
function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
    if (closingTag) {
        return buffer.END + '}' + buffer.START;
    }
    switch (operator) {
        case '?':
            if (parameter && parameter !== '') {
                return buffer.END + 'if(' + string_trim_1.default(unescape_1.default(parameter)) + '){' + buffer.START;
            }
            else {
                return buffer.END + '}else{' + buffer.START;
            }
        case '??':
            if (parameter && parameter !== '') {
                return buffer.END + '}else if(' + string_trim_1.default(unescape_1.default(parameter)) + '){' + buffer.START;
            }
            else {
                return buffer.END + '}else{' + buffer.START;
            }
    }
    return parameter;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
