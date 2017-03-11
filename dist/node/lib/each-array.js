"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function iterate(array, fn) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}
exports.default = iterate;
