"use strict";
var string_trim_1 = require('../lib/string-trim');
var unescape_1 = require('../lib/unescape');
function print(operator, parameter, selfClosing, closingTag, buffer, compiler) {
    return buffer.APPEND + string_trim_1.default(unescape_1.default(parameter)) + buffer.POST_APPEND;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = print;
