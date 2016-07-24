(function (templateCompiler) {
    // values
    var template = '<div>Hi {{= local.name =}}!</div>\n<span>\n{{? local.usingTemplata ?}}\nYou`re amazing!\n{{? ?}}\nGet on it!\n{{/?}}\n</span>';
    var data = { name: "John White", usingTemplata: false };
    var compiled = '';
    var result = '';
    // compiler instance
    var compiler = templateCompiler(template);
    // elements
    var templateArea = document.getElementById('template');
    var templateData = document.getElementById('data');
    var templateCompiled = document.getElementById('compiled');
    var templateResult = document.getElementById('result');
    // additional variables
    var timer;
    // set inital values
    templateArea.value = template;
    templateData.value = JSON.stringify(data);
    // setup
    renderTemplate();
    // add listener
    templateArea.addEventListener('keyup', function (e) {
        if (!!timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            onUpdate('template', e);
        }, 500);
    }, false);
    templateData.addEventListener('keyup', function (e) {
        if (!!timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            onUpdate('data', e);
        }, 500);
    }, false);

    function onUpdate(type, e) {
        var errorOccurred = false;

        switch (type) {
            case 'template':
                template = e.target.value;
                compiler = templateCompiler(template);
                renderTemplate();
                break;
            case 'data':
                try {
                    data = JSON.parse(e.target.value);
                } catch (e) {
                    errorOccurred = true;
                }

                if (!errorOccurred) {
                    renderTemplate();
                }
                break;
            default:
                break;
        }
    }

    function renderTemplate() {
        templateCompiled.value = compiler.toString();
        templateResult.value = compiler(data);
    }

    function htmlEscape(input) {
        return input.replace(/\u0026/g, '&amp;')
            .replace(/\u0023/g, '&#35;')
            .replace(/\u003C/g, '&lt;')
            .replace(/\u003E/g, '&gt;')
            .replace(/\u0022/g, '&#34;')
            .replace(/\u0027/g, '&#39;')
            .replace(/\u0060/g, '&#96;')
            .replace(/\u00B4/g, '&#180;')
            .replace(/\u00DF/g, '&#223;')
            .replace(/\u0024/g, '&#36;')
            .replace(/\u20AC/g, '&#8364;')
            .replace(/\u00A2/g, '&#162;')
            .replace(/\u00A9/g, '&#169;')
            .replace(/\u00AE/g, '&#174;')
            .replace(/\u2122/g, '&#8482;')
            .replace(/\u005E/g, '&#94;')
            .replace(/\u007B/g, '&#123;')
            .replace(/\u007D/g, '&#125;')
            .replace(/\u007C/g, '&#124;')
            .replace(/\u007E/g, '&#126;')
            .replace(/\u0040/g, '&#64;')
            .replace(/\u005B/g, '&#91;')
            .replace(/\u005D/g, '&#93;')
            .replace(/\u005C/g, '&#92;')
            .replace(/\u003D/g, '&#61;')
            .replace(/\u002B/g, '&#43;')
            .replace(/\u002D/g, '&#45;')
            .replace(/\u00D7/g, '&#215;')
            .replace(/\u00F7/g, '&#247;')
            .replace(/\u00E4/g, '&#228;')
            .replace(/\u00C4/g, '&#196;')
            .replace(/\u00F6/g, '&#246;')
            .replace(/\u00D6/g, '&#214;')
            .replace(/\u00FC/g, '&#252;')
            .replace(/\u00DC/g, '&#220;')
            .replace(/\u00E0/g, '&#224;')
            .replace(/\u00C0/g, '&#192;')
            .replace(/\u00E1/g, '&#225;')
            .replace(/\u00C1/g, '&#193;')
            .replace(/\u00E2/g, '&#226;')
            .replace(/\u00C2/g, '&#194;')
            .replace(/\u00E3/g, '&#227;')
            .replace(/\u00C3/g, '&#195;')
            .replace(/\u00E5/g, '&#229;')
            .replace(/\u00C5/g, '&#197;')
            .replace(/\u00E6/g, '&#230;')
            .replace(/\u00C6/g, '&#198;')
            .replace(/\u00E7/g, '&#231;')
            .replace(/\u00C7/g, '&#199;')
            .replace(/\u00E8/g, '&#232;')
            .replace(/\u00C8/g, '&#200;')
            .replace(/\u00E9/g, '&#233;')
            .replace(/\u00C9/g, '&#201;')
            .replace(/\u00EA/g, '&#234;')
            .replace(/\u00CA/g, '&#202;')
            .replace(/\u00EB/g, '&#235;')
            .replace(/\u00CB/g, '&#203;')
            .replace(/\u00EC/g, '&#236;')
            .replace(/\u00CC/g, '&#204;')
            .replace(/\u00ED/g, '&#237;')
            .replace(/\u00CD/g, '&#205;')
            .replace(/\u00EE/g, '&#238;')
            .replace(/\u00CE/g, '&#206;')
            .replace(/\u00EF/g, '&#239;')
            .replace(/\u00CF/g, '&#207;')
            .replace(/\u00F0/g, '&#240;')
            .replace(/\u00D0/g, '&#208;')
            .replace(/\u00F1/g, '&#241;')
            .replace(/\u00D1/g, '&#209;')
            .replace(/\u00F2/g, '&#242;')
            .replace(/\u00D2/g, '&#210;')
            .replace(/\u00F3/g, '&#243;')
            .replace(/\u00D3/g, '&#211;')
            .replace(/\u00F4/g, '&#244;')
            .replace(/\u00D4/g, '&#212;')
            .replace(/\u00F5/g, '&#245;')
            .replace(/\u00D5/g, '&#213;')
            .replace(/\u00F9/g, '&#249;')
            .replace(/\u00D9/g, '&#217;')
            .replace(/\u00FA/g, '&#250;')
            .replace(/\u00DA/g, '&#218;')
            .replace(/\u00FB/g, '&#251;')
            .replace(/\u00DB/g, '&#219;')
            .replace(/\u00FD/g, '&#253;')
            .replace(/\u00DD/g, '&#221;')
            .replace(/\u00F8/g, '&#248;')
            .replace(/\u00D8/g, '&#216;');
    }
})(window.Templata.default);
