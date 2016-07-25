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
})(window.Templata.default);
