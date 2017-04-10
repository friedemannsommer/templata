/// <reference path="../typings/index.d.ts" />

import eachArray from '../lib/each-array'
import eachObject from '../lib/each-object'
import isArray from '../lib/is-array'
import isObject from '../lib/is-object'
import iterator from '../lib/iterator'
import parseParameter from '../lib/parse-parameter'
import stringTrim from '../lib/string-trim'

let iteratorIndexer: () => number

function iterate(
    _operator: string,
    parameter: string,
    _selfClosing: boolean,
    closingTag: boolean,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    compiler.registerImport('__isArray', isArray)
    compiler.registerImport('__isObject', isObject)
    compiler.registerImport('__eachArray', eachArray)
    compiler.registerImport('__eachObject', eachObject)

    if (closingTag) {
        return buffer.END + '}' + buffer.START
    }

    if (parameter && parameter !== '') {
        const iterable: string = stringTrim(parameter.slice(0, parameter.indexOf(':')))
        const iteratorIndex: number = iteratorIndexer()

        let [valueVar, indexVar] = parseParameter(parameter, ':', ',')

        valueVar = ((valueVar) ? valueVar : 'value_' + iteratorIndex)
        indexVar = ((indexVar) ? indexVar : 'key_' + iteratorIndex)

        return buffer.END
            + 'if(__isArray(' + iterable + ')){__eachArray('
            + iterable + ',iterate_' + iteratorIndex + ');}'
            + 'else if(__isObject(' + iterable + ')){__eachObject('
            + iterable + ',iterate_' + iteratorIndex + ');}'
            + 'function iterate_' + iteratorIndex + ' (' + valueVar + ',' + indexVar + '){'
            + buffer.START
    }

    return parameter
}

function initialize(compiler: Templata.ICompiler) {
    compiler.on('COMPILE_START', () => {
        iteratorIndexer = iterator(0)
    })
}

export default iterate

export {
    iterate,
    initialize
}
