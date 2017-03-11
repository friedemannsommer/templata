"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unescape(input) {
    return input.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ');
}
exports.default = unescape;
