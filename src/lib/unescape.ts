function unescape(string: string): string {
    return string.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ')
}

export default unescape
