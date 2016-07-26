"use strict";
var get_type_1 = require('./get-type');
function isArray(value) {
    return (typeof Array.isArray === 'function')
        ? Array.isArray(value)
        : get_type_1.default(value) === 'array';
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isArray;
