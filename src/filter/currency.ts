/// <reference path="../typings/index.d.ts" />

import removePreviousBuffer from '../lib/remove-previous-buffer'
import stringTrim from '../lib/string-trim'

function currency(input: string): string {
    return input.replace(/(?:([0-9]+?[\.\,]+?[0-9]+?)|([0-9]+?))(?:\s|[^0-9]|$)/g, (match: string, floatString: string): string => {
        if (floatString.indexOf(',') > -1) {
            return parseFloat(floatString.replace(',', '.')).toFixed(2)
        } else {
            return parseFloat(floatString).toFixed(2)
        }
    })
}

function filterCurrency(
    _name: string,
    input: string,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    compiler.registerImport('__f_currency', currency)

    return buffer.APPEND + '__f_currency(' + stringTrim(removePreviousBuffer(input, buffer)) + ')' + buffer.POST_APPEND
}

export default filterCurrency
