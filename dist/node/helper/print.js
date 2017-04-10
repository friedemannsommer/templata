"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_trim_1 = require("../lib/string-trim");
var unescape_1 = require("../lib/unescape");
function print(_operator, parameter, _selfClosing, _closingTag, buffer, _compiler) {
    return buffer.APPEND + string_trim_1.default(unescape_1.default(parameter)) + buffer.POST_APPEND;
}
exports.default = print;
