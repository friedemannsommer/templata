import stringTrim from './string-trim'

function parseParameter(input: string, blockSeperator: string = ':', seperator: string = ','): string[] {
    const start: number = input.indexOf(blockSeperator)
    const end: number = input.indexOf(blockSeperator, start + 1)
    const parameter: string[] = input.slice(start + 1, end).split(seperator)
    const length: number = parameter.length
    let index: number = -1

    while (++index < length) {
        parameter[index] = stringTrim(parameter[index])
    }

    return parameter
}

export default parseParameter
