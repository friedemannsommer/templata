"use strict";
var regex_escape_1 = require('./regex-escape');
var object_keys_1 = require('./object-keys');
var string_trim_1 = require('./string-trim');
var unescape_1 = require('./unescape');
var escape_1 = require('./escape');
var Match;
(function (Match) {
    Match[Match["FULL_MATCH"] = 0] = "FULL_MATCH";
})(Match || (Match = {}));
var Compiler = (function () {
    function Compiler(imports, helper, filter) {
        if (imports === void 0) { imports = {}; }
        if (helper === void 0) { helper = {}; }
        if (filter === void 0) { filter = {}; }
        this.replaceExpressions = {
            NEW_LINE: /\r|\n|\t|\/\*[\s\S]*?\*\//g,
            AFTER_HTML_TAG: />\s+/g,
            BEFORE_HTML_TAG: /\s+</g,
            EMPTY_COMMENT_TAG: /<!--[\s\S]*?-->/g,
            EMPTY_LINES: /^(?:\s*?)$/gm,
            EMPTY_START_BUFFER: null,
            EMPTY_APPEND_BUFFER: null
        };
        this.buffer = {
            APPEND: '\'+(',
            POST_APPEND: ')+\'',
            START: null,
            END: '\';\n'
        };
        this.setupImports(imports);
        this.helper = helper;
        this.filter = filter;
        this.setupRegularExpressions();
        this.setupBuffer();
    }
    Compiler.prototype.registerImport = function (name, imports) {
        if (this.importNames.indexOf(name) < 0) {
            this.importNames.push(name);
            this.importValues.push(imports);
        }
    };
    Compiler.prototype.removeImport = function (name) {
        var index = this.importNames.indexOf(name);
        if (index > -1) {
            this.importNames.splice(index, 1);
            this.importValues.splice(index, 1);
        }
    };
    Compiler.prototype.registerHelper = function (operator, callback) {
        if (operator.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING) {
            throw Error("Helper cannot start with \"" + Compiler.settings.DELIMITER.CLOSING + "\"!");
        }
        this.helper[operator] = callback;
    };
    Compiler.prototype.removeHelper = function (operator) {
        delete this.helper[operator];
    };
    Compiler.prototype.registerFilter = function (name, callback) {
        this.filter[name] = callback;
    };
    Compiler.prototype.removeFilter = function (name) {
        delete this.filter[name];
    };
    Compiler.prototype.compile = function (template) {
        template = escape_1.default(template);
        var matches = this.matchBlocks(template);
        var previous;
        var length = matches.length;
        var parts = [];
        var index = -1;
        while (++index < length) {
            if (!previous) {
                parts.push(template.slice(0, matches[index]['start']));
                parts.push(matches[index]['content']);
            }
            else {
                parts.push(template.slice(previous['end'], matches[index]['start']));
                parts.push(matches[index]['content']);
            }
            previous = matches[index];
        }
        parts.push(template.slice(previous['end']));
        template = parts.join('');
        template = template
            .replace(this.replaceExpressions.EMPTY_COMMENT_TAG, '')
            .replace(this.replaceExpressions.BEFORE_HTML_TAG, '<')
            .replace(this.replaceExpressions.AFTER_HTML_TAG, '>')
            .replace(this.replaceExpressions.NEW_LINE, '');
        template = 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){\n'
            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});\n'
            + 'var ' + Compiler.settings.VARIABLE_PRINT + ' = \'\';\n'
            + this.buffer.START + template + this.buffer.END
            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';\n}';
        template = template
            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '$1+=')
            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
            .replace(this.replaceExpressions.EMPTY_LINES, '');
        return this.createTemplateFunction(template);
    };
    Compiler.prototype.createTemplateFunction = function (source) {
        try {
            return Function.call(Function.prototype, this.importNames.join(','), 'return ' + source).apply(undefined, this.importValues);
        }
        catch (e) {
            throw e;
        }
    };
    Compiler.prototype.matchBlocks = function (input) {
        var match;
        var matches = [];
        this.blockRegex.lastIndex = 0;
        while ((match = this.blockRegex.exec(input)) !== null) {
            matches.push({
                start: match.index,
                content: this.parseBlock(match),
                end: match.index + match[Match.FULL_MATCH].length
            });
        }
        return matches;
    };
    Compiler.prototype.parseBlock = function (match) {
        var input = unescape_1.default(match[Match.FULL_MATCH].slice(Compiler.settings.DELIMITER.OPENING_BLOCK.length, match[Match.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length));
        var properties = this.getBlockProperties(input);
        if (this.helper[properties.OPERATOR]) {
            if (properties.FILTER.length > 0) {
                return this.callFilterList(properties.FILTER, this.callHelper(properties));
            }
            else {
                return this.callHelper(properties);
            }
        }
        return input;
    };
    Compiler.prototype.getBlockProperties = function (blockString) {
        var operator = this.getBlockOperator(blockString);
        var closing = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING;
        var selfClosing = (!closing)
            ? (blockString.slice((operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length))
                === Compiler.settings.DELIMITER.SPACE + operator
            : false;
        var parameter = this.getBlockParameter(blockString, operator, selfClosing);
        var filter = this.getBlockFilter(parameter);
        return {
            OPERATOR: operator,
            FILTER: filter,
            PARAMETER: this.removeBlockFilter(parameter),
            CLOSING: closing,
            SELF_CLOSING: selfClosing
        };
    };
    Compiler.prototype.getBlockOperator = function (blockString) {
        var index = blockString.indexOf(Compiler.settings.DELIMITER.SPACE, 0);
        var closing = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
            === Compiler.settings.DELIMITER.CLOSING;
        return blockString.slice((closing) ? 1 : 0, (index > 0) ? index : blockString.length);
    };
    Compiler.prototype.getBlockParameter = function (blockString, operator, selfClosing) {
        var start = operator.length + Compiler.settings.DELIMITER.SPACE.length;
        var end = (selfClosing)
            ? blockString.length - (operator.length + Compiler.settings.DELIMITER.SPACE.length)
            : blockString.length;
        return blockString.slice(start, end);
    };
    Compiler.prototype.getBlockFilter = function (parameter) {
        var filter = [];
        var filterSeperator = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE;
        var index = parameter.indexOf(filterSeperator);
        var previous;
        while (index > 0) {
            previous = index;
            index = parameter.indexOf(filterSeperator, index + 1);
            if (index > 0) {
                filter.push(string_trim_1.default(parameter.slice(previous + filterSeperator.length, index)));
            }
        }
        if (previous && previous > -1) {
            filter.push(string_trim_1.default(parameter.slice(previous + filterSeperator.length)));
        }
        return filter;
    };
    Compiler.prototype.removeBlockFilter = function (parameter) {
        var filterSeperator = Compiler.settings.DELIMITER.SPACE
            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
            + Compiler.settings.DELIMITER.SPACE;
        var index = parameter.indexOf(filterSeperator);
        if (index > 0) {
            return parameter.slice(0, index);
        }
        return parameter;
    };
    Compiler.prototype.callFilterList = function (filterList, input) {
        var filterLength = filterList.length;
        var index = -1;
        while (++index < filterLength) {
            input = this.callFilter(filterList[index], input);
        }
        return input;
    };
    Compiler.prototype.callHelper = function (properties) {
        try {
            return this.helper[properties.OPERATOR](properties.OPERATOR, properties.PARAMETER, properties.SELF_CLOSING, properties.CLOSING, this.buffer, this);
        }
        catch (e) {
            return '';
        }
    };
    Compiler.prototype.callFilter = function (name, input) {
        try {
            return this.filter[name](name, input, this.buffer, this);
        }
        catch (e) {
            return input;
        }
    };
    Compiler.prototype.setupImports = function (imports) {
        var length = 0;
        var index = -1;
        this.importNames = object_keys_1.default(imports);
        this.importValues = Array(this.importNames.length);
        length = this.importNames.length;
        while (++index < length) {
            this.importValues[index] = imports[this.importNames[index]];
        }
    };
    Compiler.prototype.setupRegularExpressions = function () {
        this.blockRegex = new RegExp(regex_escape_1.default(Compiler.settings.DELIMITER.OPENING_BLOCK)
            + '.+?'
            + regex_escape_1.default(Compiler.settings.DELIMITER.CLOSING_BLOCK), 'g');
        this.replaceExpressions.EMPTY_APPEND_BUFFER = new RegExp('(' + Compiler.settings.VARIABLE_PRINT
            + '\\+\\=[\\\'\\"]{2}\\;)' + '|(\\+[\\\'\\"]{2})', 'g');
        this.replaceExpressions.EMPTY_START_BUFFER = new RegExp('(' + Compiler.settings.VARIABLE_PRINT
            + ')\\+\\=[\\\'\\"]{2}\\+', 'g');
    };
    Compiler.prototype.setupBuffer = function () {
        var variableRegex = /__variable__/g;
        this.buffer.START = Compiler.settings.VARIABLE_PRINT + '+=\'';
    };
    Compiler.settings = {
        VARIABLE_NAME: 'local',
        VARIABLE_PRINT: '__print',
        DELIMITER: {
            FILTER_SEPERATOR: '|',
            OPENING_BLOCK: '{{',
            CLOSING_BLOCK: '}}',
            CLOSING: '/',
            SPACE: ' '
        }
    };
    return Compiler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Compiler;
