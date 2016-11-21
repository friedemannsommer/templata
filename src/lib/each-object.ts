import objectKeys from './object-keys'

const largeObjectLength: number = 25

function preCompileIterator(properties: string[]): (object: Object, callback: (value: any, key: string, object: Object) => any) => void {
    let index = -1
    let length = properties.length
    let fnString = '(function(object, callback){\n'

    while (++index < length) {
        fnString += 'callback(object["' + properties[index] + '"], "' + properties[index] + '", object);'
    }

    fnString += '\n});'
    // tslint:disable-next-line no-eval
    return eval(fnString)
}

function iterate(object: Object, callback: (value: any, key: string, object: Object) => void, keys: string[] = objectKeys(object)): void {
    if (keys.length >= largeObjectLength) {
        preCompileIterator(keys)(object, callback)
    } else {
        let index = -1
        let length = keys.length
        while (++index < length) {
            callback(object[keys[index]], keys[index], object)
        }
    }
}

export default iterate
