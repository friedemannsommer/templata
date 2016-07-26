"use strict";
var remove_previous_buffer_1 = require('../lib/remove-previous-buffer');
function lowercase(input) {
    return input.toLocaleLowerCase();
}
function default_1(name, input, buffer, compiler) {
    compiler.registerImport('__f_lc', lowercase);
    return buffer.APPEND + '__f_lc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
