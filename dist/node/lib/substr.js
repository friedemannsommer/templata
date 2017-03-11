"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function substr(value, index, length) {
    if (length === void 0) { length = 1; }
    if (index < 0 || index > value.length) {
        throw new RangeError();
    }
    return (index > 0) ? value.slice(0, index) + value.slice(index + length) : value.slice(index + length);
}
exports.default = substr;
