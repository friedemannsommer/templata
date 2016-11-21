function objectKeys(object: Object): string[] {
    let output: string[] = []
    let forbiddenKeys: string[] = [
            'toString',
            'toLocalString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ]

    for (let key in object) {
        if (object.hasOwnProperty(key) && forbiddenKeys.indexOf(key) < 0) {
            output.push(key)
        }
    }

    return output
}

export default objectKeys
