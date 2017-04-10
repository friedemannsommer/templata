"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function iterate(array, fn) {
    var length = array.length;
    var index = -1;
    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}
exports.default = iterate;
