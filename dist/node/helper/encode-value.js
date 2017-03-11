"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_escape_1 = require("../lib/html-escape");
var string_trim_1 = require("../lib/string-trim");
function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
    compiler.registerImport('__htmlEscape', html_escape_1.default);
    return buffer.APPEND + '__htmlEscape(' + string_trim_1.default(parameter) + ')' + buffer.POST_APPEND;
}
exports.default = default_1;
