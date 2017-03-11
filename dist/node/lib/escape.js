"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escape(input) {
    return input.replace(/'|\\/g, '\\$&');
}
exports.default = escape;
