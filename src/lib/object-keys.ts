function objectKeys(object: any): string[] {
    const output: string[] = []
    const forbiddenKeys: string[] = [
        'toString',
        'toLocalString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ]

    // tslint:disable-next-line prefer-const
    for (let key in object) {
        if (object.hasOwnProperty(key) && forbiddenKeys.indexOf(key) < 0) {
            output.push(key)
        }
    }

    return output
}

export default objectKeys
