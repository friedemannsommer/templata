function removePreviousBuffer(input: string, buffer: Templata.Object.Buffer): string {
    if (input.slice(0, buffer.APPEND.length) === buffer.APPEND) {
        return input.replace(buffer.APPEND, '').replace(buffer.POST_APPEND, '')
    }

    if (input.slice(0, buffer.START.length) === buffer.START) {
        return input.replace(buffer.START, '').replace(buffer.END, '')
    }

    return input
}

export default removePreviousBuffer
