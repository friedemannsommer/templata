/// <reference path="../typings/index.d.ts" />

import stringTrim from '../lib/string-trim'
import unescape from '../lib/unescape'

function print(
    _operator: string,
    parameter: string,
    _selfClosing: boolean,
    _closingTag: boolean,
    buffer: Templata.IBuffer,
    _compiler: Templata.ICompiler
): string {
    return buffer.APPEND + stringTrim(unescape(parameter)) + buffer.POST_APPEND
}

export default print
