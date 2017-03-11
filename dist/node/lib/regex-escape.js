"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regexSpecialChars = [
    '-',
    '[',
    ']',
    '/',
    '{',
    '}',
    '(',
    ')',
    '*',
    '+',
    '?',
    '.',
    '\\',
    '^',
    '$',
    '|',
    '~',
    '`',
    '!',
    '@',
    '#'
];
var specialCharMatch = new RegExp("[" + regexSpecialChars.join('\\') + "]", 'g');
function regexEscape(input) {
    return input.replace(specialCharMatch, '\\$&');
}
exports.default = regexEscape;
