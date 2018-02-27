(function (templateCompiler) {
    // elements
    var templateArea = document.getElementById('template');
    var templateData = document.getElementById('data');
    var templateCompiled = document.getElementById('compiled');
    var templateResult = document.getElementById('result');
    // additional variables
    var compiler;
    var userData;
    // set inital values
    try {
        userData = JSON.parse(templateData.value);
    } catch (e) {
        console.log('[Templata] ' + e.message);
    }

    if (userData) {
        createTemplate(templateArea.value, userData);
    }

    // add listener
    templateArea.addEventListener('keyup', function (e) {
        createTemplate(e.target.value);
    }, { capture: false, passive: true });
    templateData.addEventListener('keyup', function (e) {
        parseData(e.target.value);
    }, { capture: false, passive: true });

    function parseData(inputData) {
        var errorOccurred = false;
        var data;

        try {
            data = JSON.parse(inputData);
        } catch (e) {
            errorOccurred = true;

            if (console && console.log) {
                console.log('[Templata] ' + e.message);
            }
        }

        if (!errorOccurred) {
            renderTemplate(data);
        }
    }

    function createTemplate(template, data) {
        compiler = templateCompiler(template);
        templateCompiled.value = compiler.toString();

        renderTemplate(data);
    }

    function renderTemplate(data) {
        if (!data) {
            data = userData;
        } else {
            userData = data;
        }

        templateResult.value = compiler(data);
    }
})(window.Templata);
