import '../typings/index.d.ts'

import stringTrim from '../lib/string-trim'

function javascript(operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    return buffer.END + stringTrim(parameter) + buffer.START
}

export default javascript
