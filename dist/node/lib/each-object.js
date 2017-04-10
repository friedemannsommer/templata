"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_keys_1 = require("./object-keys");
function iterate(object, callback, keys) {
    if (keys === void 0) { keys = object_keys_1.default(object); }
    var length = keys.length;
    var index = -1;
    while (++index < length) {
        callback(object[keys[index]], keys[index], object);
    }
}
exports.default = iterate;
