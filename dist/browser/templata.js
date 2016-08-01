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
/******/ 	__webpack_require__.p = "/dist/browser/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var compiler_1 = __webpack_require__(1);
	var iterate_1 = __webpack_require__(6);
	var pure_javascript_1 = __webpack_require__(15);
	var encode_value_1 = __webpack_require__(16);
	var condition_1 = __webpack_require__(18);
	var comment_1 = __webpack_require__(20);
	var print_1 = __webpack_require__(21);
	var lowercase_1 = __webpack_require__(22);
	var uppercase_1 = __webpack_require__(24);
	var currency_1 = __webpack_require__(25);
	var defaultHelper = {
	    '??': condition_1.default,
	    '-': pure_javascript_1.default,
	    '!': encode_value_1.default,
	    '?': condition_1.default,
	    '~': iterate_1.iterate,
	    '*': comment_1.default,
	    '=': print_1.default
	};
	var defaultFilter = {
	    'lowercase': lowercase_1.default,
	    'uppercase': uppercase_1.default,
	    'currency': currency_1.default
	};
	function template(template, imports) {
	    if (imports === void 0) { imports = {}; }
	    return new compiler_1.default(imports, defaultHelper, defaultFilter).initialize(iterate_1.initialize).compile(template);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = template;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var regex_escape_1 = __webpack_require__(2);
	var object_keys_1 = __webpack_require__(3);
	var string_trim_1 = __webpack_require__(4);
	var escape_1 = __webpack_require__(5);
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
	            EMPTY_START_BUFFER: null,
	            EMPTY_APPEND_BUFFER: null
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
	        var index = -1;
	        var length = this._listener[name].length;
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
	        var index = -1;
	        var length = this._listener[name].length;
	        while (++index < length) {
	            this._listener[name][index].apply(undefined, [name, this].concat(data));
	        }
	    };
	    Compiler.prototype.callProvider = function (name) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        try {
	            return this._provider[name].apply(undefined, [name].concat(args));
	        }
	        catch (e) {
	            throw e;
	        }
	    };
	    Compiler.prototype.initialize = function (helper) {
	        helper(this);
	        return this;
	    };
	    Compiler.prototype.compile = function (template) {
	        if (typeof template !== 'string') {
	            throw new Error("Expected parameter \"template\" tobe typeof \"string\" but instead got \"" + typeof template + "\"");
	        }
	        this.dispatch('COMPILE_START');
	        template = escape_1.default(template);
	        return this._createTemplateFunction(this._optimizeTemplate(this._concatTemplateParts(this._matchBlocks(template), template)));
	    };
	    Compiler.prototype._createTemplateFunction = function (source) {
	        this.dispatch('COMPILE_END');
	        try {
	            return new Function(this._importNames.join(','), 'return ' + source).apply(undefined, this._importValues);
	        }
	        catch (e) {
	            throw e;
	        }
	    };
	    Compiler.prototype._matchBlocks = function (input) {
	        var match;
	        var matches = [];
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
	        return blockString.slice((closing) ? 1 : 0, (index > 0) ? index : blockString.length);
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
	        if (previous && previous > -1) {
	            filter.push(string_trim_1.default(parameter.slice(previous + filterSeperator.length)));
	        }
	        return filter;
	    };
	    Compiler.prototype._concatTemplateParts = function (matches, template) {
	        var previous;
	        var index = -1;
	        var parts = [];
	        var length = matches.length;
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
	        if (previous) {
	            parts.push(template.slice(previous['end']));
	            template = parts.join('');
	        }
	        return template;
	    };
	    Compiler.prototype._addFnBody = function (template) {
	        return 'function anonymous(' + Compiler.settings.VARIABLE_NAME + '){'
	            + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});'
	            + 'var ' + Compiler.settings.VARIABLE_PRINT + '=\'\';'
	            + this.buffer.START + template + this.buffer.END
	            + 'return ' + Compiler.settings.VARIABLE_PRINT + ';}';
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
	    Compiler.prototype._optimizeTemplate = function (template) {
	        return this._optimizeFnSource(this._addFnBody(template
	            .replace(this.replaceExpressions.EMPTY_COMMENT_TAG, '')
	            .replace(this.replaceExpressions.BEFORE_HTML_TAG, '<')
	            .replace(this.replaceExpressions.AFTER_HTML_TAG, '>')
	            .replace(this.replaceExpressions.NEW_LINE, '')));
	    };
	    Compiler.prototype._optimizeFnSource = function (template) {
	        return template
	            .replace(this.replaceExpressions.EMPTY_START_BUFFER, '$1+=')
	            .replace(this.replaceExpressions.EMPTY_APPEND_BUFFER, '')
	            .replace(this.replaceExpressions.EMPTY_LINES, '');
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
	        this.replaceExpressions.EMPTY_APPEND_BUFFER = new RegExp('(__VARIABLE_PRINT__\\+\\=[\\\'\\"]{2}\\;)|(\\+[\\\'\\"]{2})'
	            .replace('__VARIABLE_PRINT__', regex_escape_1.default(Compiler.settings.VARIABLE_PRINT)), 'g');
	        this.replaceExpressions.EMPTY_START_BUFFER = new RegExp('(__VARIABLE_PRINT__)\\+\\=[\\\'\\"]{2}\\+'
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
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ function(module, exports) {

	"use strict";
	function stringTrim(input) {
	    return input.replace(/^\s+|\s+$/g, '');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = stringTrim;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function escape(input) {
	    return input.replace(/'|\\/g, '\\$&');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = escape;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var parse_parameter_1 = __webpack_require__(7);
	var string_trim_1 = __webpack_require__(4);
	var each_object_1 = __webpack_require__(8);
	var each_array_1 = __webpack_require__(9);
	var is_object_1 = __webpack_require__(10);
	var is_array_1 = __webpack_require__(11);
	var iterator_1 = __webpack_require__(14);
	var iteratorIndexer;
	function iterate(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    compiler.registerImport('__isArray', is_array_1.default);
	    compiler.registerImport('__isObject', is_object_1.default);
	    compiler.registerImport('__eachArray', each_array_1.default);
	    compiler.registerImport('__eachObject', each_object_1.default);
	    if (closingTag) {
	        return buffer.END + '}' + buffer.START;
	    }
	    if (parameter && parameter !== '') {
	        var _a = parse_parameter_1.default(parameter, ':', ','), valueVar = _a[0], indexVar = _a[1];
	        var iterable = string_trim_1.default(parameter.slice(0, parameter.indexOf(':')));
	        var iteratorIndex = iteratorIndexer();
	        valueVar = ((valueVar) ? valueVar : 'value_' + iteratorIndex);
	        indexVar = ((indexVar) ? indexVar : 'key_' + iteratorIndex);
	        return buffer.END
	            + 'if(__isArray(' + iterable + ')){__eachArray('
	            + iterable + ',iterate_' + iteratorIndex + ');}'
	            + 'else if(__isObject(' + iterable + ')){__eachObject('
	            + iterable + ',iterate_' + iteratorIndex + ');}'
	            + 'function iterate_' + iteratorIndex + ' (' + valueVar + ',' + indexVar + '){'
	            + buffer.START;
	    }
	    return parameter;
	}
	exports.iterate = iterate;
	function initialize(compiler) {
	    compiler.on('COMPILE_START', function () {
	        iteratorIndexer = iterator_1.default(0);
	    });
	}
	exports.initialize = initialize;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = iterate;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var string_trim_1 = __webpack_require__(4);
	function parseParameter(input, blockSeperator, seperator) {
	    if (blockSeperator === void 0) { blockSeperator = ':'; }
	    if (seperator === void 0) { seperator = ','; }
	    var start = input.indexOf(blockSeperator);
	    var end = input.indexOf(blockSeperator, start + 1);
	    var parameter = input.slice(start + 1, end).split(seperator);
	    var index = -1;
	    var length = parameter.length;
	    while (++index < length) {
	        parameter[index] = string_trim_1.default(parameter[index]);
	    }
	    return parameter;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = parseParameter;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var object_keys_1 = __webpack_require__(3);
	var largeObjectLength = 25;
	function preCompileIterator(properties) {
	    var index = -1;
	    var length = properties.length >>> 0;
	    var fnString = '(function(object, callback){\n';
	    while (++index < length) {
	        fnString += 'callback(object["' + properties[index] + '"], "' + properties[index] + '", object);';
	    }
	    fnString += '\n});';
	    return eval(fnString);
	}
	function iterate(object, callback, keys) {
	    if (keys === void 0) { keys = object_keys_1.default(object); }
	    if (keys.length >= largeObjectLength) {
	        preCompileIterator(keys)(object, callback);
	    }
	    else {
	        var index = -1;
	        var length_1 = keys.length >>> 0;
	        while (++index < length_1) {
	            callback(object[keys[index]], keys[index], object);
	        }
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = iterate;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	function iterate(array, fn) {
	    var index = -1;
	    var length = array.length >>> 0;
	    while (++index < length) {
	        if (fn(array[index], index, array) === false) {
	            break;
	        }
	    }
	    return array;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = iterate;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function isObject(value) {
	    return typeof value === 'function' || typeof value === 'object' && !!value;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isObject;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var get_type_1 = __webpack_require__(12);
	function isArray(value) {
	    return (typeof Array.isArray === 'function')
	        ? Array.isArray(value)
	        : get_type_1.default(value) === 'array';
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isArray;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var substr_1 = __webpack_require__(13);
	function default_1(object) {
	    var output = substr_1.default(Object.prototype.toString.call(object), 0, 8);
	    return substr_1.default(output, output.length - 1, 1).toLowerCase();
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	function substr(value, index, length) {
	    if (length === void 0) { length = 1; }
	    if (index < 0 || index > value.length) {
	        throw new RangeError();
	    }
	    return (index > 0) ? value.slice(0, index) + value.slice(index + length) : value.slice(index + length);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = substr;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	function iterator(initial) {
	    return function () {
	        return initial++;
	    };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = iterator;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var string_trim_1 = __webpack_require__(4);
	function javascript(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    return buffer.END + string_trim_1.default(parameter) + buffer.START;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = javascript;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var string_trim_1 = __webpack_require__(4);
	var html_escape_1 = __webpack_require__(17);
	function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    compiler.registerImport('__htmlEscape', html_escape_1.default);
	    return buffer.APPEND + '__htmlEscape(' + string_trim_1.default(parameter) + ')' + buffer.POST_APPEND;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = htmlEscape;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var string_trim_1 = __webpack_require__(4);
	var unescape_1 = __webpack_require__(19);
	function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    if (closingTag) {
	        return buffer.END + '}' + buffer.START;
	    }
	    switch (operator) {
	        case '?':
	            if (parameter && parameter !== '') {
	                return buffer.END + 'if(' + string_trim_1.default(unescape_1.default(parameter)) + '){' + buffer.START;
	            }
	            else {
	                return buffer.END + '}else{' + buffer.START;
	            }
	        case '??':
	            if (parameter && parameter !== '') {
	                return buffer.END + '}else if(' + string_trim_1.default(unescape_1.default(parameter)) + '){' + buffer.START;
	            }
	            else {
	                return buffer.END + '}else{' + buffer.START;
	            }
	    }
	    return parameter;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	function unescape(string) {
	    return string.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = unescape;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	function comment(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    return '';
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = comment;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var string_trim_1 = __webpack_require__(4);
	function print(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	    return buffer.APPEND + string_trim_1.default(parameter) + buffer.POST_APPEND;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = print;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var remove_previous_buffer_1 = __webpack_require__(23);
	function lowercase(input) {
	    return input.toLocaleLowerCase();
	}
	function filterLowercase(name, input, buffer, compiler) {
	    compiler.registerImport('__f_lc', lowercase);
	    return buffer.APPEND + '__f_lc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = filterLowercase;


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	function removePreviousBuffer(input, buffer) {
	    if (input.slice(0, buffer.APPEND.length) === buffer.APPEND) {
	        return input.replace(buffer.APPEND, '').replace(buffer.POST_APPEND, '');
	    }
	    if (input.slice(0, buffer.START.length) === buffer.START) {
	        return input.replace(buffer.START, '').replace(buffer.END, '');
	    }
	    return input;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = removePreviousBuffer;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var remove_previous_buffer_1 = __webpack_require__(23);
	function uppercase(input) {
	    return input.toLocaleUpperCase();
	}
	function filterUppercase(name, input, buffer, compiler) {
	    compiler.registerImport('__f_uc', uppercase);
	    return buffer.APPEND + '__f_uc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = filterUppercase;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var remove_previous_buffer_1 = __webpack_require__(23);
	var string_trim_1 = __webpack_require__(4);
	function currency(input) {
	    return input.replace(/(?:([0-9]+?[\.\,]+?[0-9]+?)|([0-9]+?))(?:\s|[^0-9]|$)/g, function (match, floatString) {
	        if (navigator.language.toLowerCase().indexOf('de') > -1) {
	            if (floatString.indexOf(',') > -1) {
	                return parseFloat(floatString.replace(',', '.')).toFixed(2).replace('.', ',');
	            }
	            else {
	                return parseFloat(floatString).toFixed(2).replace('.', ',');
	            }
	        }
	        else {
	            if (floatString.indexOf(',') > -1) {
	                return parseFloat(floatString.replace(',', '.')).toFixed(2);
	            }
	            else {
	                return parseFloat(floatString).toFixed(2);
	            }
	        }
	    });
	}
	function filterCurrency(name, input, buffer, compiler) {
	    compiler.registerImport('__f_currency', currency);
	    return buffer.APPEND + '__f_currency(' + string_trim_1.default(remove_previous_buffer_1.default(input, buffer)) + ')' + buffer.POST_APPEND;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = filterCurrency;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=templata.map