"use strict";
function iterator(initial) {
    return function () {
        return initial++;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = iterator;
