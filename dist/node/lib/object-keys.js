"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function objectKeys(object) {
    var output = [];
    var forbiddenKeys = [
        'toString',
        'toLocalString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    for (var key in object) {
        if (object.hasOwnProperty(key) && forbiddenKeys.indexOf(key) < 0) {
            output.push(key);
        }
    }
    return output;
}
exports.default = objectKeys;
