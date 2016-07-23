const regexSpecialChars: string[] = [
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
]

const specialCharMatch: RegExp = new RegExp(
    `[${regexSpecialChars.join('\\')}]`,
    'g'
)

function regexEscape(input: string): string {
    return input.replace(specialCharMatch, '\\$&')
}

export default regexEscape