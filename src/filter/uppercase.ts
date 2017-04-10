/// <reference path="../typings/index.d.ts" />

import removePreviousBuffer from '../lib/remove-previous-buffer'

function uppercase(input: string): string {
    return input.toLocaleUpperCase()
}

function filterUppercase(
    _name: string,
    input: string,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    compiler.registerImport('__f_uc', uppercase)

    return buffer.APPEND + '__f_uc(' + removePreviousBuffer(input, buffer) + ')' + buffer.POST_APPEND
}

export default filterUppercase
