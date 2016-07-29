import '../typings/index.d.ts'

import stringTrim from '../lib/string-trim'

function print(operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    return buffer.APPEND + stringTrim(parameter) + buffer.POST_APPEND
}

export default print
