"use strict";
var string_trim_1 = require('../lib/string-trim');
function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
    return buffer.APPEND + string_trim_1.default(parameter) + buffer.POST_APPEND;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
