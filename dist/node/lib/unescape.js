"use strict";
function unescape(input) {
    return input.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = unescape;
