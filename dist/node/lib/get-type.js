"use strict";
var substr_1 = require('./substr');
function default_1(object) {
    var output = substr_1.default(Object.prototype.toString.call(object), 0, 8);
    return substr_1.default(output, output.length - 1, 1).toLowerCase();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
