"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_trim_1 = require("../lib/string-trim");
function javascript(_operator, parameter, _selfClosing, _closingTag, buffer, _compiler) {
    return buffer.END + string_trim_1.default(parameter) + buffer.START;
}
exports.default = javascript;
