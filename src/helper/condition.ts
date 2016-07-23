import stringTrim from '../lib/string-trim'
import unescape from '../lib/unescape'

export default function (operator: string, parameter: string, selfClosing: boolean, closingTag: boolean, buffer: Templata.Object.Buffer, compiler: Templata.Interface.Compiler): string {
    if (closingTag) {
        return buffer.END + '}' + buffer.START
    }

    switch (operator) {
        case '?':
            if (parameter && parameter !== '') {
                // if
                return buffer.END + 'if(' + stringTrim(unescape(parameter)) + '){' + buffer.START
            } else {
                // else
                return buffer.END + '}else{' + buffer.START
            }
        case '??':
            if (parameter && parameter !== '') {
                // elseif
                return buffer.END + '}else if(' + stringTrim(unescape(parameter)) + '){' + buffer.START
            } else {
                // else
                return buffer.END + '}else{' + buffer.START
            }
    }

    return parameter
}