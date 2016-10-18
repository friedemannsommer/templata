(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Templata"] = factory();
	else
		root["Templata"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var regex_escape_1 = __webpack_require__(1);
	var object_keys_1 = __webpack_require__(2);
	var string_trim_1 = __webpack_require__(3);
	var escape_1 = __webpack_require__(4);
	var RegEx;
	(function (RegEx) {
	    RegEx[RegEx["FULL_MATCH"] = 0] = "FULL_MATCH";
	})(RegEx || (RegEx = {}));
	var Compiler = (function () {
	    function Compiler(imports, helper, filter, provider) {
	        if (imports === void 0) { imports = {}; }
	        if (helper === void 0) { helper = {}; }
	        if (filter === void 0) { filter = {}; }
	        if (provider === void 0) { provider = {}; }
	        this.replaceExpressions = {
	            NEW_LINE: /\r|\n|\t|\/\*[\s\S]*?\*\//g,
	            AFTER_HTML_TAG: />\s+/g,
	            BEFORE_HTML_TAG: /\s+</g,
	            EMPTY_COMMENT_TAG: /<!--[\s\S]*?-->/g,
	            EMPTY_LINES: /^(?:\s*?)$/gm,
	            EMPTY_APPEND_BUFFER: /\s*\+\s*([\'\"]{1})\1/g,
	            EMPTY_START_APPEND_BUFFER: null,
	            EMPTY_START_BUFFER: null
	        };
	        this.matchExpressions = {
	            BLOCK_LIST: null
	        };
	        this.buffer = {
	            APPEND: '\'+(',
	            POST_APPEND: ')+\'',
	            START: null,
	            END: '\';\n'
	        };
	        this._setupImports(imports);
	        this._provider = provider;
	        this._helper = helper;
	        this._filter = filter;
	        this._listener = {};
	        this._setupRegularExpressions();
	        this._setupBuffer();
	    }
	    Compiler.prototype.registerImport = function (name, imports) {
	        if (!this.hasImport(name)) {
	            this._importNames.push(name);
	            this._importValues.push(imports);
	        }
	        return this;
	    };
	    Compiler.prototype.hasImport = function (name) {
	        return this._importNames.indexOf(name) >= 0;
	    };
	    Compiler.prototype.removeImport = function (name) {
	        var index = this._importNames.indexOf(name);
	        if (index > -1) {
	            this._importNames.splice(index, 1);
	            this._importValues.splice(index, 1);
	        }
	        return this;
	    };
	    Compiler.prototype.registerHelper = function (operator, callback) {
	        if (operator.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING) {
	            throw Error("Helper cannot start with \"" + Compiler.settings.DELIMITER.CLOSING + "\"!");
	        }
	        this._helper[operator] = callback;
	        return this;
	    };
	    Compiler.prototype.hasHelper = function (operator) {
	        return typeof this._helper[operator] === 'function';
	    };
	    Compiler.prototype.removeHelper = function (operator) {
	        delete this._helper[operator];
	        return this;
	    };
	    Compiler.prototype.registerFilter = function (name, callback) {
	        this._filter[name] = callback;
	        return this;
	    };
	    Compiler.prototype.hasFilter = function (name) {
	        return typeof this._filter[name] === 'function';
	    };
	    Compiler.prototype.removeFilter = function (name) {
	        delete this._filter[name];
	        return this;
	    };
	    Compiler.prototype.registerProvider = function (name, callback) {
	        this._provider[name] = callback;
	        return this;
	    };
	    Compiler.prototype.hasProvider = function (name) {
	        return typeof this._provider[name] === 'function';
	    };
	    Compiler.prototype.removeProvider = function (name) {
	        delete this._provider[name];
	        return this;
	    };
	    Compiler.prototype.on = function (name, callback) {
	        if (this._listener.hasOwnProperty(name)) {
	            this._listener[name].push(callback);
	        }
	        else {
	            this._listener[name] = [callback];
	        }
	        return this;
	    };
	    Compiler.prototype.off = function (name, callback) {
	        if (!this._listener.hasOwnProperty(name)) {
	            return this;
	        }
	        var length = this._listener[name].length;
	        var index = -1;
	        while (++index < length) {
	            if (this._listener[name][index] === callback) {
	                this._listener[name].splice(index, 1);
	                length = this._listener[name].length;
	            }
	        }
	        return this;
	    };
	    Compiler.prototype.dispatch = function (name) {
	        var data = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            data[_i - 1] = arguments[_i];
	        }
	        if (!this._listener.hasOwnProperty(name)) {
	            return void 0;
	        }
	        var length = this._listener[name].length;
	        var index = -1;
	        while (++index < length) {
	            this._listener[name][index].apply(undefined, [name, this].concat(data));
	        }
	    };
	    Compiler.prototype.callProvider = function (name) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        return this._provider[name].apply(undefined, [name].concat(args));
	    };
	    Compiler.prototype.initialize = function (helper) {
	        helper(this);
	        return this;
	    };
	    Compiler.prototype.compile = function (template) {
	        if (typeof template !== 'string') {
	            throw new Error("Expected parameter \"template\" to be typeof \"string\" but instead got \"" + typeof template + "\"");
	        }
	        this.dispatch('COMPILE_START');
	        template = escape_1.default(template);
	        return this._createTemplateFunction(this._optimizeTemplate(this._concatTemplateParts(this._matchBlocks(template), template)));
	    };
	    Compiler.prototype._createTemplateFunction = function (source) {
	        this.dispatch('COMPILE_END');
	        return new Function(this._importNames.join(','), 'return ' + source).apply(undefined, this._importValues);
	    };
	    Compiler.prototype._optimizeTemplate = function (template) {
	        return this._optimizeFnSource(this._addFnBody(template
	            .replace(this.replaceExpressions.EMPTY_COMMENT_TAG, '')
	            .replace(this.replaceExpressions.BEFORE_HTML_TAG, '<')
	            .replace(this.replaceExpressions.AFTER_HTML_TAG, '>')
	            .replace(this.replaceExpressions.NEW_LINE, '')));
	    };
	    Compiler.prototype._addFnBody = function (template) {
	        return 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){'
	            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});'
	            + 'var ' + Compiler.settings.VARIABLE_PRINT + '=\'\';'
	            + this.buffer.START + template + this.buffer.END
	            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';}';
	    };
	    Compiler.prototype._optimizeFnSource = function (template) {
	        return template
	            .replace(this.replaceExpressions.EMPTY_START_APPEND_BUFFER, '$1+=')
	            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
	            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '')
	            .replace(this.replaceExpressions.EMPTY_LINES, '');
	    };
	    Compiler.prototype._concatTemplateParts = function (matches, template) {
	        var length = matches.length;
	        var parts = [];
	        var index = -1;
	        var previous;
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
	        if (previous !== undefined) {
	            parts.push(template.slice(previous['end']));
	            template = parts.join('');
	        }
	        return template;
	    };
	    Compiler.prototype._matchBlocks = function (input) {
	        var matches = [];
	        var match;
	        this.matchExpressions.BLOCK_LIST.lastIndex = 0;
	        while ((match = this.matchExpressions.BLOCK_LIST.exec(input)) !== null) {
	            matches.push({
	                start: match.index,
	                content: this._parseBlock(match),
	                end: match.index + match[RegEx.FULL_MATCH].length
	            });
	        }
	        return matches;
	    };
	    Compiler.prototype._parseBlock = function (match) {
	        var input = match[RegEx.FULL_MATCH].slice(Compiler.settings.DELIMITER.OPENING_BLOCK.length, match[RegEx.FULL_MATCH].length - Compiler.settings.DELIMITER.CLOSING_BLOCK.length);
	        var properties = this._getBlockProperties(input);
	        if (this._helper[properties.OPERATOR]) {
	            if (properties.FILTER.length > 0) {
	                return this._callFilterList(properties.FILTER, this._callHelper(properties));
	            }
	            else {
	                return this._callHelper(properties);
	            }
	        }
	        return input;
	    };
	    Compiler.prototype._getBlockProperties = function (blockString) {
	        var operator = this._getBlockOperator(blockString);
	        var closing = this._isClosingBlock(blockString);
	        var selfClosing = this._isSelfClosingBlock(blockString, operator, closing);
	        var parameter = this._getBlockParameter(blockString, operator, selfClosing);
	        var filter = this._getBlockFilter(parameter);
	        return {
	            OPERATOR: operator,
	            FILTER: filter,
	            PARAMETER: this._removeBlockFilter(parameter),
	            CLOSING: closing,
	            SELF_CLOSING: selfClosing
	        };
	    };
	    Compiler.prototype._getBlockOperator = function (blockString) {
	        var index = blockString.indexOf(Compiler.settings.DELIMITER.SPACE, 0);
	        var closing = blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length)
	            === Compiler.settings.DELIMITER.CLOSING;
	        return blockString.slice((closing)
	            ? Compiler.settings.DELIMITER.CLOSING.length
	            : 0, (index > 0)
	            ? index
	            : blockString.length);
	    };
	    Compiler.prototype._isClosingBlock = function (blockString) {
	        return blockString.slice(0, Compiler.settings.DELIMITER.CLOSING.length) === Compiler.settings.DELIMITER.CLOSING;
	    };
	    Compiler.prototype._isSelfClosingBlock = function (blockString, operator, closing) {
	        if (!closing) {
	            return (blockString.slice((operator.length * -1) - Compiler.settings.DELIMITER.SPACE.length)) === Compiler.settings.DELIMITER.SPACE + operator;
	        }
	        return false;
	    };
	    Compiler.prototype._getBlockParameter = function (blockString, operator, selfClosing) {
	        var start = operator.length + Compiler.settings.DELIMITER.SPACE.length;
	        var end = (selfClosing)
	            ? blockString.length - (operator.length + Compiler.settings.DELIMITER.SPACE.length)
	            : blockString.length;
	        return blockString.slice(start, end);
	    };
	    Compiler.prototype._getBlockFilter = function (parameter) {
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
	        if (previous !== undefined && previous > -1) {
	            filter.push(string_trim_1.default(parameter.slice(previous + filterSeperator.length)));
	        }
	        return filter;
	    };
	    Compiler.prototype._removeBlockFilter = function (parameter) {
	        var filterSeperator = Compiler.settings.DELIMITER.SPACE
	            + Compiler.settings.DELIMITER.FILTER_SEPERATOR
	            + Compiler.settings.DELIMITER.SPACE;
	        var index = parameter.indexOf(filterSeperator);
	        if (index > 0) {
	            return parameter.slice(0, index);
	        }
	        return parameter;
	    };
	    Compiler.prototype._callFilterList = function (filterList, input) {
	        var filterLength = filterList.length;
	        var index = -1;
	        while (++index < filterLength) {
	            input = this._callFilter(filterList[index], input);
	        }
	        return input;
	    };
	    Compiler.prototype._callHelper = function (properties) {
	        try {
	            return this._helper[properties.OPERATOR](properties.OPERATOR, properties.PARAMETER, properties.SELF_CLOSING, properties.CLOSING, this.buffer, this);
	        }
	        catch (e) {
	            return '';
	        }
	    };
	    Compiler.prototype._callFilter = function (name, input) {
	        try {
	            return this._filter[name](name, input, this.buffer, this);
	        }
	        catch (e) {
	            return input;
	        }
	    };
	    Compiler.prototype._setupImports = function (imports) {
	        var length = 0;
	        var index = -1;
	        this._importNames = object_keys_1.default(imports);
	        this._importValues = Array(this._importNames.length);
	        length = this._importNames.length;
	        while (++index < length) {
	            this._importValues[index] = imports[this._importNames[index]];
	        }
	    };
	    Compiler.prototype._setupRegularExpressions = function () {
	        this.matchExpressions.BLOCK_LIST = new RegExp('__OPENING_BLOCK__.+?__CLOSING_BLOCK__'
	            .replace('__OPENING_BLOCK__', regex_escape_1.default(Compiler.settings.DELIMITER.OPENING_BLOCK))
	            .replace('__CLOSING_BLOCK__', regex_escape_1.default(Compiler.settings.DELIMITER.CLOSING_BLOCK)), 'g');
	        this.replaceExpressions.EMPTY_START_BUFFER = new RegExp('__VARIABLE_PRINT__\\s*?\\+=\\s*?([\\\'\\"]{1})\\\u0031\\;'
	            .replace('__VARIABLE_PRINT__', regex_escape_1.default(Compiler.settings.VARIABLE_PRINT)), 'g');
	        this.replaceExpressions.EMPTY_START_APPEND_BUFFER = new RegExp('(__VARIABLE_PRINT__)\\s*?\\+\\=\\s*?([\\\'\\"]{1})\\\u0032\\s*?\\+'
	            .replace('__VARIABLE_PRINT__', regex_escape_1.default(Compiler.settings.VARIABLE_PRINT)), 'g');
	    };
	    Compiler.prototype._setupBuffer = function () {
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	function objectKeys(object) {
	    var output = [];
	    var forbiddenKeys = [
	        'toString',
	        'toLocalString',
	        'valueOf',
	        'hasOwnProperty',
	        'isPrototypeOf',
	        'propertyIsEnumerable',
	        'constructor'
	    ];
	    for (var key in object) {
	        if (object.hasOwnProperty(key) && forbiddenKeys.indexOf(key) < 0) {
	            output.push(key);
	        }
	    }
	    return output;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = objectKeys;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function stringTrim(input) {
	    return input.replace(/^\s+|\s+$/g, '');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = stringTrim;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	function escape(input) {
	    return input.replace(/'|\\/g, '\\$&');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = escape;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=templata-compiler.map