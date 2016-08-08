/// <reference path="../typings/index.d.ts" />

import stringTrim from '../lib/string-trim'
import unescape from '../lib/unescape'

function print(operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    return buffer.APPEND + stringTrim(unescape(parameter)) + buffer.POST_APPEND
}

export default print
