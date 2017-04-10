import objectKeys from './object-keys'

function iterate(object: any, callback: (value: any, key: string, object: any) => void, keys: string[] = objectKeys(object)): void {
    const length = keys.length
    let index = -1

    while (++index < length) {
        callback(object[keys[index]], keys[index], object)
    }
}

export default iterate
