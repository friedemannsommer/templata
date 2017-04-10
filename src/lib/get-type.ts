import subStr from './substr'

export default function(object: any): string {
    const output: string = subStr(Object.prototype.toString.call(object), 0, 8)

    return subStr(output, output.length - 1, 1).toLowerCase()
}
