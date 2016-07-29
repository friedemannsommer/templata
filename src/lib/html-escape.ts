function htmlEscape(input: string): string {
    // ampersand
    return input.replace(/\u0026/g, '&amp;')
        // number sign (hashtag)
        .replace(/\u0023/g, '&#35;')
        // less-than sign
        .replace(/\u003C/g, '&lt;')
        // greater-than sign
        .replace(/\u003E/g, '&gt;')
        // double quotation mark
        .replace(/\u0022/g, '&#34;')
        // apostrophe
        .replace(/\u0027/g, '&#39;')
        // grave accent
        .replace(/\u0060/g, '&#96;')
        // acute accent
        .replace(/\u00B4/g, '&#180;')
        // lowercase sharps (german)
        .replace(/\u00DF/g, '&#223;')
        // dollar sign
        .replace(/\u0024/g, '&#36;')
        // euro sign
        .replace(/\u20AC/g, '&#8364;')
        // cent sign
        .replace(/\u00A2/g, '&#162;')
        // copyright sign
        .replace(/\u00A9/g, '&#169;')
        // registered trademark sign
        .replace(/\u00AE/g, '&#174;')
        // trademark sign
        .replace(/\u2122/g, '&#8482;')
        // caret
        .replace(/\u005E/g, '&#94;')
        // left curly brace
        .replace(/\u007B/g, '&#123;')
        // right curly brace
        .replace(/\u007D/g, '&#125;')
        // vertical bar
        .replace(/\u007C/g, '&#124;')
        // tilde
        .replace(/\u007E/g, '&#126;')
        // at sign
        .replace(/\u0040/g, '&#64;')
        // left square bracket
        .replace(/\u005B/g, '&#91;')
        // right square bracket
        .replace(/\u005D/g, '&#93;')
        // backslash
        .replace(/\u005C/g, '&#92;')
        // equals sign
        .replace(/\u003D/g, '&#61;')
        // plus sign
        .replace(/\u002B/g, '&#43;')
        // hyphen-minus sign
        .replace(/\u002D/g, '&#45;')
        // multiplication sign
        .replace(/\u00D7/g, '&#215;')
        // division sign
        .replace(/\u00F7/g, '&#247;')
        // char: ä
        .replace(/\u00E4/g, '&#228;')
        // char: Ä
        .replace(/\u00C4/g, '&#196;')
        // char: ö
        .replace(/\u00F6/g, '&#246;')
        // char: Ö
        .replace(/\u00D6/g, '&#214;')
        // char: ü
        .replace(/\u00FC/g, '&#252;')
        // char: Ü
        .replace(/\u00DC/g, '&#220;')
        // char: à
        .replace(/\u00E0/g, '&#224;')
        // char: À
        .replace(/\u00C0/g, '&#192;')
        // char: á
        .replace(/\u00E1/g, '&#225;')
        // char: Á
        .replace(/\u00C1/g, '&#193;')
        // char: â
        .replace(/\u00E2/g, '&#226;')
        // char: Â
        .replace(/\u00C2/g, '&#194;')
        // char: ã
        .replace(/\u00E3/g, '&#227;')
        // char: Ã
        .replace(/\u00C3/g, '&#195;')
        // char: å
        .replace(/\u00E5/g, '&#229;')
        // char: Å
        .replace(/\u00C5/g, '&#197;')
        // char: æ
        .replace(/\u00E6/g, '&#230;')
        // char: Æ
        .replace(/\u00C6/g, '&#198;')
        // char: ç
        .replace(/\u00E7/g, '&#231;')
        // char: Ç
        .replace(/\u00C7/g, '&#199;')
        // char: è
        .replace(/\u00E8/g, '&#232;')
        // char: È
        .replace(/\u00C8/g, '&#200;')
        // char: é
        .replace(/\u00E9/g, '&#233;')
        // char: É
        .replace(/\u00C9/g, '&#201;')
        // char: ê
        .replace(/\u00EA/g, '&#234;')
        // char: Ê
        .replace(/\u00CA/g, '&#202;')
        // char: ë
        .replace(/\u00EB/g, '&#235;')
        // char: Ë
        .replace(/\u00CB/g, '&#203;')
        // char: ì
        .replace(/\u00EC/g, '&#236;')
        // char: Ì
        .replace(/\u00CC/g, '&#204;')
        // char: í
        .replace(/\u00ED/g, '&#237;')
        // char: Í
        .replace(/\u00CD/g, '&#205;')
        // char: î
        .replace(/\u00EE/g, '&#238;')
        // char: Î
        .replace(/\u00CE/g, '&#206;')
        // char: ï
        .replace(/\u00EF/g, '&#239;')
        // char: Ï
        .replace(/\u00CF/g, '&#207;')
        // char: ð
        .replace(/\u00F0/g, '&#240;')
        // char: Ð
        .replace(/\u00D0/g, '&#208;')
        // char: ñ
        .replace(/\u00F1/g, '&#241;')
        // char: Ñ
        .replace(/\u00D1/g, '&#209;')
        // char: ò
        .replace(/\u00F2/g, '&#242;')
        // char: Ò
        .replace(/\u00D2/g, '&#210;')
        // char: ó
        .replace(/\u00F3/g, '&#243;')
        // char: Ó
        .replace(/\u00D3/g, '&#211;')
        // char: ô
        .replace(/\u00F4/g, '&#244;')
        // char: Ô
        .replace(/\u00D4/g, '&#212;')
        // char: õ
        .replace(/\u00F5/g, '&#245;')
        // char: Õ
        .replace(/\u00D5/g, '&#213;')
        // char: ù
        .replace(/\u00F9/g, '&#249;')
        // char: Ù
        .replace(/\u00D9/g, '&#217;')
        // char: ú
        .replace(/\u00FA/g, '&#250;')
        // char: Ú
        .replace(/\u00DA/g, '&#218;')
        // char: û
        .replace(/\u00FB/g, '&#251;')
        // char: Û
        .replace(/\u00DB/g, '&#219;')
        // char: ý
        .replace(/\u00FD/g, '&#253;')
        // char: Ý
        .replace(/\u00DD/g, '&#221;')
        // char: ø
        .replace(/\u00F8/g, '&#248;')
        // char: Ø
        .replace(/\u00D8/g, '&#216;')
}

export default htmlEscape
