/// <reference path="../typings/index.d.ts" />

import HTMLEscape from '../lib/html-escape'
import stringTrim from '../lib/string-trim'

export default function(
    _operator: string,
    parameter: string,
    _selfClosing: boolean,
    _closingTag: boolean,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    compiler.registerImport('__htmlEscape', HTMLEscape)

    return buffer.APPEND + '__htmlEscape(' + stringTrim(parameter) + ')' + buffer.POST_APPEND
}
