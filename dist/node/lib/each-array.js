"use strict";
function iterate(array, fn) {
    var index = -1;
    var length = array.length >>> 0;
    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = iterate;
