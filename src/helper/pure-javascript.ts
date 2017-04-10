/// <reference path="../typings/index.d.ts" />

import stringTrim from '../lib/string-trim'

function javascript(
    _operator: string,
    parameter: string,
    _selfClosing: boolean,
    _closingTag: boolean,
    buffer: Templata.IBuffer,
    _compiler: Templata.ICompiler
): string {
    return buffer.END + stringTrim(parameter) + buffer.START
}

export default javascript
