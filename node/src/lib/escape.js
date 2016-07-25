"use strict";
function escape(input) {
    return input.replace(/'|\\/g, "\\$&");
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = escape;
