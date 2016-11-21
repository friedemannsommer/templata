function unescape(input: string): string {
    return input.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ')
}

export default unescape
