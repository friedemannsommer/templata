"use strict";
function unescape(string) {
    return string.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = unescape;
