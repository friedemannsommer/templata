/**
 * Source
 * https://github.com/arasatasaygin/is.js/blob/master/is.js#L139
 *
 * @param value {object}
 * @returns {boolean}
 */

function isObject(value: any): boolean {
    return typeof value === 'function' || typeof value === 'object' && !!value
}

export default isObject