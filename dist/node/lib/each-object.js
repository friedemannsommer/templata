"use strict";
var object_keys_1 = require('./object-keys');
var largeObjectLength = 25;
function preCompileIterator(properties) {
    var index = -1;
    var length = properties.length >>> 0;
    var fnString = '(function(object, callback){\n';
    while (++index < length) {
        fnString += 'callback(object["' + properties[index] + '"], "' + properties[index] + '", object);';
    }
    fnString += '\n});';
    return eval(fnString);
}
function iterate(object, callback, keys) {
    if (keys === void 0) { keys = object_keys_1.default(object); }
    if (keys.length >= largeObjectLength) {
        preCompileIterator(keys)(object, callback);
    }
    else {
        var index = -1;
        var length_1 = keys.length >>> 0;
        while (++index < length_1) {
            callback(object[keys[index]], keys[index], object);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = iterate;
