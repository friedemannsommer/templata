function iterate(array: any[], fn: (value: any, index: number, array: any[]) => boolean): any[] {
    let index: number = -1
    let length: number = array.length

    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break
        }
    }

    return array
}

export default iterate
