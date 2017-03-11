"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function iterator(initial) {
    return function () {
        return initial++;
    };
}
exports.default = iterator;
