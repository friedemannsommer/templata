function iterate(array: any[], fn: (value: any, index: number, array: any[]) => boolean): any[] {
    const length: number = array.length
    let index: number = -1

    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break
        }
    }

    return array
}

export default iterate
