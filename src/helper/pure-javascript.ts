/// <reference path="../typings/index.d.ts" />

import stringTrim from '../lib/string-trim'

function javascript(
    operator: string,
    parameter: string,
    selfClosing: boolean,
    closingTag: boolean,
    buffer: Templata.IBuffer,
    compiler: Templata.ICompiler
): string {
    return buffer.END + stringTrim(parameter) + buffer.START
}

export default javascript
