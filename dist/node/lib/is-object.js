"use strict";
function isObject(value) {
    return typeof value === 'function' || typeof value === 'object' && !!value;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isObject;
