import '../typings/index.d.ts'

import removePreviousBuffer from '../lib/remove-previous-buffer'

function uppercase(input: string): string {
    return input.toLocaleUpperCase()
}

function filterUppercase(name: string, input: string, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    compiler.registerImport('__f_uc', uppercase)

    return buffer.APPEND + '__f_uc(' + removePreviousBuffer(input, buffer) + ')' + buffer.POST_APPEND
}

export default filterUppercase
