import stringTrim from '../lib/string-trim'
import HTMLEscape from '../lib/html-escape'
import unescape from '../lib/unescape'

export default function (operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    compiler.registerImport('__htmlEscape', HTMLEscape)

    return buffer.APPEND + '__htmlEscape(' + stringTrim(parameter) + ')' + buffer.POST_APPEND
}