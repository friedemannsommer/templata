"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = regexEscape;
