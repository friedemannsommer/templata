/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "008080d13783b78c06d5"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
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
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(14), __webpack_require__(13), __webpack_require__(10), __webpack_require__(9), __webpack_require__(11), __webpack_require__(8), __webpack_require__(12), __webpack_require__(6), __webpack_require__(7), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, compiler_1, pure_javascript_1, encode_value_1, condition_1, iterate_1, comment_1, print_1, lowercase_1, uppercase_1, currency_1) {
	    "use strict";
	    function template(template, imports) {
	        if (imports === void 0) { imports = {}; }
	        var Compiler = new compiler_1.default(imports);
	        Compiler.registerHelper('??', condition_1.default);
	        Compiler.registerHelper('-', pure_javascript_1.default);
	        Compiler.registerHelper('!', encode_value_1.default);
	        Compiler.registerHelper('?', condition_1.default);
	        Compiler.registerHelper('~', iterate_1.default);
	        Compiler.registerHelper('*', comment_1.default);
	        Compiler.registerHelper('=', print_1.default);
	        Compiler.registerFilter('lowercase', lowercase_1.default);
	        Compiler.registerFilter('uppercase', uppercase_1.default);
	        Compiler.registerFilter('currency', currency_1.default);
	        return Compiler.compile(template);
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = template;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function stringTrim(input) {
	        return input.replace(/^\s+|\s+$/g, '');
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = stringTrim;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function objectKeys(object) {
	        var output = [], forbiddenKeys = [
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function unescape(string) {
	        return string.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = unescape;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, remove_previous_buffer_1, string_trim_1) {
	    "use strict";
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
	    function default_1(name, input, buffer, compiler) {
	        compiler.registerImport('__f_currency', currency);
	        return buffer.APPEND + '__f_currency(' + string_trim_1.default(remove_previous_buffer_1.default(input, buffer)) + ')' + buffer.POST_APPEND;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, remove_previous_buffer_1) {
	    "use strict";
	    function lowercase(input) {
	        return input.toLocaleLowerCase();
	    }
	    function default_1(name, input, buffer, compiler) {
	        compiler.registerImport('__f_lc', lowercase);
	        return buffer.APPEND + '__f_lc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, remove_previous_buffer_1) {
	    "use strict";
	    function uppercase(input) {
	        return input.toLocaleUpperCase();
	    }
	    function default_1(name, input, buffer, compiler) {
	        compiler.registerImport('__f_uc', uppercase);
	        return buffer.APPEND + '__f_uc(' + remove_previous_buffer_1.default(input, buffer) + ')' + buffer.POST_APPEND;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function comment(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	        return '';
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = comment;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, string_trim_1, unescape_1) {
	    "use strict";
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, string_trim_1, html_escape_1) {
	    "use strict";
	    function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	        compiler.registerImport('__htmlEscape', html_escape_1.default);
	        return buffer.APPEND + '__htmlEscape(' + string_trim_1.default(parameter) + ')' + buffer.POST_APPEND;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(23), __webpack_require__(1), __webpack_require__(16), __webpack_require__(15), __webpack_require__(21), __webpack_require__(20), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, parse_parameter_1, string_trim_1, each_object_1, each_array_1, is_object_1, is_array_1, iterator_1) {
	    "use strict";
	    var iteratorIndexer = iterator_1.default(0);
	    function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
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
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, string_trim_1) {
	    "use strict";
	    function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	        return buffer.APPEND + string_trim_1.default(parameter) + buffer.POST_APPEND;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, string_trim_1) {
	    "use strict";
	    function default_1(operator, parameter, selfClosing, closingTag, buffer, compiler) {
	        return buffer.END + string_trim_1.default(parameter) + buffer.START;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(24), __webpack_require__(3), __webpack_require__(1), __webpack_require__(4), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, regex_escape_1, object_keys_1, string_trim_1, unescape_1, escape_1) {
	    "use strict";
	    var Match;
	    (function (Match) {
	        Match[Match["FULL_MATCH"] = 0] = "FULL_MATCH";
	    })(Match || (Match = {}));
	    var Compiler = (function () {
	        function Compiler(imports, helper, filter) {
	            if (imports === void 0) { imports = {}; }
	            if (helper === void 0) { helper = {}; }
	            if (filter === void 0) { filter = {}; }
	            this.setupImports(imports);
	            this.helper = helper;
	            this.filter = filter;
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
	            template = template.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, '')
	                .replace(/>\s+/g, '>')
	                .replace(/\s+</g, '<')
	                .replace(/<!--[\s\S]*?-->/g, '');
	            template = 'function (' + Compiler.settings.VARIABLE_NAME + '){\n'
	                + Compiler.settings.VARIABLE_NAME + ' || (' + Compiler.settings.VARIABLE_NAME + ' = {});\n'
	                + 'var __print = \'\';\n'
	                + Compiler.buffer.START + template + Compiler.buffer.END
	                + 'return __print;\n}';
	            template = template.replace(/(\_\_[a-zA-Z0-9]+?\+\=[\'\"]{2}\;)|(\+[\'\"]{2})/g, '')
	                .replace(/(\_\_[a-zA-Z0-9]+?)\+\=[\'\"]{2}\+/g, '$1+=')
	                .replace(/^(?:\s*?)$/gm, '');
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
	            Compiler.blockRegex.lastIndex = 0;
	            while ((match = Compiler.blockRegex.exec(input)) !== null) {
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
	                return this.helper[properties.OPERATOR](properties.OPERATOR, properties.PARAMETER, properties.SELF_CLOSING, properties.CLOSING, Compiler.buffer, this);
	            }
	            catch (e) {
	                return '';
	            }
	        };
	        Compiler.prototype.callFilter = function (name, input) {
	            try {
	                return this.filter[name](name, input, Compiler.buffer, this);
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
	        Compiler.buffer = {
	            APPEND: '\'+(',
	            POST_APPEND: ')+\'',
	            START: '__print+=\'',
	            END: '\';\n'
	        };
	        Compiler.settings = {
	            VARIABLE_NAME: 'local',
	            DELIMITER: {
	                FILTER_SEPERATOR: '|',
	                OPENING_BLOCK: '{{',
	                CLOSING_BLOCK: '}}',
	                CLOSING: '/',
	                SPACE: ' '
	            }
	        };
	        Compiler.blockRegex = new RegExp(regex_escape_1.default(Compiler.settings.DELIMITER.OPENING_BLOCK)
	            + '.+?'
	            + regex_escape_1.default(Compiler.settings.DELIMITER.CLOSING_BLOCK), 'g');
	        return Compiler;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Compiler;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function iterate(array, fn) {
	        var index = -1, length = array.length >>> 0;
	        while (++index < length) {
	            if (fn(array[index], index, array) === false) {
	                break;
	            }
	        }
	        return array;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = iterate;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, object_keys_1) {
	    "use strict";
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function escape(input) {
	        return input.replace(/'|\\/g, "\\$&");
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = escape;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(25)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, substr_1) {
	    "use strict";
	    function default_1(object) {
	        var output = substr_1.default(Object.prototype.toString.call(object), 0, 8);
	        return substr_1.default(output, output.length - 1, 1).toLowerCase();
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = default_1;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, get_type_1) {
	    "use strict";
	    function isArray(value) {
	        return (typeof Array.isArray === 'function')
	            ? Array.isArray(value)
	            : get_type_1.default(value) === 'array';
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = isArray;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function isObject(value) {
	        return typeof value === 'function' || typeof value === 'object' && !!value;
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = isObject;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function iterator(initial) {
	        return function () {
	            return initial++;
	        };
	    }
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = iterator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, string_trim_1) {
	    "use strict";
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);
//# sourceMappingURL=typescript-templata.js.map