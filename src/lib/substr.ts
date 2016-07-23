function substr(value: string, index: number, length: number = 1): string {
    if (index < 0 || index > value.length) {
        throw new RangeError()
    }

    return (index > 0) ? value.slice(0, index) + value.slice(index + length) : value.slice(index + length)
}

export default substr