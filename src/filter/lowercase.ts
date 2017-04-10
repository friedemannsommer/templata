/// <reference path="../typings/index.d.ts" />

import removePreviousBuffer from '../lib/remove-previous-buffer'

function lowercase(input: string): string {
    return input.toLocaleLowerCase()
}

function filterLowercase(
    _name: string,
    input: string,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    compiler.registerImport('__f_lc', lowercase)

    return buffer.APPEND + '__f_lc(' + removePreviousBuffer(input, buffer) + ')' + buffer.POST_APPEND
}

export default filterLowercase
