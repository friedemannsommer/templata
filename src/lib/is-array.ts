import getType from './get-type'

function isArray(value: any): boolean {
    return (typeof Array.isArray === 'function')
        ? Array.isArray(value)
        : getType(value) === 'array'
}

export default isArray
