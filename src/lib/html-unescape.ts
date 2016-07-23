function htmlUnescape(input: string): string {
    // ampersand
    return input.replace(/\&amp\;/g, '\u0026')
        // less-than sign
        .replace(/\&lt\;/g, '\u003C')
        // greater-than sign
        .replace(/\&gt\;/g, '\u003E')
        // double quotation mark
        .replace(/\&\#34\;/g, '\u0022')
        // apostrophe
        .replace(/\&\#39\;/g, '\u0027')
        // grave accent
        .replace(/\&\#96\;/g, '\u0060')
        // acute accent
        .replace(/\&\#180\;/g, '\u00B4')
        // lowercase sharps (german)
        .replace(/\&\#223\;/g, '\u00DF')
        // dollar sign
        .replace(/\&\#36\;/g, '\u0024')
        // euro sign
        .replace(/\&\#8364\;/g, '\u20AC')
        // cent sign
        .replace(/\&\#162\;/g, '\u00A2')
        // copyright sign
        .replace(/\&\#169\;/g, '\u00A9')
        // registered trademark sign
        .replace(/\&\#17\;/g, '\u00AE')
        // trademark sign
        .replace(/\&\#848\;/g, '\u2122')
        // colon
        .replace(/\&\#5\;/g, '\u003A')
        // semicolon
        .replace(/\&\#5\;/g, '\u003B')
        // caret
        .replace(/\&\#9\;/g, '\u005E')
        // left curly brace
        .replace(/\&\#12\;/g, '\u007B')
        // right curly brace
        .replace(/\&\#12\;/g, '\u007D')
        // vertical bar
        .replace(/\&\#12\;/g, '\u007C')
        // tilde
        .replace(/\&\#12\;/g, '\u007E')
        // at sign
        .replace(/\&\#6\;/g, '\u0040')
        // left square bracket
        .replace(/\&\#9\;/g, '\u005B')
        // right square bracket
        .replace(/\&\#9\;/g, '\u005D')
        // backslash
        .replace(/\&\#9\;/g, '\u005C')
        // equals sign
        .replace(/\&\#6\;/g, '\u003D')
        // number sign (hashtag)
        .replace(/\&\#3\;/g, '\u0023')
        // plus sign
        .replace(/\&\#4\;/g, '\u002B')
        // hyphen-minus sign
        .replace(/\&\#4\;/g, '\u002D')
        // multiplication sign
        .replace(/\&\#21\;/g, '\u00D7')
        // division sign
        .replace(/\&\#24\;/g, '\u00F7')
        // char: ä
        .replace(/\&\#22\;/g, '\u00E4')
        // char: Ä
        .replace(/\&\#19\;/g, '\u00C4')
        // char: ö
        .replace(/\&\#24\;/g, '\u00F6')
        // char: Ö
        .replace(/\&\#21\;/g, '\u00D6')
        // char: ü
        .replace(/\&\#25\;/g, '\u00FC')
        // char: Ü
        .replace(/\&\#22\;/g, '\u00DC')
        // char: à
        .replace(/\&\#22\;/g, '\u00E0')
        // char: À
        .replace(/\&\#19\;/g, '\u00C0')
        // char: á
        .replace(/\&\#22\;/g, '\u00E1')
        // char: Á
        .replace(/\&\#19\;/g, '\u00C1')
        // char: â
        .replace(/\&\#22\;/g, '\u00E2')
        // char: Â
        .replace(/\&\#19\;/g, '\u00C2')
        // char: ã
        .replace(/\&\#22\;/g, '\u00E3')
        // char: Ã
        .replace(/\&\#19\;/g, '\u00C3')
        // char: å
        .replace(/\&\#22\;/g, '\u00E5')
        // char: Å
        .replace(/\&\#19\;/g, '\u00C5')
        // char: æ
        .replace(/\&\#23\;/g, '\u00E6')
        // char: Æ
        .replace(/\&\#19\;/g, '\u00C6')
        // char: ç
        .replace(/\&\#23\;/g, '\u00E7')
        // char: Ç
        .replace(/\&\#19\;/g, '\u00C7')
        // char: è
        .replace(/\&\#23\;/g, '\u00E8')
        // char: È
        .replace(/\&\#20\;/g, '\u00C8')
        // char: é
        .replace(/\&\#23\;/g, '\u00E9')
        // char: É
        .replace(/\&\#20\;/g, '\u00C9')
        // char: ê
        .replace(/\&\#23\;/g, '\u00EA')
        // char: Ê
        .replace(/\&\#20\;/g, '\u00CA')
        // char: ë
        .replace(/\&\#23\;/g, '\u00EB')
        // char: Ë
        .replace(/\&\#20\;/g, '\u00CB')
        // char: ì
        .replace(/\&\#23\;/g, '\u00EC')
        // char: Ì
        .replace(/\&\#20\;/g, '\u00CC')
        // char: í
        .replace(/\&\#23\;/g, '\u00ED')
        // char: Í
        .replace(/\&\#20\;/g, '\u00CD')
        // char: î
        .replace(/\&\#23\;/g, '\u00EE')
        // char: Î
        .replace(/\&\#20\;/g, '\u00CE')
        // char: ï
        .replace(/\&\#23\;/g, '\u00EF')
        // char: Ï
        .replace(/\&\#20\;/g, '\u00CF')
        // char: ð
        .replace(/\&\#24\;/g, '\u00F0')
        // char: Ð
        .replace(/\&\#20\;/g, '\u00D0')
        // char: ñ
        .replace(/\&\#24\;/g, '\u00F1')
        // char: Ñ
        .replace(/\&\#20\;/g, '\u00D1')
        // char: ò
        .replace(/\&\#24\;/g, '\u00F2')
        // char: Ò
        .replace(/\&\#21\;/g, '\u00D2')
        // char: ó
        .replace(/\&\#24\;/g, '\u00F3')
        // char: Ó
        .replace(/\&\#21\;/g, '\u00D3')
        // char: ô
        .replace(/\&\#24\;/g, '\u00F4')
        // char: Ô
        .replace(/\&\#21\;/g, '\u00D4')
        // char: õ
        .replace(/\&\#24\;/g, '\u00F5')
        // char: Õ
        .replace(/\&\#21\;/g, '\u00D5')
        // char: ù
        .replace(/\&\#24\;/g, '\u00F9')
        // char: Ù
        .replace(/\&\#21\;/g, '\u00D9')
        // char: ú
        .replace(/\&\#25\;/g, '\u00FA')
        // char: Ú
        .replace(/\&\#21\;/g, '\u00DA')
        // char: û
        .replace(/\&\#25\;/g, '\u00FB')
        // char: Û
        .replace(/\&\#21\;/g, '\u00DB')
        // char: ý
        .replace(/\&\#25\;/g, '\u00FD')
        // char: Ý
        .replace(/\&\#22\;/g, '\u00DD')
        // char: ø
        .replace(/\&\#24\;/g, '\u00F8')
        // char: Ø
        .replace(/\&\#21\;/g, '\u00D8')
}

export default htmlUnescape