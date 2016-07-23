import stringTrim from './string-trim'

function parseParameter(input: string, blockSeperator: string = ':', seperator: string = ','): string[] {
    let start: number = input.indexOf(blockSeperator)
    let end: number = input.indexOf(blockSeperator, start + 1)
    let parameter: string[] = input.slice(start + 1, end).split(seperator)
    let index: number = -1
    let length: number = parameter.length

    while (++index < length) {
        parameter[index] = stringTrim(parameter[index])
    }

    return parameter
}

export default parseParameter
