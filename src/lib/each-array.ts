function iterate(array: Array<any>, fn: (value: any, index: number, array: Array<any>) => boolean): Array<any> {
    let index: number = -1,
        length: number = array.length >>> 0

    while (++index < length) {
        if (fn(array[index], index, array) === false) {
            break
        }
    }

    return array
}

export default iterate