/// <reference path="../typings/index.d.ts" />

import parseParameter from '../lib/parse-parameter'
import stringTrim from '../lib/string-trim'
import eachObject from '../lib/each-object'
import eachArray from '../lib/each-array'
import isObject from '../lib/is-object'
import isArray from '../lib/is-array'
import iterator from '../lib/iterator'

let iteratorIndexer: () => number

function iterate(operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    compiler.registerImport('__isArray', isArray)
    compiler.registerImport('__isObject', isObject)
    compiler.registerImport('__eachArray', eachArray)
    compiler.registerImport('__eachObject', eachObject)

    if (closingTag) {
        return buffer.END + '}' + buffer.START
    }

    if (parameter && parameter !== '') {
        let [valueVar, indexVar] = parseParameter(parameter, ':', ',')
        let iterable: string = stringTrim(parameter.slice(0, parameter.indexOf(':')))
        let iteratorIndex: number = iteratorIndexer()

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

function initialize(compiler: Templata.Interface.Compiler) {
    compiler.on('COMPILE_START', () => {
        iteratorIndexer = iterator(0)
    })
}

export default iterate

export {
    iterate,
    initialize
}
