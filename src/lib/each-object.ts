import objectKeys from './object-keys'

const largeObjectLength: number = 25

function preCompileIterator(properties: Array<string>): (object: Object, callback: (value: any, key: string, object: Object) => any) => void {
    let index = -1
    let length = properties.length >>> 0
    let fnString = '(function(object, callback){\n'

    while (++index < length) {
        fnString += 'callback(object["' + properties[index] + '"], "' + properties[index] + '", object);'
    }

    fnString += '\n});'
    // tslint:disable-next-line no-eval
    return eval(fnString)
}

function iterate(object: Object, callback: (value: any, key: string, object: Object) => void, keys: Array<string> = objectKeys(object)): void {
    if (keys.length >= largeObjectLength) {
        preCompileIterator(keys)(object, callback)
    } else {
        let index = -1
        let length = keys.length >>> 0
        while (++index < length) {
            callback(object[keys[index]], keys[index], object)
        }
    }
}

export default iterate
