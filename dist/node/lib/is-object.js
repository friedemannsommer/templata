"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(value) {
    return typeof value === 'function' || typeof value === 'object' && !!value;
}
exports.default = isObject;
