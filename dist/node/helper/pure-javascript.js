"use strict";
var string_trim_1 = require("../lib/string-trim");
function javascript(operator, parameter, selfClosing, closingTag, buffer, compiler) {
    return buffer.END + string_trim_1.default(parameter) + buffer.START;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = javascript;
