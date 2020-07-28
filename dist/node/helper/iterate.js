"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.iterate = void 0;
var each_array_1 = require("../lib/each-array");
var each_object_1 = require("../lib/each-object");
var is_array_1 = require("../lib/is-array");
var is_object_1 = require("../lib/is-object");
var iterator_1 = require("../lib/iterator");
var parse_parameter_1 = require("../lib/parse-parameter");
var string_trim_1 = require("../lib/string-trim");
var iteratorIndexer;
function iterate(_operator, parameter, _selfClosing, closingTag, buffer, compiler) {
    compiler.registerImport('__isArray', is_array_1.default);
    compiler.registerImport('__isObject', is_object_1.default);
    compiler.registerImport('__eachArray', each_array_1.default);
    compiler.registerImport('__eachObject', each_object_1.default);
    if (closingTag) {
        return buffer.END + '}' + buffer.START;
    }
    if (parameter && parameter !== '') {
        var iterable = string_trim_1.default(parameter.slice(0, parameter.indexOf(':')));
        var iteratorIndex = iteratorIndexer();
        var _a = parse_parameter_1.default(parameter, ':', ','), valueVar = _a[0], indexVar = _a[1];
        valueVar = ((valueVar) ? valueVar : 'value_' + iteratorIndex);
        indexVar = ((indexVar) ? indexVar : 'key_' + iteratorIndex);
        return buffer.END
            + 'if(__isArray(' + iterable + ')){__eachArray('
            + iterable + ',iterate_' + iteratorIndex + ');}'
            + 'else if(__isObject(' + iterable + ')){__eachObject('
            + iterable + ',iterate_' + iteratorIndex + ');}'
            + 'function iterate_' + iteratorIndex + ' (' + valueVar + ',' + indexVar + '){'
            + buffer.START;
    }
    return parameter;
}
exports.iterate = iterate;
function initialize(compiler) {
    compiler.on('COMPILE_START', function () {
        iteratorIndexer = iterator_1.default(0);
    });
}
exports.initialize = initialize;
exports.default = iterate;
