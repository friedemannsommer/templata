"use strict";
var remove_previous_buffer_1 = require("../lib/remove-previous-buffer");
function uppercase(input) {
    return input.toLocaleUpperCase();
}
function filterUppercase(name, input, buffer, compiler) {
    compiler.registerImport('__f_uc', uppercase);
    return buffer.APPEND + '__f_uc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = filterUppercase;
