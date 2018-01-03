/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(34);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @template A
 */
class MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    // Classes extending MDCFoundation should implement this method to return an object which exports every
    // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
    return {};
  }

  /** @return enum{strings} */
  static get strings() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
    return {};
  }

  /** @return enum{numbers} */
  static get numbers() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
    return {};
  }

  /** @return {!Object} */
  static get defaultAdapter() {
    // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
    // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
    // validation.
    return {};
  }

  /**
   * @param {A=} adapter
   */
  constructor(adapter = {}) {
    /** @protected {!A} */
    this.adapter_ = adapter;
  }

  init() {
    // Subclasses should override this method to perform initialization routines (registering events, etc.)
  }

  destroy() {
    // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCFoundation);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__foundation__ = __webpack_require__(2);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * @template F
 */
class MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCComponent}
   */
  static attachTo(root) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().
    return new MDCComponent(root, new __WEBPACK_IMPORTED_MODULE_0__foundation__["a" /* default */]());
  }

  /**
   * @param {!Element} root
   * @param {F=} foundation
   * @param {...?} args
   */
  constructor(root, foundation = undefined, ...args) {
    /** @protected {!Element} */
    this.root_ = root;
    this.initialize(...args);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  initialize(/* ...args */) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.
  }

  /**
   * @return {!F} foundation
   */
  getDefaultFoundation() {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
      'foundation class');
  }

  initialSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this.foundation_.destroy();
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler);
  }

  /**
   * Fires a cross-browser-compatible custom event from the component root of the given type,
   * with the given data.
   * @param {string} evtType
   * @param {!Object} evtData
   * @param {boolean=} shouldBubble
   */
  emit(evtType, evtData, shouldBubble = false) {
    let evt;
    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble,
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCComponent);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return supportsCssVariables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return applyPassive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getMatchesProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getNormalizedEventCoords; });
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.
 * @private {boolean|undefined}
 */
let supportsCssVariables_;

/**
 * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.
 * @private {boolean|undefined}
 */
let supportsPassive_;

/**
 * @param {!Window} windowObj
 * @return {boolean}
 */
function detectEdgePseudoVarBug(windowObj) {
  // Detect versions of Edge with buggy var() support
  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
  const document = windowObj.document;
  const node = document.createElement('div');
  node.className = 'mdc-ripple-surface--test-edge-var-bug';
  document.body.appendChild(node);

  // The bug exists if ::before style ends up propagating to the parent element.
  // Additionally, getComputedStyle returns null in iframes with display: "none" in Firefox,
  // but Firefox is known to support CSS custom properties correctly.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  const computedStyle = windowObj.getComputedStyle(node);
  const hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';
  node.remove();
  return hasPseudoVarBug;
}

/**
 * @param {!Window} windowObj
 * @param {boolean=} forceRefresh
 * @return {boolean|undefined}
 */

function supportsCssVariables(windowObj, forceRefresh = false) {
  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
    return supportsCssVariables_;
  }

  const supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';
  if (!supportsFunctionPresent) {
    return;
  }

  const explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes');
  // See: https://bugs.webkit.org/show_bug.cgi?id=154669
  // See: README section on Safari
  const weAreFeatureDetectingSafari10plus = (
    windowObj.CSS.supports('(--css-vars: yes)') &&
    windowObj.CSS.supports('color', '#00000000')
  );

  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {
    supportsCssVariables_ = !detectEdgePseudoVarBug(windowObj);
  } else {
    supportsCssVariables_ = false;
  }
  return supportsCssVariables_;
}

//
/**
 * Determine whether the current browser supports passive event listeners, and if so, use them.
 * @param {!Window=} globalObj
 * @param {boolean=} forceRefresh
 * @return {boolean|{passive: boolean}}
 */
function applyPassive(globalObj = window, forceRefresh = false) {
  if (supportsPassive_ === undefined || forceRefresh) {
    let isSupported = false;
    try {
      globalObj.document.addEventListener('test', null, {get passive() {
        isSupported = true;
      }});
    } catch (e) { }

    supportsPassive_ = isSupported;
  }

  return supportsPassive_ ? {passive: true} : false;
}

/**
 * @param {!Object} HTMLElementPrototype
 * @return {!Array<string>}
 */
function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

/**
 * @param {!Event} ev
 * @param {!{x: number, y: number}} pageOffset
 * @param {!ClientRect} clientRect
 * @return {!{x: number, y: number}}
 */
function getNormalizedEventCoords(ev, pageOffset, clientRect) {
  const {x, y} = pageOffset;
  const documentX = x + clientRect.left;
  const documentY = y + clientRect.top;

  let normalizedX;
  let normalizedY;
  // Determine touch point relative to the ripple container.
  if (ev.type === 'touchstart') {
    normalizedX = ev.changedTouches[0].pageX - documentX;
    normalizedY = ev.changedTouches[0].pageY - documentY;
  } else {
    normalizedX = ev.pageX - documentX;
    normalizedY = ev.pageY - documentY;
  }

  return {x: normalizedX, y: normalizedY};
}




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(19);
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @extends {MDCFoundation<!MDCTextFieldBottomLineAdapter>}
 * @final
 */
class MDCTextFieldBottomLineFoundation extends __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__["a" /* default */] {
  /** @return enum {string} */
  static get cssClasses() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */];
  }

  /** @return enum {string} */
  static get strings() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */];
  }

  /**
   * {@see MDCTextFieldBottomLineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldBottomLineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldBottomLineAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      setAttr: () => {},
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      notifyAnimationEnd: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldBottomLineAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldBottomLineAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldBottomLineFoundation.defaultAdapter, adapter));

    /** @private {function(!Event): undefined} */
    this.transitionEndHandler_ = (evt) => this.handleTransitionEnd(evt);
  }

  init() {
    this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
  }

  destroy() {
    this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
  }

  /**
   * Activates the bottom line
   */
  activate() {
    this.adapter_.addClass(__WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */].BOTTOM_LINE_ACTIVE);
  }

  /**
   * Sets the transform origin given a user's click location.
   * @param {!Event} evt
   */
  setTransformOrigin(evt) {
    const targetClientRect = evt.target.getBoundingClientRect();
    const evtCoords = {x: evt.clientX, y: evt.clientY};
    const normalizedX = evtCoords.x - targetClientRect.left;
    const attributeString =
      `transform-origin: ${normalizedX}px center`;

    this.adapter_.setAttr('style', attributeString);
  }

  /**
   * Deactivates the bottom line
   */
  deactivate() {
    this.adapter_.removeClass(__WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */].BOTTOM_LINE_ACTIVE);
  }

  /**
   * Handles a transition end event
   * @param {!Event} evt
   */
  handleTransitionEnd(evt) {
    // Wait for the bottom line to be either transparent or opaque
    // before emitting the animation end event
    if (evt.propertyName === 'opacity') {
      this.adapter_.notifyAnimationEnd();
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCTextFieldBottomLineFoundation);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(20);
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @extends {MDCFoundation<!MDCTextFieldHelperTextAdapter>}
 * @final
 */
class MDCTextFieldHelperTextFoundation extends __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__["a" /* default */] {
  /** @return enum {string} */
  static get cssClasses() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */];
  }

  /** @return enum {string} */
  static get strings() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */];
  }

  /**
   * {@see MDCTextFieldHelperTextAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldHelperTextAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldHelperTextAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => {},
      setAttr: () => {},
      removeAttr: () => {},
      setContent: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldHelperTextAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldHelperTextAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldHelperTextFoundation.defaultAdapter, adapter));
  }

  /**
   * Sets the content of the helper text field.
   * @param {string} content
   */
  setContent(content) {
    this.adapter_.setContent(content);
  }

  /** Makes the helper text visible to the screen reader. */
  showToScreenReader() {
    this.adapter_.removeAttr(__WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */].ARIA_HIDDEN);
  }

  /**
   * Sets the validity of the helper text based on the input validity.
   * @param {boolean} inputIsValid
   */
  setValidity(inputIsValid) {
    const helperTextIsPersistent = this.adapter_.hasClass(__WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */].HELPER_TEXT_PERSISTENT);
    const helperTextIsValidationMsg = this.adapter_.hasClass(__WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */].HELPER_TEXT_VALIDATION_MSG);
    const validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;

    if (validationMsgNeedsDisplay) {
      this.adapter_.setAttr(__WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */].ROLE, 'alert');
    } else {
      this.adapter_.removeAttr(__WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */].ROLE);
    }

    if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
      this.hide_();
    }
  }

  /**
   * Hides the help text from screen readers.
   * @private
   */
  hide_() {
    this.adapter_.setAttr(__WEBPACK_IMPORTED_MODULE_2__constants__["b" /* strings */].ARIA_HIDDEN, 'true');
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCTextFieldHelperTextFoundation);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MDCRipple; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__foundation__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__foundation__["a"]; });
/* unused harmony reexport util */
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @extends MDCComponent<!MDCRippleFoundation>
 */
class MDCRipple extends __WEBPACK_IMPORTED_MODULE_0__material_base_component__["a" /* default */] {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @type {boolean} */
    this.disabled = false;

    /** @private {boolean} */
    this.unbounded_;
  }

  /**
   * @param {!Element} root
   * @param {{isUnbounded: (boolean|undefined)}=} options
   * @return {!MDCRipple}
   */
  static attachTo(root, {isUnbounded = undefined} = {}) {
    const ripple = new MDCRipple(root);
    // Only override unbounded behavior if option is explicitly specified
    if (isUnbounded !== undefined) {
      ripple.unbounded = /** @type {boolean} */ (isUnbounded);
    }
    return ripple;
  }

  /**
   * @param {!RippleCapableSurface} instance
   * @return {!MDCRippleAdapter}
   */
  static createAdapter(instance) {
    const MATCHES = __WEBPACK_IMPORTED_MODULE_3__util__["b" /* getMatchesProperty */](HTMLElement.prototype);

    return {
      browserSupportsCssVars: () => __WEBPACK_IMPORTED_MODULE_3__util__["d" /* supportsCssVariables */](window),
      isUnbounded: () => instance.unbounded,
      isSurfaceActive: () => instance.root_[MATCHES](':active'),
      isSurfaceDisabled: () => instance.disabled,
      addClass: (className) => instance.root_.classList.add(className),
      removeClass: (className) => instance.root_.classList.remove(className),
      registerInteractionHandler: (evtType, handler) =>
        instance.root_.addEventListener(evtType, handler, __WEBPACK_IMPORTED_MODULE_3__util__["a" /* applyPassive */]()),
      deregisterInteractionHandler: (evtType, handler) =>
        instance.root_.removeEventListener(evtType, handler, __WEBPACK_IMPORTED_MODULE_3__util__["a" /* applyPassive */]()),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      updateCssVariable: (varName, value) => instance.root_.style.setProperty(varName, value),
      computeBoundingRect: () => instance.root_.getBoundingClientRect(),
      getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
    };
  }

  /** @return {boolean} */
  get unbounded() {
    return this.unbounded_;
  }

  /** @param {boolean} unbounded */
  set unbounded(unbounded) {
    const {UNBOUNDED} = __WEBPACK_IMPORTED_MODULE_2__foundation__["a" /* default */].cssClasses;
    this.unbounded_ = Boolean(unbounded);
    if (this.unbounded_) {
      this.root_.classList.add(UNBOUNDED);
    } else {
      this.root_.classList.remove(UNBOUNDED);
    }
  }

  activate() {
    this.foundation_.activate();
  }

  deactivate() {
    this.foundation_.deactivate();
  }

  layout() {
    this.foundation_.layout();
  }

  /** @return {!MDCRippleFoundation} */
  getDefaultFoundation() {
    return new __WEBPACK_IMPORTED_MODULE_2__foundation__["a" /* default */](MDCRipple.createAdapter(this));
  }

  initialSyncWithDOM() {
    this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;
  }
}

/**
 * See Material Design spec for more details on when to use ripples.
 * https://material.io/guidelines/motion/choreography.html#choreography-creation
 * @record
 */
class RippleCapableSurface {}

/** @protected {!Element} */
RippleCapableSurface.prototype.root_;

/**
 * Whether or not the ripple bleeds out of the bounds of the element.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.unbounded;

/**
 * Whether or not the ripple is attached to a disabled component.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.disabled;




/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Ripple. Provides an interface for managing
 * - classes
 * - dom
 * - CSS variables
 * - position
 * - dimensions
 * - scroll position
 * - event handlers
 * - unbounded, active and disabled states
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/architecture.md
 *
 * @record
 */
class MDCRippleAdapter {
  /** @return {boolean} */
  browserSupportsCssVars() {}

  /** @return {boolean} */
  isUnbounded() {}

  /** @return {boolean} */
  isSurfaceActive() {}

  /** @return {boolean} */
  isSurfaceDisabled() {}

  /** @param {string} className */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  registerInteractionHandler(evtType, handler) {}

  /**
   * @param {string} evtType
   * @param {!Function} handler
   */
  deregisterInteractionHandler(evtType, handler) {}

  /**
   * @param {!Function} handler
   */
  registerResizeHandler(handler) {}

  /**
   * @param {!Function} handler
   */
  deregisterResizeHandler(handler) {}

  /**
   * @param {string} varName
   * @param {?number|string} value
   */
  updateCssVariable(varName, value) {}

  /** @return {!ClientRect} */
  computeBoundingRect() {}

  /** @return {{x: number, y: number}} */
  getWindowPageOffset() {}
}

/* unused harmony default export */ var _unused_webpack_default_export = (MDCRippleAdapter);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cssClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return strings; });
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @enum {string} */
const strings = {
  ARIA_CONTROLS: 'aria-controls',
  INPUT_SELECTOR: '.mdc-text-field__input',
  LABEL_SELECTOR: '.mdc-text-field__label',
  ICON_SELECTOR: '.mdc-text-field__icon',
  ICON_EVENT: 'MDCTextField:icon',
  BOTTOM_LINE_SELECTOR: '.mdc-text-field__bottom-line',
};

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-text-field',
  UPGRADED: 'mdc-text-field--upgraded',
  DISABLED: 'mdc-text-field--disabled',
  FOCUSED: 'mdc-text-field--focused',
  INVALID: 'mdc-text-field--invalid',
  LABEL_FLOAT_ABOVE: 'mdc-text-field__label--float-above',
  LABEL_SHAKE: 'mdc-text-field__label--shake',
  BOX: 'mdc-text-field--box',
  TEXT_FIELD_ICON: 'mdc-text-field__icon',
  TEXTAREA: 'mdc-text-field--textarea',
};




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MDCTextFieldAdapter */
/* unused harmony export NativeInputType */
/* unused harmony export FoundationMapType */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bottom_line_foundation__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper_text_foundation__ = __webpack_require__(6);
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-unused-vars */



/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * @typedef {{
 *   value: string,
 *   disabled: boolean,
 *   badInput: boolean,
 *   checkValidity: (function(): boolean)
 * }}
 */
let NativeInputType;

/**
 * @typedef {{
 *   bottomLine: (!MDCTextFieldBottomLineFoundation|undefined),
 *   helperText: (!MDCTextFieldHelperTextFoundation|undefined)
 * }}
 */
let FoundationMapType;

/**
 * Adapter for MDC Text Field.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the Text Field into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTextFieldAdapter {
  /**
   * Adds a class to the root Element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root Element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Adds a class to the label Element. We recommend you add a conditional
   * check here, and in removeClassFromLabel for whether or not the label is
   * present so that the JS component could be used with text fields that don't
   * require a label, such as the full-width text field.
   * @param {string} className
   */
  addClassToLabel(className) {}

  /**
   * Removes a class from the label Element.
   * @param {string} className
   */
  removeClassFromLabel(className) {}

  /**
   * Sets an attribute on the icon Element.
   * @param {string} name
   * @param {string} value
   */
  setIconAttr(name, value) {}

  /**
   * Returns true if classname exists for a given target element.
   * @param {?EventTarget} target
   * @param {string} className
   * @return {boolean}
   */
  eventTargetHasClass(target, className) {}

  /**
   * Registers an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerTextFieldInteractionHandler(type, handler) {}

  /**
   * Deregisters an event handler on the root element for a given event.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterTextFieldInteractionHandler(type, handler) {}

  /**
   * Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon.
   */
  notifyIconAction() {}

  /**
   * Registers an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerInputInteractionHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the native input element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterInputInteractionHandler(evtType, handler) {}

  /**
   * Registers an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerBottomLineEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterBottomLineEventHandler(evtType, handler) {}

  /**
   * Returns an object representing the native text input element, with a
   * similar API shape. The object returned should include the value, disabled
   * and badInput properties, as well as the checkValidity() function. We never
   * alter the value within our code, however we do update the disabled
   * property, so if you choose to duck-type the return value for this method
   * in your implementation it's important to keep this in mind. Also note that
   * this method can return null, which the foundation will handle gracefully.
   * @return {?Element|?NativeInputType}
   */
  getNativeInput() {}
}




/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC TextField Bottom Line.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the TextField bottom line into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTextFieldBottomLineAdapter {
  /**
   * Adds a class to the bottom line element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the bottom line element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Sets an attribute with a given value on the bottom line element.
   * @param {string} attr
   * @param {string} value
   */
  setAttr(attr, value) {}

  /**
   * Registers an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  registerEventHandler(evtType, handler) {}

  /**
   * Deregisters an event listener on the bottom line element for a given event.
   * @param {string} evtType
   * @param {function(!Event): undefined} handler
   */
  deregisterEventHandler(evtType, handler) {}

  /**
   * Emits a custom event "MDCTextFieldBottomLine:animation-end" denoting the
   * bottom line has finished its animation; either the activate or
   * deactivate animation
   */
  notifyAnimationEnd() {}
}

/* unused harmony default export */ var _unused_webpack_default_export = (MDCTextFieldBottomLineAdapter);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Text Field Helper Text.
 *
 * Defines the shape of the adapter expected by the foundation. Implement this
 * adapter to integrate the TextField helper text into your framework. See
 * https://github.com/material-components/material-components-web/blob/master/docs/authoring-components.md
 * for more information.
 *
 * @record
 */
class MDCTextFieldHelperTextAdapter {
  /**
   * Adds a class to the helper text element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the helper text element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Returns whether or not the helper text element contains the given class.
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /**
   * Sets an attribute with a given value on the helper text element.
   * @param {string} attr
   * @param {string} value
   */
  setAttr(attr, value) {}

  /**
   * Removes an attribute from the helper text element.
   * @param {string} attr
   */
  removeAttr(attr) {}

  /**
   * Sets the text content for the helper text element.
   * @param {string} content
   */
  setContent(content) {}
}

/* unused harmony default export */ var _unused_webpack_default_export = (MDCTextFieldHelperTextAdapter);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__foundation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__foundation__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__component__["a"]; });
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */







/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Application__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__material_card_dist_mdc_card_min_css__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__material_card_dist_mdc_card_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__material_card_dist_mdc_card_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_fab_dist_mdc_fab_min_css__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_fab_dist_mdc_fab_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__material_fab_dist_mdc_fab_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_ripple_dist_mdc_ripple_min_css__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_ripple_dist_mdc_ripple_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__material_ripple_dist_mdc_ripple_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_snackbar_dist_mdc_snackbar_min_css__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_snackbar_dist_mdc_snackbar_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__material_snackbar_dist_mdc_snackbar_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_switch_dist_mdc_switch_min_css__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_switch_dist_mdc_switch_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__material_switch_dist_mdc_switch_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__material_textfield_dist_mdc_textfield_min_css__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__material_textfield_dist_mdc_textfield_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__material_textfield_dist_mdc_textfield_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__style_css__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__style_css__);


// CSS








window.addEventListener("load", () => {
    new __WEBPACK_IMPORTED_MODULE_0__Application__["a" /* default */]();
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_textfield__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__material_snackbar__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_ripple__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CanvasState__ = __webpack_require__(28);





class Application {
    /**
     * Создаёт новое приложение
     */
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.canvasState = new __WEBPACK_IMPORTED_MODULE_3__CanvasState__["a" /* default */](this.canvas);

        // Инициализируем поля ввода MDC
        this.inputFields = Array.from(document.querySelectorAll(".mdc-text-field"));
        this.inputFields.forEach((inputField) => {
            new __WEBPACK_IMPORTED_MODULE_0__material_textfield__["a" /* MDCTextField */](inputField);
        });

        // Инициализируем обычные поля ввода
        this.lengthEl = document.querySelector("#length");
        this.decelerationEl = document.querySelector("#deceleration");

        // Заполняем поля в зависимости от стандартных значений маятника
        this.lengthEl.value = this.canvasState.defaultPendulumOptions.length;
        this.decelerationEl.value = this.canvasState.defaultPendulumOptions.deceleration;

        // Инициализируем Snackbar
        this.snackbar = new __WEBPACK_IMPORTED_MODULE_1__material_snackbar__["a" /* MDCSnackbar */](document.querySelector(".mdc-snackbar"));

        // Инициализируем FAB
        this.fab = document.querySelector(".mdc-fab");
        __WEBPACK_IMPORTED_MODULE_2__material_ripple__["a" /* MDCRipple */].attachTo(this.fab);

        // Инициализируем переключатель
        this.toggleEl = document.querySelector("#switch");

        // Устанавливаем положение переключателя в зависимости от стандартных значений маятника
        this.toggleEl.checked = this.canvasState.defaultPendulumOptions.run;

        // Обрабатываем случай, если маятник был запущен при запуске приложения
        this.handleToggleChange();

        // Регистрируем обработчики событий для элементов управления
        this.lengthEl.addEventListener("change", () => {
            if (this.lengthEl.checkValidity()) {
                this.canvasState.updatePendulumData(null, parseFloat(this.lengthEl.value), null);
            }
        });

        this.decelerationEl.addEventListener("change", () => {
            if (this.decelerationEl.checkValidity()) {
                this.canvasState.updatePendulumData(null, null, parseFloat(this.decelerationEl.value));
            }
        });

        this.toggleEl.addEventListener("change", () => this.handleToggleChange());

        this.fab.addEventListener("click", () => this.handleFabClick());
    }

    /**
     * Обрабатывает изменение положения переключателя
     */
    handleToggleChange() {
        this.canvasState.pendulum.run = this.toggleEl.checked;
        this.canvasState.valid = false;

        // Блокируем или разблокируем каждое поле ввода, в зависимости от положения переключателя
        this.inputFields.forEach((inputField => {
            if (this.toggleEl.checked) {
                this.lengthEl.disabled = true;
                this.decelerationEl.disabled = true;

                inputField.classList.add("mdc-text-field--disabled");
            }
            else {
                this.lengthEl.disabled = false;
                this.decelerationEl.disabled = false;

                inputField.classList.remove("mdc-text-field--disabled");
            }
        }));
    }

    /**
     * Обрабатывает нажатие плавающей кнопки
     */
    handleFabClick() {
        const foundation = this.snackbar.foundation_;

        const canvasClickHandler = (event) => {
            let x, y;

            if (event.type === "click") {
                x = event.pageX;
                y = event.pageY;
            }
            else {
                const firstTouch = event.changedTouches[0];

                x = firstTouch.pageX;
                y = firstTouch.pageY;
            }

            this.canvasState.addLimiter(x, y);

            this.canvas.removeEventListener("click", canvasClickHandler);
            this.canvas.removeEventListener("touchstart", canvasClickHandler);

            foundation.cleanup_();
        };

        const dataObj = {
            message: "Нажмите в том месте страницы, где хотите разместить ограничитель",
            actionText: "Отмена",
            multiline: true,
            actionHandler: () => {
                this.canvas.removeEventListener("click", canvasClickHandler);
                this.canvas.removeEventListener("touchstart", canvasClickHandler);
            }
        };

        if (!foundation.active_) {
            this.snackbar.show(dataObj);
            this.canvas.addEventListener("click", canvasClickHandler);
            this.canvas.addEventListener("touchstart", canvasClickHandler);
        }

        // Очищаем timeout, чтобы Snackbar не закрылся автоматически
        clearTimeout(foundation.timeoutId_);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Application);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MDCTextField; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__material_ripple__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_ripple_util__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__adapter__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__foundation__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bottom_line__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helper_text__ = __webpack_require__(23);
/* unused harmony reexport MDCTextFieldFoundation */
/* unused harmony reexport MDCTextFieldBottomLine */
/* unused harmony reexport MDCTextFieldBottomLineFoundation */
/* unused harmony reexport MDCTextFieldHelperText */
/* unused harmony reexport MDCTextFieldHelperTextFoundation */
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */









/* eslint-disable no-unused-vars */


/* eslint-enable no-unused-vars */

/**
 * @extends {MDCComponent<!MDCTextFieldFoundation>}
 * @final
 */
class MDCTextField extends __WEBPACK_IMPORTED_MODULE_0__material_base_component__["a" /* default */] {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.input_;
    /** @private {?Element} */
    this.label_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCTextFieldBottomLine} */
    this.bottomLine_;
    /** @private {?MDCTextFieldHelperText} */
    this.helperText_;
    /** @private {?Element} */
    this.icon_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTextField}
   */
  static attachTo(root) {
    return new MDCTextField(root);
  }

  /**
   * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which
   * creates a new MDCRipple.
   * @param {(function(!Element): !MDCTextFieldBottomLine)=} bottomLineFactory A function which
   * creates a new MDCTextFieldBottomLine.
   */
  initialize(
    rippleFactory = (el, foundation) => new __WEBPACK_IMPORTED_MODULE_1__material_ripple__["a" /* MDCRipple */](el, foundation),
    bottomLineFactory = (el) => new __WEBPACK_IMPORTED_MODULE_6__bottom_line__["a" /* MDCTextFieldBottomLine */](el)) {
    this.input_ = this.root_.querySelector(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].INPUT_SELECTOR);
    this.label_ = this.root_.querySelector(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].LABEL_SELECTOR);
    this.ripple = null;
    if (this.root_.classList.contains(__WEBPACK_IMPORTED_MODULE_3__constants__["a" /* cssClasses */].BOX)) {
      const MATCHES = Object(__WEBPACK_IMPORTED_MODULE_2__material_ripple_util__["b" /* getMatchesProperty */])(HTMLElement.prototype);
      const adapter = Object.assign(__WEBPACK_IMPORTED_MODULE_1__material_ripple__["a" /* MDCRipple */].createAdapter(this), {
        isSurfaceActive: () => this.input_[MATCHES](':active'),
        registerInteractionHandler: (type, handler) => this.input_.addEventListener(type, handler),
        deregisterInteractionHandler: (type, handler) => this.input_.removeEventListener(type, handler),
      });
      const foundation = new __WEBPACK_IMPORTED_MODULE_1__material_ripple__["b" /* MDCRippleFoundation */](adapter);
      this.ripple = rippleFactory(this.root_, foundation);
    };
    if (!this.root_.classList.contains(__WEBPACK_IMPORTED_MODULE_3__constants__["a" /* cssClasses */].TEXTAREA)) {
      const bottomLineElement = this.root_.querySelector(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].BOTTOM_LINE_SELECTOR);
      if (bottomLineElement) {
        this.bottomLine_ = bottomLineFactory(bottomLineElement);
      }
    };
    if (this.input_.hasAttribute(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].ARIA_CONTROLS)) {
      const helperTextElement = document.getElementById(this.input_.getAttribute(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].ARIA_CONTROLS));
      if (helperTextElement) {
        this.helperText_ = new __WEBPACK_IMPORTED_MODULE_7__helper_text__["a" /* MDCTextFieldHelperText */](helperTextElement);
      }
    }
    if (!this.root_.classList.contains(__WEBPACK_IMPORTED_MODULE_3__constants__["a" /* cssClasses */].TEXT_FIELD_ICON)) {
      this.icon_ = this.root_.querySelector(__WEBPACK_IMPORTED_MODULE_3__constants__["b" /* strings */].ICON_SELECTOR);
    };
  }

  destroy() {
    if (this.ripple) {
      this.ripple.destroy();
    }
    if (this.bottomLine_) {
      this.bottomLine_.destroy();
    }
    if (this.helperText_) {
      this.helperText_.destroy();
    }
    super.destroy();
  }

  /**
   * Initiliazes the Text Field's internal state based on the environment's
   * state.
   */
  initialSyncWithDom() {
    this.disabled = this.input_.disabled;
  }

  /**
   * @return {boolean} True if the Text Field is disabled.
   */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /**
   * @param {boolean} disabled Sets the Text Field disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /**
   * @param {boolean} valid Sets the Text Field valid or invalid.
   */
  set valid(valid) {
    this.foundation_.setValid(valid);
  }

  /**
   * Sets the helper text element content.
   * @param {string} content
   */
  set helperTextContent(content) {
    this.foundation_.setHelperTextContent(content);
  }

  /**
   * @return {!MDCTextFieldFoundation}
   */
  getDefaultFoundation() {
    return new __WEBPACK_IMPORTED_MODULE_5__foundation__["a" /* default */](
      /** @type {!MDCTextFieldAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        addClassToLabel: (className) => {
          const label = this.label_;
          if (label) {
            label.classList.add(className);
          }
        },
        removeClassFromLabel: (className) => {
          const label = this.label_;
          if (label) {
            label.classList.remove(className);
          }
        },
        eventTargetHasClass: (target, className) => target.classList.contains(className),
        registerTextFieldInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
        deregisterTextFieldInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
        notifyIconAction: () => this.emit(__WEBPACK_IMPORTED_MODULE_5__foundation__["a" /* default */].strings.ICON_EVENT, {}),
        registerBottomLineEventHandler: (evtType, handler) => {
          if (this.bottomLine_) {
            this.bottomLine_.listen(evtType, handler);
          }
        },
        deregisterBottomLineEventHandler: (evtType, handler) => {
          if (this.bottomLine_) {
            this.bottomLine_.unlisten(evtType, handler);
          }
        },
      },
      this.getInputAdapterMethods_(),
      this.getIconAdapterMethods_())),
      this.getFoundationMap_());
  }

  /**
   * @return {!{
   *   setIconAttr: function(string, string): undefined,
   * }}
   */
  getIconAdapterMethods_() {
    return {
      setIconAttr: (name, value) => {
        if (this.icon_) {
          this.icon_.setAttribute(name, value);
        }
      },
    };
  }

  /**
   * @return {!{
   *   registerInputInteractionHandler: function(string, function()): undefined,
   *   deregisterInputInteractionHandler: function(string, function()): undefined,
   *   getNativeInput: function(): ?Element,
   * }}
   */
  getInputAdapterMethods_() {
    return {
      registerInputInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_.removeEventListener(evtType, handler),
      getNativeInput: () => this.input_,
    };
  }

  /**
   * Returns a map of all subcomponents to subfoundations.
   * @return {!FoundationMapType}
   */
  getFoundationMap_() {
    return {
      bottomLine: this.bottomLine_ ? this.bottomLine_.foundation : undefined,
      helperText: this.helperText_ ? this.helperText_.foundation : undefined,
    };
  }
}




/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(4);
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @typedef {!{
 *   isActivated: (boolean|undefined),
 *   hasDeactivationUXRun: (boolean|undefined),
 *   wasActivatedByPointer: (boolean|undefined),
 *   wasElementMadeActive: (boolean|undefined),
 *   activationStartTime: (number|undefined),
 *   activationEvent: Event,
 *   isProgrammatic: (boolean|undefined)
 * }}
 */
let ActivationStateType;

/**
 * @typedef {!{
 *   activate: (string|undefined),
 *   deactivate: (string|undefined),
 *   focus: (string|undefined),
 *   blur: (string|undefined)
 * }}
 */
let ListenerInfoType;

/**
 * @typedef {!{
 *   activate: function(!Event),
 *   deactivate: function(!Event),
 *   focus: function(),
 *   blur: function()
 * }}
 */
let ListenersType;

/**
 * @typedef {!{
 *   x: number,
 *   y: number
 * }}
 */
let PointType;

/**
 * @enum {string}
 */
const DEACTIVATION_ACTIVATION_PAIRS = {
  mouseup: 'mousedown',
  pointerup: 'pointerdown',
  touchend: 'touchstart',
  keyup: 'keydown',
  blur: 'focus',
};

/**
 * @extends {MDCFoundation<!MDCRippleAdapter>}
 */
class MDCRippleFoundation extends __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__["a" /* default */] {
  static get cssClasses() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* cssClasses */];
  }

  static get strings() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["c" /* strings */];
  }

  static get numbers() {
    return __WEBPACK_IMPORTED_MODULE_2__constants__["b" /* numbers */];
  }

  static get defaultAdapter() {
    return {
      browserSupportsCssVars: () => /* boolean - cached */ {},
      isUnbounded: () => /* boolean */ {},
      isSurfaceActive: () => /* boolean */ {},
      isSurfaceDisabled: () => /* boolean */ {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      updateCssVariable: (/* varName: string, value: string */) => {},
      computeBoundingRect: () => /* ClientRect */ {},
      getWindowPageOffset: () => /* {x: number, y: number} */ {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCRippleFoundation.defaultAdapter, adapter));

    /** @private {number} */
    this.layoutFrame_ = 0;

    /** @private {!ClientRect} */
    this.frame_ = /** @type {!ClientRect} */ ({width: 0, height: 0});

    /** @private {!ActivationStateType} */
    this.activationState_ = this.defaultActivationState_();

    /** @private {number} */
    this.xfDuration_ = 0;

    /** @private {number} */
    this.initialSize_ = 0;

    /** @private {number} */
    this.maxRadius_ = 0;

    /** @private {!Array<{ListenerInfoType}>} */
    this.listenerInfos_ = [
      {activate: 'touchstart', deactivate: 'touchend'},
      {activate: 'pointerdown', deactivate: 'pointerup'},
      {activate: 'mousedown', deactivate: 'mouseup'},
      {activate: 'keydown', deactivate: 'keyup'},
      {focus: 'focus', blur: 'blur'},
    ];

    /** @private {!ListenersType} */
    this.listeners_ = {
      activate: (e) => this.activate_(e),
      deactivate: (e) => this.deactivate_(e),
      focus: () => requestAnimationFrame(
        () => this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)
      ),
      blur: () => requestAnimationFrame(
        () => this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)
      ),
    };

    /** @private {!Function} */
    this.resizeHandler_ = () => this.layout();

    /** @private {!{left: number, top:number}} */
    this.unboundedCoords_ = {
      left: 0,
      top: 0,
    };

    /** @private {number} */
    this.fgScale_ = 0;

    /** @private {number} */
    this.activationTimer_ = 0;

    /** @private {number} */
    this.fgDeactivationRemovalTimer_ = 0;

    /** @private {boolean} */
    this.activationAnimationHasEnded_ = false;

    /** @private {!Function} */
    this.activationTimerCallback_ = () => {
      this.activationAnimationHasEnded_ = true;
      this.runDeactivationUXLogicIfReady_();
    };
  }

  /**
   * We compute this property so that we are not querying information about the client
   * until the point in time where the foundation requests it. This prevents scenarios where
   * client-side feature-detection may happen too early, such as when components are rendered on the server
   * and then initialized at mount time on the client.
   * @return {boolean}
   * @private
   */
  isSupported_() {
    return this.adapter_.browserSupportsCssVars();
  }

  /**
   * @return {!ActivationStateType}
   */
  defaultActivationState_() {
    return {
      isActivated: false,
      hasDeactivationUXRun: false,
      wasActivatedByPointer: false,
      wasElementMadeActive: false,
      activationStartTime: 0,
      activationEvent: null,
      isProgrammatic: false,
    };
  }

  init() {
    if (!this.isSupported_()) {
      return;
    }
    this.addEventListeners_();

    const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.addClass(ROOT);
      if (this.adapter_.isUnbounded()) {
        this.adapter_.addClass(UNBOUNDED);
      }
      this.layoutInternal_();
    });
  }

  /** @private */
  addEventListeners_() {
    this.listenerInfos_.forEach((info) => {
      Object.keys(info).forEach((k) => {
        this.adapter_.registerInteractionHandler(info[k], this.listeners_[k]);
      });
    });
    this.adapter_.registerResizeHandler(this.resizeHandler_);
  }

  /**
   * @param {Event} e
   * @private
   */
  activate_(e) {
    if (this.adapter_.isSurfaceDisabled()) {
      return;
    }

    const {activationState_: activationState} = this;
    if (activationState.isActivated) {
      return;
    }

    activationState.isActivated = true;
    activationState.isProgrammatic = e === null;
    activationState.activationEvent = e;
    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : (
      e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown'
    );
    activationState.activationStartTime = Date.now();

    requestAnimationFrame(() => {
      // This needs to be wrapped in an rAF call b/c web browsers
      // report active states inconsistently when they're called within
      // event handling code:
      // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
      // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
      activationState.wasElementMadeActive = (e && e.type === 'keydown') ? this.adapter_.isSurfaceActive() : true;
      if (activationState.wasElementMadeActive) {
        this.animateActivation_();
      } else {
        // Reset activation state immediately if element was not made active.
        this.activationState_ = this.defaultActivationState_();
      }
    });
  }

  /**
   * @param {?Event=} event Optional event containing position information.
   */
  activate(event = null) {
    this.activate_(event);
  }

  /** @private */
  animateActivation_() {
    const {VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END} = MDCRippleFoundation.strings;
    const {
      BG_ACTIVE_FILL,
      FG_DEACTIVATION,
      FG_ACTIVATION,
    } = MDCRippleFoundation.cssClasses;
    const {DEACTIVATION_TIMEOUT_MS} = MDCRippleFoundation.numbers;

    let translateStart = '';
    let translateEnd = '';

    if (!this.adapter_.isUnbounded()) {
      const {startPoint, endPoint} = this.getFgTranslationCoordinates_();
      translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    }

    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
    // Cancel any ongoing activation/deactivation animations
    clearTimeout(this.activationTimer_);
    clearTimeout(this.fgDeactivationRemovalTimer_);
    this.rmBoundedActivationClasses_();
    this.adapter_.removeClass(FG_DEACTIVATION);

    // Force layout in order to re-trigger the animation.
    this.adapter_.computeBoundingRect();
    this.adapter_.addClass(BG_ACTIVE_FILL);
    this.adapter_.addClass(FG_ACTIVATION);
    this.activationTimer_ = setTimeout(() => this.activationTimerCallback_(), DEACTIVATION_TIMEOUT_MS);
  }

  /**
   * @private
   * @return {{startPoint: PointType, endPoint: PointType}}
   */
  getFgTranslationCoordinates_() {
    const {activationState_: activationState} = this;
    const {activationEvent, wasActivatedByPointer} = activationState;

    let startPoint;
    if (wasActivatedByPointer) {
      startPoint = Object(__WEBPACK_IMPORTED_MODULE_3__util__["c" /* getNormalizedEventCoords */])(
        /** @type {!Event} */ (activationEvent),
        this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect()
      );
    } else {
      startPoint = {
        x: this.frame_.width / 2,
        y: this.frame_.height / 2,
      };
    }
    // Center the element around the start point.
    startPoint = {
      x: startPoint.x - (this.initialSize_ / 2),
      y: startPoint.y - (this.initialSize_ / 2),
    };

    const endPoint = {
      x: (this.frame_.width / 2) - (this.initialSize_ / 2),
      y: (this.frame_.height / 2) - (this.initialSize_ / 2),
    };

    return {startPoint, endPoint};
  }

  /** @private */
  runDeactivationUXLogicIfReady_() {
    const {FG_DEACTIVATION} = MDCRippleFoundation.cssClasses;
    const {hasDeactivationUXRun, isActivated} = this.activationState_;
    const activationHasEnded = hasDeactivationUXRun || !isActivated;
    if (activationHasEnded && this.activationAnimationHasEnded_) {
      this.rmBoundedActivationClasses_();
      this.adapter_.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer_ = setTimeout(() => {
        this.adapter_.removeClass(FG_DEACTIVATION);
      }, __WEBPACK_IMPORTED_MODULE_2__constants__["b" /* numbers */].FG_DEACTIVATION_MS);
    }
  }

  /** @private */
  rmBoundedActivationClasses_() {
    const {BG_ACTIVE_FILL, FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    this.adapter_.removeClass(BG_ACTIVE_FILL);
    this.adapter_.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded_ = false;
    this.adapter_.computeBoundingRect();
  }

  /**
   * @param {Event} e
   * @private
   */
  deactivate_(e) {
    const {activationState_: activationState} = this;
    // This can happen in scenarios such as when you have a keyup event that blurs the element.
    if (!activationState.isActivated) {
      return;
    }
    // Programmatic deactivation.
    if (activationState.isProgrammatic) {
      const evtObject = null;
      const state = /** @type {!ActivationStateType} */ (Object.assign({}, activationState));
      requestAnimationFrame(() => this.animateDeactivation_(evtObject, state));
      this.activationState_ = this.defaultActivationState_();
      return;
    }

    const actualActivationType = DEACTIVATION_ACTIVATION_PAIRS[e.type];
    const expectedActivationType = activationState.activationEvent.type;
    // NOTE: Pointer events are tricky - https://patrickhlauke.github.io/touch/tests/results/
    // Essentially, what we need to do here is decouple the deactivation UX from the actual
    // deactivation state itself. This way, touch/pointer events in sequence do not trample one
    // another.
    const needsDeactivationUX = actualActivationType === expectedActivationType;
    let needsActualDeactivation = needsDeactivationUX;
    if (activationState.wasActivatedByPointer) {
      needsActualDeactivation = e.type === 'mouseup';
    }

    const state = /** @type {!ActivationStateType} */ (Object.assign({}, activationState));
    requestAnimationFrame(() => {
      if (needsDeactivationUX) {
        this.activationState_.hasDeactivationUXRun = true;
        this.animateDeactivation_(e, state);
      }

      if (needsActualDeactivation) {
        this.activationState_ = this.defaultActivationState_();
      }
    });
  }

  /**
   * @param {?Event=} event Optional event containing position information.
   */
  deactivate(event = null) {
    this.deactivate_(event);
  }

  /**
   * @param {Event} e
   * @param {!ActivationStateType} options
   * @private
   */
  animateDeactivation_(e, {wasActivatedByPointer, wasElementMadeActive}) {
    const {BG_FOCUSED} = MDCRippleFoundation.cssClasses;
    if (wasActivatedByPointer || wasElementMadeActive) {
      // Remove class left over by element being focused
      this.adapter_.removeClass(BG_FOCUSED);
      this.runDeactivationUXLogicIfReady_();
    }
  }

  destroy() {
    if (!this.isSupported_()) {
      return;
    }
    this.removeEventListeners_();

    const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.removeClass(ROOT);
      this.adapter_.removeClass(UNBOUNDED);
      this.removeCssVars_();
    });
  }

  /** @private */
  removeEventListeners_() {
    this.listenerInfos_.forEach((info) => {
      Object.keys(info).forEach((k) => {
        this.adapter_.deregisterInteractionHandler(info[k], this.listeners_[k]);
      });
    });
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
  }

  /** @private */
  removeCssVars_() {
    const {strings} = MDCRippleFoundation;
    Object.keys(strings).forEach((k) => {
      if (k.indexOf('VAR_') === 0) {
        this.adapter_.updateCssVariable(strings[k], null);
      }
    });
  }

  layout() {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }
    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  }

  /** @private */
  layoutInternal_() {
    this.frame_ = this.adapter_.computeBoundingRect();

    const maxDim = Math.max(this.frame_.height, this.frame_.width);
    const surfaceDiameter = Math.sqrt(Math.pow(this.frame_.width, 2) + Math.pow(this.frame_.height, 2));

    // 60% of the largest dimension of the surface
    this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;

    // Diameter of the surface + 10px
    this.maxRadius_ = surfaceDiameter + MDCRippleFoundation.numbers.PADDING;
    this.fgScale_ = this.maxRadius_ / this.initialSize_;
    this.xfDuration_ = 1000 * Math.sqrt(this.maxRadius_ / 1024);
    this.updateLayoutCssVars_();
  }

  /** @private */
  updateLayoutCssVars_() {
    const {
      VAR_FG_SIZE, VAR_LEFT, VAR_TOP, VAR_FG_SCALE,
    } = MDCRippleFoundation.strings;

    this.adapter_.updateCssVariable(VAR_FG_SIZE, `${this.initialSize_}px`);
    this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);

    if (this.adapter_.isUnbounded()) {
      this.unboundedCoords_ = {
        left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
        top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
      };

      this.adapter_.updateCssVariable(VAR_LEFT, `${this.unboundedCoords_.left}px`);
      this.adapter_.updateCssVariable(VAR_TOP, `${this.unboundedCoords_.top}px`);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCRippleFoundation);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cssClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return strings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return numbers; });
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cssClasses = {
  // Ripple is a special case where the "root" component is really a "mixin" of sorts,
  // given that it's an 'upgrade' to an existing component. That being said it is the root
  // CSS class that all other CSS classes derive from.
  ROOT: 'mdc-ripple-upgraded',
  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
  BG_ACTIVE_FILL: 'mdc-ripple-upgraded--background-active-fill',
  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
};

const strings = {
  VAR_FG_SIZE: '--mdc-ripple-fg-size',
  VAR_LEFT: '--mdc-ripple-left',
  VAR_TOP: '--mdc-ripple-top',
  VAR_FG_SCALE: '--mdc-ripple-fg-scale',
  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
};

const numbers = {
  PADDING: 10,
  INITIAL_ORIGIN_SCALE: 0.6,
  DEACTIVATION_TIMEOUT_MS: 225, // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)
  FG_DEACTIVATION_MS: 150, // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)
};




/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return strings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cssClasses; });
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @enum {string} */
const strings = {
  ANIMATION_END_EVENT: 'MDCTextFieldBottomLine:animation-end',
};

/** @enum {string} */
const cssClasses = {
  BOTTOM_LINE_ACTIVE: 'mdc-text-field__bottom-line--active',
};




/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return strings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cssClasses; });
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @enum {string} */
const strings = {
  ARIA_HIDDEN: 'aria-hidden',
  ROLE: 'role',
};

/** @enum {string} */
const cssClasses = {
  HELPER_TEXT_PERSISTENT: 'mdc-text-field-helper-text--persistent',
  HELPER_TEXT_VALIDATION_MSG: 'mdc-text-field-helper-text--validation-msg',
};




/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bottom_line_foundation__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helper_text_foundation__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__constants__ = __webpack_require__(9);
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




// eslint-disable-next-line no-unused-vars




/**
 * @extends {MDCFoundation<!MDCTextFieldAdapter>}
 * @final
 */
class MDCTextFieldFoundation extends __WEBPACK_IMPORTED_MODULE_0__material_base_foundation__["a" /* default */] {
  /** @return enum {string} */
  static get cssClasses() {
    return __WEBPACK_IMPORTED_MODULE_4__constants__["a" /* cssClasses */];
  }

  /** @return enum {string} */
  static get strings() {
    return __WEBPACK_IMPORTED_MODULE_4__constants__["b" /* strings */];
  }

  /**
   * {@see MDCTextFieldAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      addClassToLabel: () => {},
      removeClassFromLabel: () => {},
      setIconAttr: () => {},
      eventTargetHasClass: () => {},
      registerTextFieldInteractionHandler: () => {},
      deregisterTextFieldInteractionHandler: () => {},
      notifyIconAction: () => {},
      registerInputInteractionHandler: () => {},
      deregisterInputInteractionHandler: () => {},
      registerBottomLineEventHandler: () => {},
      deregisterBottomLineEventHandler: () => {},
      getNativeInput: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldAdapter=} adapter
   * @param {!FoundationMapType=} foundationMap Map from subcomponent names to their subfoundations.
   */
  constructor(adapter = /** @type {!MDCTextFieldAdapter} */ ({}),
    foundationMap = /** @type {!FoundationMapType} */ ({})) {
    super(Object.assign(MDCTextFieldFoundation.defaultAdapter, adapter));

    /** @type {!MDCTextFieldBottomLineFoundation|undefined} */
    this.bottomLine_ = foundationMap.bottomLine;
    /** @type {!MDCTextFieldHelperTextFoundation|undefined} */
    this.helperText_ = foundationMap.helperText;

    /** @private {boolean} */
    this.isFocused_ = false;
    /** @private {boolean} */
    this.receivedUserInput_ = false;
    /** @private {boolean} */
    this.useCustomValidityChecking_ = false;
    /** @private {function(): undefined} */
    this.inputFocusHandler_ = () => this.activateFocus();
    /** @private {function(): undefined} */
    this.inputBlurHandler_ = () => this.deactivateFocus();
    /** @private {function(): undefined} */
    this.inputInputHandler_ = () => this.autoCompleteFocus();
    /** @private {function(!Event): undefined} */
    this.setPointerXOffset_ = (evt) => this.setBottomLineTransformOrigin(evt);
    /** @private {function(!Event): undefined} */
    this.textFieldInteractionHandler_ = (evt) => this.handleTextFieldInteraction(evt);
    /** @private {function(!Event): undefined} */
    this.bottomLineAnimationEndHandler_ = () => this.handleBottomLineAnimationEnd();
  }

  init() {
    this.adapter_.addClass(MDCTextFieldFoundation.cssClasses.UPGRADED);
    // Ensure label does not collide with any pre-filled value.
    if (this.getNativeInput_().value) {
      this.adapter_.addClassToLabel(MDCTextFieldFoundation.cssClasses.LABEL_FLOAT_ABOVE);
    }

    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.registerInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler_);
    });
    this.adapter_.registerBottomLineEventHandler(
      __WEBPACK_IMPORTED_MODULE_2__bottom_line_foundation__["a" /* default */].strings.ANIMATION_END_EVENT, this.bottomLineAnimationEndHandler_);
  }

  destroy() {
    this.adapter_.removeClass(MDCTextFieldFoundation.cssClasses.UPGRADED);
    this.adapter_.deregisterInputInteractionHandler('focus', this.inputFocusHandler_);
    this.adapter_.deregisterInputInteractionHandler('blur', this.inputBlurHandler_);
    this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);
    ['mousedown', 'touchstart'].forEach((evtType) => {
      this.adapter_.deregisterInputInteractionHandler(evtType, this.setPointerXOffset_);
    });
    ['click', 'keydown'].forEach((evtType) => {
      this.adapter_.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler_);
    });
    this.adapter_.deregisterBottomLineEventHandler(
      __WEBPACK_IMPORTED_MODULE_2__bottom_line_foundation__["a" /* default */].strings.ANIMATION_END_EVENT, this.bottomLineAnimationEndHandler_);
  }

  /**
   * Handles all user interactions with the Text Field.
   * @param {!Event} evt
   */
  handleTextFieldInteraction(evt) {
    if (this.adapter_.getNativeInput().disabled) {
      return;
    }

    this.receivedUserInput_ = true;

    const {target, type} = evt;
    const {TEXT_FIELD_ICON} = MDCTextFieldFoundation.cssClasses;
    const targetIsIcon = this.adapter_.eventTargetHasClass(target, TEXT_FIELD_ICON);
    const eventTriggersNotification = type === 'click' || evt.key === 'Enter' || evt.keyCode === 13;

    if (targetIsIcon && eventTriggersNotification) {
      this.adapter_.notifyIconAction();
    }
  }

  /**
   * Activates the text field focus state.
   */
  activateFocus() {
    const {FOCUSED, LABEL_FLOAT_ABOVE, LABEL_SHAKE} = MDCTextFieldFoundation.cssClasses;
    this.adapter_.addClass(FOCUSED);
    if (this.bottomLine_) {
      this.bottomLine_.activate();
    }
    this.adapter_.addClassToLabel(LABEL_FLOAT_ABOVE);
    this.adapter_.removeClassFromLabel(LABEL_SHAKE);
    if (this.helperText_) {
      this.helperText_.showToScreenReader();
    }
    this.isFocused_ = true;
  }

  /**
   * Sets the bottom line's transform origin, so that the bottom line activate
   * animation will animate out from the user's click location.
   * @param {!Event} evt
   */
  setBottomLineTransformOrigin(evt) {
    if (this.bottomLine_) {
      this.bottomLine_.setTransformOrigin(evt);
    }
  }

  /**
   * Activates the Text Field's focus state in cases when the input value
   * changes without user input (e.g. programatically).
   */
  autoCompleteFocus() {
    if (!this.receivedUserInput_) {
      this.activateFocus();
    }
  }

  /**
   * Handles when bottom line animation ends, performing actions that must wait
   * for animations to finish.
   */
  handleBottomLineAnimationEnd() {
    // We need to wait for the bottom line to be entirely transparent
    // before removing the class. If we do not, we see the line start to
    // scale down before disappearing
    if (!this.isFocused_ && this.bottomLine_) {
      this.bottomLine_.deactivate();
    }
  }

  /**
   * Deactives the Text Field's focus state.
   */
  deactivateFocus() {
    const {FOCUSED, LABEL_FLOAT_ABOVE, LABEL_SHAKE} = MDCTextFieldFoundation.cssClasses;
    const input = this.getNativeInput_();

    this.isFocused_ = false;
    this.adapter_.removeClass(FOCUSED);
    this.adapter_.removeClassFromLabel(LABEL_SHAKE);

    if (!input.value && !this.isBadInput_()) {
      this.adapter_.removeClassFromLabel(LABEL_FLOAT_ABOVE);
      this.receivedUserInput_ = false;
    }

    if (!this.useCustomValidityChecking_) {
      this.changeValidity_(input.checkValidity());
    }
  }

  /**
   * Updates the Text Field's valid state based on the supplied validity.
   * @param {boolean} isValid
   * @private
   */
  changeValidity_(isValid) {
    const {INVALID, LABEL_SHAKE} = MDCTextFieldFoundation.cssClasses;
    if (isValid) {
      this.adapter_.removeClass(INVALID);
    } else {
      this.adapter_.addClassToLabel(LABEL_SHAKE);
      this.adapter_.addClass(INVALID);
    }
    if (this.helperText_) {
      this.helperText_.setValidity(isValid);
    }
  }

  /**
   * @return {boolean} True if the Text Field input fails validity checks.
   * @private
   */
  isBadInput_() {
    const input = this.getNativeInput_();
    return input.validity ? input.validity.badInput : input.badInput;
  }

  /**
   * @return {boolean} True if the Text Field is disabled.
   */
  isDisabled() {
    return this.getNativeInput_().disabled;
  }

  /**
   * @param {boolean} disabled Sets the text-field disabled or enabled.
   */
  setDisabled(disabled) {
    const {DISABLED, INVALID} = MDCTextFieldFoundation.cssClasses;
    this.getNativeInput_().disabled = disabled;
    if (disabled) {
      this.adapter_.addClass(DISABLED);
      this.adapter_.removeClass(INVALID);
      this.adapter_.setIconAttr('tabindex', '-1');
    } else {
      this.adapter_.removeClass(DISABLED);
      this.adapter_.setIconAttr('tabindex', '0');
    }
  }

  /**
   * @param {string} content Sets the content of the helper text.
   */
  setHelperTextContent(content) {
    if (this.helperText_) {
      this.helperText_.setContent(content);
    }
  }

  /**
   * @return {!Element|!NativeInputType} The native text input from the
   * host environment, or a dummy if none exists.
   * @private
   */
  getNativeInput_() {
    return this.adapter_.getNativeInput() ||
    /** @type {!NativeInputType} */ ({
      checkValidity: () => true,
      value: '',
      disabled: false,
      badInput: false,
    });
  }

  /**
   * @param {boolean} isValid Sets the validity state of the Text Field.
   */
  setValid(isValid) {
    this.useCustomValidityChecking_ = true;
    this.changeValidity_(isValid);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MDCTextFieldFoundation);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MDCTextFieldBottomLine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__foundation__ = __webpack_require__(5);
/* unused harmony reexport MDCTextFieldBottomLineFoundation */
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @extends {MDCComponent<!MDCTextFieldBottomLineFoundation>}
 * @final
 */
class MDCTextFieldBottomLine extends __WEBPACK_IMPORTED_MODULE_0__material_base_component__["a" /* default */] {
  /**
   * @param {!Element} root
   * @return {!MDCTextFieldBottomLine}
   */
  static attachTo(root) {
    return new MDCTextFieldBottomLine(root);
  }

  /**
   * @return {!MDCTextFieldBottomLineFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCTextFieldBottomLineFoundation}
   */
  getDefaultFoundation() {
    return new __WEBPACK_IMPORTED_MODULE_2__foundation__["a" /* default */](/** @type {!MDCTextFieldBottomLineAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      registerEventHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyAnimationEnd: () => {
        this.emit(__WEBPACK_IMPORTED_MODULE_2__foundation__["a" /* default */].strings.ANIMATION_END_EVENT, {});
      },
    })));
  }
}




/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MDCTextFieldHelperText; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapter__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__foundation__ = __webpack_require__(6);
/* unused harmony reexport MDCTextFieldHelperTextFoundation */
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */






/**
 * @extends {MDCComponent<!MDCTextFieldHelperTextFoundation>}
 * @final
 */
class MDCTextFieldHelperText extends __WEBPACK_IMPORTED_MODULE_0__material_base_component__["a" /* default */] {
  /**
   * @param {!Element} root
   * @return {!MDCTextFieldHelperText}
   */
  static attachTo(root) {
    return new MDCTextFieldHelperText(root);
  }

  /**
   * @return {!MDCTextFieldHelperTextFoundation}
   */
  get foundation() {
    return this.foundation_;
  }

  /**
   * @return {!MDCTextFieldHelperTextFoundation}
   */
  getDefaultFoundation() {
    return new __WEBPACK_IMPORTED_MODULE_2__foundation__["a" /* default */](/** @type {!MDCTextFieldHelperTextAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      hasClass: (className) => this.root_.classList.contains(className),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      removeAttr: (attr) => this.root_.removeAttribute(attr),
      setContent: (content) => {
        this.root_.textContent = content;
      },
    })));
  }
}




/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__foundation__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_animation__ = __webpack_require__(27);
/* unused harmony reexport MDCSnackbarFoundation */
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */







class MDCSnackbar extends __WEBPACK_IMPORTED_MODULE_0__material_base__["a" /* MDCComponent */] {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  show(data) {
    this.foundation_.show(data);
  }

  getDefaultFoundation() {
    const {
      TEXT_SELECTOR,
      ACTION_BUTTON_SELECTOR,
    } = __WEBPACK_IMPORTED_MODULE_1__foundation__["a" /* default */].strings;
    const getText = () => this.root_.querySelector(TEXT_SELECTOR);
    const getActionButton = () => this.root_.querySelector(ACTION_BUTTON_SELECTOR);

    /* eslint brace-style: "off" */
    return new __WEBPACK_IMPORTED_MODULE_1__foundation__["a" /* default */]({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      setAriaHidden: () => this.root_.setAttribute('aria-hidden', 'true'),
      unsetAriaHidden: () => this.root_.removeAttribute('aria-hidden'),
      setActionAriaHidden: () => getActionButton().setAttribute('aria-hidden', 'true'),
      unsetActionAriaHidden: () => getActionButton().removeAttribute('aria-hidden'),
      setActionText: (text) => { getActionButton().textContent = text; },
      setMessageText: (text) => { getText().textContent = text; },
      setFocus: () => getActionButton().focus(),
      visibilityIsHidden: () => document.hidden,
      registerCapturedBlurHandler: (handler) => getActionButton().addEventListener('blur', handler, true),
      deregisterCapturedBlurHandler: (handler) => getActionButton().removeEventListener('blur', handler, true),
      registerVisibilityChangeHandler: (handler) => document.addEventListener('visibilitychange', handler),
      deregisterVisibilityChangeHandler: (handler) => document.removeEventListener('visibilitychange', handler),
      registerCapturedInteractionHandler: (evt, handler) =>
        document.body.addEventListener(evt, handler, true),
      deregisterCapturedInteractionHandler: (evt, handler) =>
        document.body.removeEventListener(evt, handler, true),
      registerActionClickHandler: (handler) => getActionButton().addEventListener('click', handler),
      deregisterActionClickHandler: (handler) => getActionButton().removeEventListener('click', handler),
      registerTransitionEndHandler:
        (handler) => this.root_.addEventListener(Object(__WEBPACK_IMPORTED_MODULE_2__material_animation__["a" /* getCorrectEventName */])(window, 'transitionend'), handler),
      deregisterTransitionEndHandler:
        (handler) => this.root_.removeEventListener(Object(__WEBPACK_IMPORTED_MODULE_2__material_animation__["a" /* getCorrectEventName */])(window, 'transitionend'), handler),
    });
  }

  get dismissesOnAction() {
    return this.foundation_.dismissesOnAction();
  }

  set dismissesOnAction(dismissesOnAction) {
    this.foundation_.setDismissOnAction(dismissesOnAction);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MDCSnackbar;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_base__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(26);
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




class MDCSnackbarFoundation extends __WEBPACK_IMPORTED_MODULE_0__material_base__["b" /* MDCFoundation */] {
  static get cssClasses() {
    return __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* cssClasses */];
  }

  static get strings() {
    return __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* strings */];
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setAriaHidden: () => {},
      unsetAriaHidden: () => {},
      setActionAriaHidden: () => {},
      unsetActionAriaHidden: () => {},
      setActionText: (/* actionText: string */) => {},
      setMessageText: (/* message: string */) => {},
      setFocus: () => {},
      visibilityIsHidden: () => /* boolean */ false,
      registerCapturedBlurHandler: (/* handler: EventListener */) => {},
      deregisterCapturedBlurHandler: (/* handler: EventListener */) => {},
      registerVisibilityChangeHandler: (/* handler: EventListener */) => {},
      deregisterVisibilityChangeHandler: (/* handler: EventListener */) => {},
      registerCapturedInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterCapturedInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      registerActionClickHandler: (/* handler: EventListener */) => {},
      deregisterActionClickHandler: (/* handler: EventListener */) => {},
      registerTransitionEndHandler: (/* handler: EventListener */) => {},
      deregisterTransitionEndHandler: (/* handler: EventListener */) => {},
    };
  }

  get active() {
    return this.active_;
  }

  constructor(adapter) {
    super(Object.assign(MDCSnackbarFoundation.defaultAdapter, adapter));

    this.active_ = false;
    this.actionWasClicked_ = false;
    this.dismissOnAction_ = true;
    this.firstFocus_ = true;
    this.pointerDownRecognized_ = false;
    this.snackbarHasFocus_ = false;
    this.snackbarData_ = null;
    this.queue_ = [];
    this.actionClickHandler_ = () => {
      this.actionWasClicked_ = true;
      this.invokeAction_();
    };
    this.visibilitychangeHandler_ = () => {
      clearTimeout(this.timeoutId_);
      this.snackbarHasFocus_ = true;

      if (!this.adapter_.visibilityIsHidden()) {
        setTimeout(this.cleanup_.bind(this), this.snackbarData_.timeout || __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* numbers */].MESSAGE_TIMEOUT);
      }
    };
    this.interactionHandler_ = (evt) => {
      if (evt.type == 'touchstart' || evt.type == 'mousedown') {
        this.pointerDownRecognized_ = true;
      }
      this.handlePossibleTabKeyboardFocus_(evt);

      if (evt.type == 'focus') {
        this.pointerDownRecognized_ = false;
      }
    };
    this.blurHandler_ = () => {
      clearTimeout(this.timeoutId_);
      this.snackbarHasFocus_ = false;
      this.timeoutId_ = setTimeout(this.cleanup_.bind(this), this.snackbarData_.timeout || __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* numbers */].MESSAGE_TIMEOUT);
    };
  }

  init() {
    this.adapter_.registerActionClickHandler(this.actionClickHandler_);
    this.adapter_.setAriaHidden();
    this.adapter_.setActionAriaHidden();
  }

  destroy() {
    this.adapter_.deregisterActionClickHandler(this.actionClickHandler_);
    this.adapter_.deregisterCapturedBlurHandler(this.blurHandler_);
    this.adapter_.deregisterVisibilityChangeHandler(this.visibilitychangeHandler_);
    ['touchstart', 'mousedown', 'focus'].forEach((evtType) => {
      this.adapter_.deregisterCapturedInteractionHandler(evtType, this.interactionHandler_);
    });
  }

  dismissesOnAction() {
    return this.dismissOnAction_;
  }

  setDismissOnAction(dismissOnAction) {
    this.dismissOnAction_ = !!dismissOnAction;
  }

  show(data) {
    if (!data) {
      throw new Error(
        'Please provide a data object with at least a message to display.');
    }
    if (!data.message) {
      throw new Error('Please provide a message to be displayed.');
    }
    if (data.actionHandler && !data.actionText) {
      throw new Error('Please provide action text with the handler.');
    }
    if (this.active) {
      this.queue_.push(data);
      return;
    }
    clearTimeout(this.timeoutId_);
    this.snackbarData_ = data;
    this.firstFocus_ = true;
    this.adapter_.registerVisibilityChangeHandler(this.visibilitychangeHandler_);
    this.adapter_.registerCapturedBlurHandler(this.blurHandler_);
    ['touchstart', 'mousedown', 'focus'].forEach((evtType) => {
      this.adapter_.registerCapturedInteractionHandler(evtType, this.interactionHandler_);
    });

    const {ACTIVE, MULTILINE, ACTION_ON_BOTTOM} = __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* cssClasses */];

    this.adapter_.setMessageText(this.snackbarData_.message);

    if (this.snackbarData_.multiline) {
      this.adapter_.addClass(MULTILINE);
      if (this.snackbarData_.actionOnBottom) {
        this.adapter_.addClass(ACTION_ON_BOTTOM);
      }
    }

    if (this.snackbarData_.actionHandler) {
      this.adapter_.setActionText(this.snackbarData_.actionText);
      this.actionHandler_ = this.snackbarData_.actionHandler;
      this.setActionHidden_(false);
    } else {
      this.setActionHidden_(true);
      this.actionHandler_ = null;
      this.adapter_.setActionText(null);
    }

    this.active_ = true;
    this.adapter_.addClass(ACTIVE);
    this.adapter_.unsetAriaHidden();

    this.timeoutId_ = setTimeout(this.cleanup_.bind(this), this.snackbarData_.timeout || __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* numbers */].MESSAGE_TIMEOUT);
  }

  handlePossibleTabKeyboardFocus_() {
    const hijackFocus =
      this.firstFocus_ && !this.pointerDownRecognized_;

    if (hijackFocus) {
      this.setFocusOnAction_();
    }

    this.firstFocus_ = false;
  }

  setFocusOnAction_() {
    this.adapter_.setFocus();
    this.snackbarHasFocus_ = true;
    this.firstFocus_ = false;
  }

  invokeAction_() {
    try {
      if (!this.actionHandler_) {
        return;
      }

      this.actionHandler_();
    } finally {
      if (this.dismissOnAction_) {
        this.cleanup_();
      }
    }
  }

  cleanup_() {
    const allowDismissal = !this.snackbarHasFocus_ || this.actionWasClicked_;

    if (allowDismissal) {
      const {ACTIVE, MULTILINE, ACTION_ON_BOTTOM} = __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* cssClasses */];

      this.adapter_.removeClass(ACTIVE);

      const handler = () => {
        clearTimeout(this.timeoutId_);
        this.adapter_.deregisterTransitionEndHandler(handler);
        this.adapter_.removeClass(MULTILINE);
        this.adapter_.removeClass(ACTION_ON_BOTTOM);
        this.setActionHidden_(true);
        this.adapter_.setAriaHidden();
        this.active_ = false;
        this.snackbarHasFocus_ = false;
        this.showNext_();
      };

      this.adapter_.registerTransitionEndHandler(handler);
    }
  }

  showNext_() {
    if (!this.queue_.length) {
      return;
    }
    this.show(this.queue_.shift());
  }

  setActionHidden_(isHidden) {
    if (isHidden) {
      this.adapter_.setActionAriaHidden();
    } else {
      this.adapter_.unsetActionAriaHidden();
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MDCSnackbarFoundation;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cssClasses = {
  ROOT: 'mdc-snackbar',
  TEXT: 'mdc-snackbar__text',
  ACTION_WRAPPER: 'mdc-snackbar__action-wrapper',
  ACTION_BUTTON: 'mdc-snackbar__action-button',
  ACTIVE: 'mdc-snackbar--active',
  MULTILINE: 'mdc-snackbar--multiline',
  ACTION_ON_BOTTOM: 'mdc-snackbar--action-on-bottom',
};
/* harmony export (immutable) */ __webpack_exports__["a"] = cssClasses;


const strings = {
  TEXT_SELECTOR: '.mdc-snackbar__text',
  ACTION_WRAPPER_SELECTOR: '.mdc-snackbar__action-wrapper',
  ACTION_BUTTON_SELECTOR: '.mdc-snackbar__action-button',
};
/* harmony export (immutable) */ __webpack_exports__["c"] = strings;


const numbers = {
  MESSAGE_TIMEOUT: 2750,
};
/* harmony export (immutable) */ __webpack_exports__["b"] = numbers;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export transformStyleProperties */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getCorrectEventName; });
/* unused harmony export getCorrectPropertyName */
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @typedef {{
 *   noPrefix: string,
 *   webkitPrefix: string,
 *   styleProperty: string
 * }}
 */
let VendorPropertyMapType;

/** @const {Object<string, !VendorPropertyMapType>} */
const eventTypeMap = {
  'animationstart': {
    noPrefix: 'animationstart',
    webkitPrefix: 'webkitAnimationStart',
    styleProperty: 'animation',
  },
  'animationend': {
    noPrefix: 'animationend',
    webkitPrefix: 'webkitAnimationEnd',
    styleProperty: 'animation',
  },
  'animationiteration': {
    noPrefix: 'animationiteration',
    webkitPrefix: 'webkitAnimationIteration',
    styleProperty: 'animation',
  },
  'transitionend': {
    noPrefix: 'transitionend',
    webkitPrefix: 'webkitTransitionEnd',
    styleProperty: 'transition',
  },
};

/** @const {Object<string, !VendorPropertyMapType>} */
const cssPropertyMap = {
  'animation': {
    noPrefix: 'animation',
    webkitPrefix: '-webkit-animation',
  },
  'transform': {
    noPrefix: 'transform',
    webkitPrefix: '-webkit-transform',
  },
  'transition': {
    noPrefix: 'transition',
    webkitPrefix: '-webkit-transition',
  },
};

/**
 * @param {!Object} windowObj
 * @return {boolean}
 */
function hasProperShape(windowObj) {
  return (windowObj['document'] !== undefined && typeof windowObj['document']['createElement'] === 'function');
}

/**
 * @param {string} eventType
 * @return {boolean}
 */
function eventFoundInMaps(eventType) {
  return (eventType in eventTypeMap || eventType in cssPropertyMap);
}

/**
 * @param {string} eventType
 * @param {!Object<string, !VendorPropertyMapType>} map
 * @param {!Element} el
 * @return {string}
 */
function getJavaScriptEventName(eventType, map, el) {
  return map[eventType].styleProperty in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
}

/**
 * Helper function to determine browser prefix for CSS3 animation events
 * and property names.
 * @param {!Object} windowObj
 * @param {string} eventType
 * @return {string}
 */
function getAnimationName(windowObj, eventType) {
  if (!hasProperShape(windowObj) || !eventFoundInMaps(eventType)) {
    return eventType;
  }

  const map = /** @type {!Object<string, !VendorPropertyMapType>} */ (
    eventType in eventTypeMap ? eventTypeMap : cssPropertyMap
  );
  const el = windowObj['document']['createElement']('div');
  let eventName = '';

  if (map === eventTypeMap) {
    eventName = getJavaScriptEventName(eventType, map, el);
  } else {
    eventName = map[eventType].noPrefix in el.style ? map[eventType].noPrefix : map[eventType].webkitPrefix;
  }

  return eventName;
}

// Public functions to access getAnimationName() for JavaScript events or CSS
// property names.

const transformStyleProperties = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'MSTransform'];

/**
 * @param {!Object} windowObj
 * @param {string} eventType
 * @return {string}
 */
function getCorrectEventName(windowObj, eventType) {
  return getAnimationName(windowObj, eventType);
}

/**
 * @param {!Object} windowObj
 * @param {string} eventType
 * @return {string}
 */
function getCorrectPropertyName(windowObj, eventType) {
  return getAnimationName(windowObj, eventType);
}




/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_Grid__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Pendulum__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_Limiter__ = __webpack_require__(31);




class CanvasState {
    /**
     * Создаёт новый CanvasState
     * @param canvas HTML5 элемент "Canvas"
     */
    constructor(canvas) {
        // Настройки по умолчанию
        this.selectionColor = "#F44336"; // Red
        this.selectionWidth = 2;
        this.interval = 30;
        this.defaultPendulumOptions = {
            x0: window.innerWidth / 2,
            y0: 60,
            radius: 30,
            angle0: 0,
            length: 1,
            deceleration: 0,
            run: false
        };


        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.valid = false; // Если это значение ложно, всё полотно будет перерисовано
        this.shapes = [];  // Массив с объектами, которые будут нарисованы

        this.selection = null; // Выбранный объект
        this.dragging = false; // Хранит информацию, перемещают ли выбранный объект в данный момент

        this.dragOffX = 0;
        this.dragOffY = 0;

        // Добавляем маятник
        this.pendulum = new __WEBPACK_IMPORTED_MODULE_1__models_Pendulum__["a" /* default */](
            this.defaultPendulumOptions.x0,
            this.defaultPendulumOptions.y0,
            this.defaultPendulumOptions.radius,
            this.defaultPendulumOptions.angle0,
            this.defaultPendulumOptions.length,
            this.defaultPendulumOptions.deceleration,
            this.defaultPendulumOptions.run
        );


        // Обработка изменения размера окна
        window.addEventListener("resize", () => this.resizeCanvas(), false);
        this.resizeCanvas();

        // Исправляет ошибку, приводящую к выделению текста
        canvas.addEventListener("selectstart", (event) => {
            event.preventDefault();

            return false;
        }, false);

        // Обработка перетаскивания объектов мышью
        canvas.addEventListener("mousedown", (event) => this.handlePointerDown(event.pageX, event.pageY), true);
        canvas.addEventListener("mousemove", (event) => this.handlePointerMove(event.pageX, event.pageY), true);
        canvas.addEventListener("mouseup", () => this.handlePointerUp(), true);

        // Обработка перетаскивания объектов на сенсорных экранах
        canvas.addEventListener("touchstart", (event) => {
            const touches = event.changedTouches;
            const firstTouch = touches[0];

            const x = firstTouch.pageX;
            const y = firstTouch.pageY;

            this.handlePointerDown(x, y);

            event.preventDefault();
        }, true);

        canvas.addEventListener("touchmove", (event) => {
            const touches = event.changedTouches;
            const firstTouch = touches[0];

            const x = firstTouch.pageX;
            const y = firstTouch.pageY;

            this.handlePointerMove(x, y);

            event.preventDefault();
        }, true);

        canvas.addEventListener("touchend", () => {
            this.handlePointerUp();

            event.preventDefault();
        }, true);


        // Запуска таймера перерисовки
        setInterval(() => this.redraw(), this.interval);
    }

    /**
     * Очищает холст
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Выполняет все необходимые операции для конеретного отображения приложения после изменения размера окна
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // При изменении размера окна, перемещаем точку крепления маятника в середину страницы (по горизонтали)
        this.pendulum.x0 = this.canvas.width / 2;
        this.defaultPendulumOptions.x0 = this.canvas.width / 2;

        this.valid = false;
    }

    /**
     * Перерисовывает всё содержимое холста
     */
    redraw() {
        // Если состояние полотна ещё не изменялось, отменяем перерисовку
        if (this.valid) return;

        const context = this.context;
        const shapes = this.shapes;
        const interval = this.interval;
        const pendulum = this.pendulum;

        // Очищаем полотно
        this.clear();

        // Рисуем координатную плоскость на заднем плане
        const grid = new __WEBPACK_IMPORTED_MODULE_0__models_Grid__["a" /* default */](30, "#CFD8DC", "#90A4AE"); // Цвет сетки: Blue Grey 100. Цвет направляющей: Blue Grey 300.
        grid.draw(context);

        // Рисуем маятник
        const pendulumIsDragging = this.selection === this.pendulum;
        pendulum.draw(context, interval, pendulumIsDragging);

        // Рисуем все фигуры
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            // Пропускаем рисование объектов, которые находятся за границами полотна
            if (shape.x > this.canvas.width || shape.y > this.canvas.height ||
                shape.x + shape.width < 0 || shape.y + shape.height < 0) {
                continue;
            }

            shapes[i].draw(context);
        }

        // Рисуем выделение – обводку вокруг выделенной фигуры
        if (this.selection !== null) {
            const selection = this.selection;

            context.strokeStyle = this.selectionColor;
            context.lineWidth = this.selectionWidth;

            context.beginPath();
            context.arc(selection.x, selection.y, selection.radius, 0, Math.PI * 2);
            context.stroke();
        }

        // Считаем состояние canvas'а действительным только в том случае, если маятник сейчас не запущен
        if (!pendulum.run) {
            this.valid = true;
        }
    }

    /**
     * Добавляет точечный ограничитель по указанным координатам
     * @param x Координата x ограничителя
     * @param y Координата y ограничителя
     */
    addLimiter(x, y) {
        const limiter = new __WEBPACK_IMPORTED_MODULE_2__models_Limiter__["a" /* default */](x, y);

        this.shapes.push(limiter);
        this.valid = false;
    }

    /**
     * Обновляет параметры маятника
     * @param angle Угол отклонения
     * @param length Длина подвеса
     * @param deceleration Коэффицент затухания
     */
    updatePendulumData(angle, length, deceleration) {
        let run;

        // Проверяем, существует ли маятник, и сохраняем нужные параметры
        if (this.pendulum) {
            run = this.pendulum.run;

            if (!Number.isFinite(angle)) {
                angle = this.pendulum.calcAngle();
            }

            if (!Number.isFinite(length)) {
                length = this.pendulum.length / this.pendulum.coef;
            }

            if (!Number.isFinite(deceleration)) {
                deceleration = this.pendulum.deceleration;
            }
        }

        // Если не получилось установить данные от старого маятника, устанавливаем стандартные
        if (!Number.isFinite(angle)) {
            angle = this.defaultPendulumOptions.angle0;
        }

        if (!Number.isFinite(length)) {
            length = this.defaultPendulumOptions.length;
        }

        if (!Number.isFinite(deceleration)) {
            deceleration = this.defaultPendulumOptions.deceleration;
        }

        if (run === undefined || run === null) {
            run = this.defaultPendulumOptions.run;
        }

        // Создаём новый маятник
        this.pendulum = new __WEBPACK_IMPORTED_MODULE_1__models_Pendulum__["a" /* default */](this.defaultPendulumOptions.x0, this.defaultPendulumOptions.y0, this.defaultPendulumOptions.radius, angle, length, deceleration, run);

        this.valid = false;
    }

    /**
     * Обрабатывает нажатие кнопки указывающего устройства
     * @param x Координата x указателя
     * @param y Координата y указателя
     */
    handlePointerDown(x, y) {
        const shapes = this.shapes;
        let selection;

        // Ищем выделение среди фигур
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[i].contains(x, y)) {
                selection = shapes[i];
            }
        }

        // Если маятник не запущен, проверяем, выделен ли он
        if (!this.pendulum.run && this.pendulum.contains(x, y)) {
            selection = this.pendulum;
        }

        if (selection !== undefined) {
            this.dragOffX = x - selection.x;
            this.dragOffY = y - selection.y;

            this.dragging = true;
            this.selection = selection;
            this.valid = false;
        }
    }

    /**
     * Обрабатывает движение указателя
     * @param x Координата x указателя
     * @param y Координата y указателя
     */
    handlePointerMove(x, y) {
        if (this.dragging) {
            const mouseX = x - this.dragOffX;
            const mouseY = y - this.dragOffY;

            if (this.selection === this.pendulum) {
                // При попытке переместить груз маятника, ограничиваем траекторию перемещения
                // Груз маятника может двигаться только по окружности с центром в точке крепления и радиусом равным длине шнура
                const point = this.pendulum.calcTheClosestPoint(mouseX, mouseY);

                this.selection.x = point.x;
                this.selection.y = point.y;
            }
            else {
                this.selection.x = mouseX;
                this.selection.y = mouseY;
            }

            this.valid = false;
        }
    }

    /**
     * Обрабатывает отпускание кнопки указывающего устройства
     */
    handlePointerUp() {
        // Если при отпускании мыши изменился угол маятника, обновляем эти данные
        if (this.selection === this.pendulum) {
            const newAngle = this.pendulum.calcAngle();

            if (newAngle !== this.pendulum.angle0) {
                this.updatePendulumData(newAngle, null, null);
            }
        }

        this.dragging = false;

        // Снимаем выделение
        this.selection = null;
        this.valid = false;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (CanvasState);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Grid {
    /**
     * Создаёт координатную плоскость
     * @param size Размер ячейки
     * @param gridColor Цвет линий сетки
     * @param guideColor Цвет направляющей
     */
    constructor(size, gridColor, guideColor) {
        this.size = size;
        this.gridColor = gridColor;
        this.guideColor = guideColor;
    }

    /**
     * Рисует вертикальную направляющую по центру холста
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawGuide(context) {
        const canvas = context.canvas;

        context.strokeStyle = this.guideColor;
        context.setLineDash([5]);

        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        // Отключает пунктирные линии после отрисовки направляющей
        context.setLineDash([]);
    }

    /**
     * Рисует координатную плоскость в заданном контексте
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    draw(context) {
        const canvas = context.canvas;

        // Number of vertical & horizontal grid lines
        const numLinesX = Math.floor(canvas.height / this.size);
        const numLinesY = Math.floor(canvas.width / this.size);

        context.strokeStyle = this.gridColor;

        // Draw grid lines along X-axis
        for (let i = 0; i <= numLinesX; i++) {
            context.beginPath();
            context.lineWidth = 1;

            if (i === numLinesX) {
                context.moveTo(0, this.size * i);
                context.lineTo(canvas.width, this.size * i);
            }
            else {
                context.moveTo(0, this.size * i + 0.5);
                context.lineTo(canvas.width, this.size * i + 0.5);
            }
            context.stroke();
        }


        // Draw grid lines along Y-axis
        for (let i = 0; i <= numLinesY; i++) {
            context.beginPath();
            context.lineWidth = 1;

            if (i === numLinesY) {
                context.moveTo(this.size * i, 0);
                context.lineTo(this.size * i, canvas.height);
            }
            else {
                context.moveTo(this.size * i + 0.5, 0);
                context.lineTo(this.size * i + 0.5, canvas.height);
            }
            context.stroke();
        }

        this.drawGuide(context);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Grid);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Pendulum {
    /**
     * Создаёт маятник
     * @param supportX0 Координата точки крепления маятника по оси X
     * @param supportY0 Координата точки крепления маятника по оси Y
     * @param radius Радиус груза (так как он имеет форму шара)
     * @param angle0 Угол начального отклонения маятника (в градусах)
     * @param length Длина подвеса
     * @param deceleration Коэффицент затухания
     * @param run Запущен ли маятник при создании
     */
    constructor(supportX0, supportY0, radius, angle0, length, deceleration, run) {
        this.coef = 400; // Коэффециент масштабирования длины нити
        length *= this.coef;

        // Начальные координаты маятника
        this.x0 = supportX0;
        this.y0 = supportY0 + length;

        // Текущие координаты маятника
        this.x = this.x0;
        this.y = this.y0;

        this.radius = radius;
        this.amplitude = Pendulum.calcAmplitude(angle0, length);
        this.length = length;
        this.deceleration = deceleration;

        this.time = 0; // Время
        this.period = Pendulum.calcPeriod(length / this.coef); // Период колебаний

        this.run = run;
    }

    /**
     * Вычисляет амплитуду колебания
     * @param angle Угол начального отклонения (в градусах)
     * @param length Длина подвеса
     * @returns {number} Амплитуда колебания
     */
    static calcAmplitude(angle, length) {
        const angleInRad = Pendulum.radians(angle);

        return Math.sin(angleInRad) * length;
    }

    /**
     * Вычисляет период колебания
     * @param length Длина подвеса
     * @returns {number} Период колебания
     */
    static calcPeriod(length) {
        const g = 9.80665; // Среднее ускорение свободного падения на Земле

        return 2 * Math.PI * Math.sqrt(length / g);
    }

    /**
     * Конвертирует градусы в радианы
     * @param degrees Значение в градусах
     * @returns {number} Значение в радианах
     */
    static radians(degrees) {
        return degrees * Math.PI / 180;
    };

    /**
     * Конвертирует радианы в градусы
     * @param radians Значение в радианах
     * @returns {number} Значение в градусах
     */
    static degrees(radians) {
        return radians * 180 / Math.PI;
    };

    /**
     * Вычисляет предварительное значение x (без учёта начальных координат)
     * @returns {number} Значение x
     */
    calcX() {
        const angularFrequency = (2 * Math.PI) / this.period; //  Циклическая частота (ω = [1 рад/с])
        const deceleration = Math.pow(Math.E, -this.deceleration * this.getTime());

        // В данном случае начальная фаза равна нулю (φ0 = 0)
        return this.amplitude * Math.cos(angularFrequency * this.getTime()) * deceleration;
    }

    /**
     * Вычисляет предварительное значение y (без учёта начальных координат)
     * @returns {number} Значение y
     */
    calcY() {
        const lengthSquared = Math.pow(this.length, 2);
        const xSquared = Math.pow(this.calcX(), 2);

        return Math.sqrt(lengthSquared - xSquared) - this.length;
    }

    /**
     * Возвращает текущее время в секундах
     * @returns {number} Текущее время в секундах
     */
    getTime() {
        return this.time / 1000;
    }

    /**
     * Вычисляет длину отрезка по координатам начальной и конечной точек
     * @param x0 Координата x начальной точки
     * @param y0 Координата y начальной точки
     * @param x Координата x конечной точки
     * @param y Координата y конечной точки
     * @returns {number} Длина отрезка
     */
    static calcLineSegmentLength(x0, y0, x, y) {
        const xSquared = Math.pow(x - x0, 2);
        const ySquared = Math.pow(y - y0, 2);

        return Math.sqrt(xSquared + ySquared);
    }

    /**
     * Вычисляет текущий угол поворота маятника
     * @returns {number} Угол в градусах
     */
    calcAngle() {
        // Длины сторон треугольника
        const a = this.length;
        const b = this.length;
        const c = Pendulum.calcLineSegmentLength(this.x0, this.y0 + this.length / this.coef, this.x, this.y);

        // Длины сторон треугольника, возведённые в квадрат
        const aSquared = Math.pow(a, 2);
        const bSquared = Math.pow(b, 2);
        const cSquared = Math.pow(c, 2);

        // Находим неизвестный угол (в радианах) по преобразованной теореме синусов
        const angle = Math.acos((aSquared + bSquared - cSquared) / (2 * a * b));

        // TODO: Исправить логику
        if (this.x < this.x0) {
            return Pendulum.degrees(-angle);
        }
        else {
            return Pendulum.degrees(angle);
        }
    }

    /**
     * Вычисляет ближайшую точку к указанной, но при этом достижимую подвесом
     * @param x Координата x указанной точки
     * @param y Координата y указанной точки
     * @returns {{x: *, y: *}} Координаты требуемой точки
     */
    calcTheClosestPoint(x, y) {
        const angleInRads = Math.atan2(y - (this.y0 - this.length), x - this.x0);

        return {
            x: this.length * Math.cos(angleInRads) + this.x0,
            y: this.length * Math.sin(angleInRads) + (this.y0 - this.length)
        }
    }

    /**
     * Рисует точку крепления маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawSupport(context) {
        // Точка
        context.fillStyle = "#000000"; // Black

        context.beginPath();
        context.arc(this.x0, this.y0 - this.length, 6, 0, Math.PI * 2);
        context.fill();

        // Окружность вокрун точки
        context.strokeStyle = "#795548"; // Brown
        context.lineWidth = 4;

        context.beginPath();
        context.arc(this.x0, this.y0 - this.length, 10, 0, Math.PI * 2);
        context.stroke();
    }

    /**
     * Рисует груз
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawBob(context) {
        context.fillStyle = "#FFC107"; // Amber

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    /**
     * Рисует шнур/стержень (cord/rod), на котором висит груз
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawCord(context) {
        drawLine(this.x0, this.y0 - this.length, this.x, this.y, "#000000"); // Black

        /**
         * Рисует отрезок
         * @param x0 Начальная координата x
         * @param y0 Начальная координата y
         * @param x Конечная координата x
         * @param y Конечная координата y
         * @param color Цвет отрезка
         */
        function drawLine(x0, y0, x, y, color) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.moveTo(x0, y0);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        }
    }

    /**
     * Рисует угол отклонения маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawAngle(context) {
        const cX = this.x0;
        const cY = this.y0 - this.length;
        const radius = 60; // Радиус значка угла
        const startAngle = 0.5 * Math.PI;
        const endAngle = Pendulum.radians(90 - this.calcAngle());
        const counterClockwise = endAngle < startAngle;

        context.fillStyle = "rgba(244, 67, 54, 0.5)"; // Red, 50% opacity

        // Рисуем значок угла
        context.beginPath();
        context.moveTo(cX, cY);
        context.arc(cX, cY, radius, startAngle, endAngle, counterClockwise);
        context.lineTo(cX, cY);
        context.fill();
    }

    /**
     * Отображает значение угла отклонения маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    writeAngleValue(context) {
        const angle = Math.round(this.calcAngle()) + "°";

        const x = context.canvas.width / 2;
        const y = 30;

        context.fillStyle = "#000000"; // Black
        context.font = "30px sans-serif";
        context.textAlign = "center";
        context.fillText(angle, x, y);
    }

    /**
     * Определяет, находится ли данная точка внутри груза маятника
     * @param mx Координата x точки
     * @param my Координата y точки
     * @returns {boolean} Находится ли точка внутри груза маятника
     */
    contains(mx, my) {
        const xSquared = Math.pow(mx - this.x, 2);
        const ySquared = Math.pow(my - this.y, 2);
        const radiusSquared = Math.pow(this.radius, 2);

        return xSquared + ySquared < radiusSquared;
    }

    /**
     * Рисует маятник целиком
     * @param context Контекст 2D рендеринга для элемента canvas
     * @param interval Интервал, через который происходит перерисовка canvas
     * @param dragging Находится ли маятник сейчас в режиме перетаскивания
     */
    draw(context, interval, dragging) {
        if (this.run) {
            this.time += interval;
        }

        if (!dragging) {
            this.x = this.calcX() + this.x0;
            this.y = this.calcY() + this.y0;
        }

        // Если маятник не запущен, рисуем угол поворота
        if (!this.run) {
            this.writeAngleValue(context);
            this.drawAngle(context);
        }

        this.drawCord(context);
        this.drawBob(context);
        this.drawSupport(context);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Pendulum);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Limiter {
    /**
     * Создаёт ограничитель
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 10;
    }

    /**
     * Рисует ограничитель в заданном контексте
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = "#607D8B"; // Blue Grey
        context.fill();
    }

    /**
     * Определяет, находится ли данная точка внутри фигуры
     * @param mx Координата x точки
     * @param my Координата y точки
     */
    contains(mx, my) {
        const xSquared = Math.pow(mx - this.x, 2);
        const ySquared = Math.pow(my - this.y, 2);
        const radiusSquared = Math.pow(this.radius, 2);

        return xSquared + ySquared < radiusSquared;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Limiter);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.card.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.card.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n.mdc-card{-webkit-box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;border-radius:2px;overflow:hidden}.mdc-card__primary{padding:16px}.mdc-card__primary .mdc-card__title--large{padding-top:8px}.mdc-card__primary:last-child{padding-bottom:24px}.mdc-card__supporting-text{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;font-weight:400;letter-spacing:.04em;line-height:1.25rem;text-decoration:inherit;text-transform:inherit;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87));-webkit-box-sizing:border-box;box-sizing:border-box;padding:8px 16px}.mdc-card--theme-dark .mdc-card__supporting-text,.mdc-theme--dark .mdc-card__supporting-text{color:#fff;color:var(--mdc-theme-text-primary-on-dark,#fff)}.mdc-card__primary+.mdc-card__supporting-text{margin-top:-8px;padding-top:0}.mdc-card__supporting-text:last-child{padding-bottom:24px}.mdc-card__actions{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;padding:8px}.mdc-card--theme-dark .mdc-card__actions,.mdc-theme--dark .mdc-card__actions{color:#fff;color:var(--mdc-theme-text-primary-on-dark,#fff)}.mdc-card__actions .mdc-card__action{margin:0 8px 0 0}.mdc-card__actions .mdc-card__action[dir=rtl],[dir=rtl] .mdc-card__actions .mdc-card__action{margin:0 0 0 8px}.mdc-card__actions .mdc-card__action:last-child,.mdc-card__actions .mdc-card__action:last-child[dir=rtl],[dir=rtl] .mdc-card__actions .mdc-card__action:last-child{margin-left:0;margin-right:0}.mdc-card__actions--vertical{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column;flex-flow:column;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.mdc-card__actions--vertical .mdc-card__action{margin:0 0 4px}.mdc-card__actions--vertical .mdc-card__action:last-child{margin-bottom:0}.mdc-card__media{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-sizing:border-box;box-sizing:border-box;padding:16px}.mdc-card__media-item{display:inline-block;width:auto;height:80px;margin:16px 0 0;padding:0}.mdc-card__media-item--1dot5x{width:auto;height:120px}.mdc-card__media-item--2x{width:auto;height:160px}.mdc-card__media-item--3x{width:auto;height:240px}.mdc-card__title{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;font-weight:500;letter-spacing:.04em;line-height:1.5rem;text-decoration:inherit;text-transform:inherit;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87));margin:-.063rem 0}.mdc-card--theme-dark .mdc-card__title,.mdc-theme--dark .mdc-card__title{color:#fff;color:var(--mdc-theme-text-primary-on-dark,#fff)}.mdc-card__title--large{font-size:1.5rem;letter-spacing:normal;line-height:2rem;margin:0}.mdc-card__subtitle,.mdc-card__title--large{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-weight:400;text-decoration:inherit;text-transform:inherit}.mdc-card__subtitle{font-size:.875rem;letter-spacing:.04em;line-height:1.25rem;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87));margin:-.063rem 0}.mdc-card--theme-dark .mdc-card__subtitle,.mdc-theme--dark .mdc-card__subtitle{color:#fff;color:var(--mdc-theme-text-primary-on-dark,#fff)}.mdc-card__horizontal-block{padding-left:0;padding-right:16px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-sizing:border-box;box-sizing:border-box}.mdc-card__horizontal-block[dir=rtl],[dir=rtl] .mdc-card__horizontal-block{padding-left:16px;padding-right:0}.mdc-card__horizontal-block .mdc-card__actions--vertical{margin:16px}.mdc-card__horizontal-block .mdc-card__media-item{margin-left:16px;margin-right:0}.mdc-card__horizontal-block .mdc-card__media-item[dir=rtl],[dir=rtl] .mdc-card__horizontal-block .mdc-card__media-item{margin-left:0;margin-right:16px}.mdc-card__horizontal-block .mdc-card__media-item--3x{margin-bottom:16px}", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.fab.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.fab.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n@-webkit-keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@-webkit-keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@-webkit-keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}@keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var:1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug:before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-fab{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent;-webkit-box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;position:relative;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:56px;height:56px;padding:0;-webkit-transition:opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;border:none;border-radius:50%;fill:currentColor;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-moz-appearance:none;-webkit-appearance:none;overflow:hidden;background-color:#ff4081;color:#fff;color:var(--mdc-theme-text-primary-on-secondary,#fff)}.mdc-fab:after,.mdc-fab:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\";will-change:transform,opacity}.mdc-fab:before{-webkit-transition:opacity 15ms linear;transition:opacity 15ms linear}.mdc-fab.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-fab.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-fab.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards;animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-fab.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:.15s mdc-ripple-fg-opacity-out;animation:.15s mdc-ripple-fg-opacity-out;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-fab.mdc-ripple-upgraded:before,.mdc-fab:after,.mdc-fab:before{top:-50%;left:-50%;width:200%;height:200%}.mdc-fab.mdc-ripple-upgraded--unbounded:before,.mdc-fab.mdc-ripple-upgraded:before{-webkit-transform:scale(var(--mdc-ripple-fg-scale,0));transform:scale(var(--mdc-ripple-fg-scale,0))}.mdc-fab.mdc-ripple-upgraded--unbounded:before{top:var(--mdc-ripple-top,0%);left:var(--mdc-ripple-left,0%)}.mdc-fab.mdc-ripple-upgraded--unbounded:before,.mdc-fab.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-fab:focus,.mdc-fab:hover{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mdc-fab:active{-webkit-box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12);box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mdc-fab:active,.mdc-fab:focus{outline:none}.mdc-fab:hover{cursor:pointer}.mdc-fab::-moz-focus-inner{padding:0;border:0}.mdc-fab>svg{width:100%}@supports not (-ms-ime-align:auto){.mdc-fab{background-color:var(--mdc-theme-secondary,#ff4081)}}.mdc-fab:after,.mdc-fab:before{background-color:#fff}@supports not (-ms-ime-align:auto){.mdc-fab:after,.mdc-fab:before{background-color:var(--mdc-theme-text-primary-on-secondary,#fff)}}.mdc-fab:hover:before{opacity:.08}.mdc-fab.mdc-ripple-upgraded--background-focused:before,.mdc-fab:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-fab:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-fab:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.32}.mdc-fab.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.32}.mdc-fab--mini{width:40px;height:40px}.mdc-fab__icon{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;-webkit-transition:-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:transform .18s cubic-bezier(0,0,.2,1) 90ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;will-change:transform}.mdc-fab--exited{-webkit-transform:scale(0);transform:scale(0);-webkit-transition:opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;opacity:0}.mdc-fab--exited .mdc-fab__icon{-webkit-transform:scale(0);transform:scale(0);-webkit-transition:-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:transform 135ms cubic-bezier(.4,0,1,1) 0ms,-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms}", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.ripple.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.ripple.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n@-webkit-keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@-webkit-keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@-webkit-keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}@keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var:1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug:before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-ripple-surface{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface:after,.mdc-ripple-surface:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\";will-change:transform,opacity}.mdc-ripple-surface:before{-webkit-transition:opacity 15ms linear;transition:opacity 15ms linear}.mdc-ripple-surface.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards;animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:.15s mdc-ripple-fg-opacity-out;animation:.15s mdc-ripple-fg-opacity-out;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-ripple-surface:after,.mdc-ripple-surface:before{background-color:#000}.mdc-ripple-surface:hover:before{opacity:.04}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-ripple-surface:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.16}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.16}.mdc-ripple-surface:after,.mdc-ripple-surface:before{top:-50%;left:-50%;width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded:before{top:-50%;left:-50%;width:200%;height:200%;-webkit-transform:scale(var(--mdc-ripple-fg-scale,0));transform:scale(var(--mdc-ripple-fg-scale,0))}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded:before{top:var(--mdc-ripple-top,0%);left:var(--mdc-ripple-left,0%);-webkit-transform:scale(var(--mdc-ripple-fg-scale,0));transform:scale(var(--mdc-ripple-fg-scale,0))}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded:before,.mdc-ripple-surface.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]{overflow:visible}.mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before{background-color:#3f51b5}@supports not (-ms-ime-align:auto){.mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before{background-color:var(--mdc-theme-primary,#3f51b5)}}.mdc-ripple-surface--primary:hover:before{opacity:.04}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.16}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.16}.mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before{background-color:#ff4081}@supports not (-ms-ime-align:auto){.mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before{background-color:var(--mdc-theme-secondary,#ff4081)}}.mdc-ripple-surface--accent:hover:before{opacity:.04}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.16}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.16}", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.snackbar.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.snackbar.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n.mdc-snackbar{display:-webkit-box;display:-ms-flexbox;display:flex;position:fixed;bottom:0;left:50%;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-sizing:border-box;box-sizing:border-box;padding-right:24px;padding-left:24px;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%);-webkit-transition:-webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;transition:-webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;transition:transform .25s cubic-bezier(.4,0,1,1) 0ms;transition:transform .25s cubic-bezier(.4,0,1,1) 0ms,-webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;background-color:#323232;pointer-events:none;will-change:transform}.mdc-snackbar--theme-dark .mdc-snackbar,.mdc-theme--dark .mdc-snackbar{background-color:#fafafa}@media (max-width:599px){.mdc-snackbar{left:0;width:100%;-webkit-transform:translateY(100%);transform:translateY(100%)}}@media (min-width:600px){.mdc-snackbar{min-width:288px;max-width:568px;border-radius:2px}}@media (min-width:600px){.mdc-snackbar--align-start{left:24px;right:auto;bottom:24px;-webkit-transform:translateY(200%);transform:translateY(200%)}.mdc-snackbar--align-start[dir=rtl],[dir=rtl] .mdc-snackbar--align-start{left:auto;right:24px}}@media (max-width:599px){.mdc-snackbar--align-start{bottom:0;left:0;width:100%;-webkit-transform:translateY(100%);transform:translateY(100%)}}.mdc-snackbar--active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;transition:-webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;transition:transform .25s cubic-bezier(0,0,.2,1) 0ms;transition:transform .25s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;pointer-events:auto}.mdc-snackbar--active:not(.mdc-snackbar--align-start){-webkit-transform:translate(-50%);transform:translate(-50%)}@media (max-width:599px){.mdc-snackbar--active:not(.mdc-snackbar--align-start){bottom:0;left:0;width:100%;-webkit-transform:translate(0);transform:translate(0)}}.mdc-snackbar__action-wrapper{padding-left:24px;padding-right:0}.mdc-snackbar__action-wrapper[dir=rtl],[dir=rtl] .mdc-snackbar__action-wrapper{padding-left:0;padding-right:24px}.mdc-snackbar--action-on-bottom{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.mdc-snackbar--action-on-bottom .mdc-snackbar__text{margin-right:inherit}.mdc-snackbar--action-on-bottom .mdc-snackbar__action-wrapper{margin:-12px 0 8px auto;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.mdc-snackbar--action-on-bottom .mdc-snackbar__action-wrapper[dir=rtl],.mdc-snackbar__text,[dir=rtl] .mdc-snackbar--action-on-bottom .mdc-snackbar__action-wrapper{margin-left:0;margin-right:auto}.mdc-snackbar__text{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;font-weight:400;letter-spacing:.04em;line-height:1.25rem;text-decoration:inherit;text-transform:inherit;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:48px;-webkit-transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;opacity:0;color:#fff}.mdc-snackbar[dir=rtl] .mdc-snackbar__text,[dir=rtl] .mdc-snackbar .mdc-snackbar__text{margin-left:auto;margin-right:0}.mdc-snackbar--theme-dark .mdc-snackbar__text,.mdc-theme--dark .mdc-snackbar__text{color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87))}@media (min-width:600px){.mdc-snackbar__text{padding-left:0;padding-right:24px}.mdc-snackbar__text[dir=rtl],[dir=rtl] .mdc-snackbar__text{padding-left:24px;padding-right:0}}.mdc-snackbar--multiline .mdc-snackbar__text{height:80px}.mdc-snackbar--multiline.mdc-snackbar--action-on-bottom .mdc-snackbar__text{margin:0}.mdc-snackbar__action-button{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;font-weight:500;letter-spacing:.04em;line-height:2.25rem;text-decoration:none;text-transform:uppercase;color:#ff4081;color:var(--mdc-theme-secondary,#ff4081);padding:0;-webkit-transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;border:none;outline:none;background-color:transparent;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:none;visibility:hidden}.mdc-snackbar--theme-dark .mdc-snackbar__action-button,.mdc-theme--dark .mdc-snackbar__action-button{color:#3f51b5;color:var(--mdc-theme-primary,#3f51b5)}.mdc-snackbar__action-button:hover{cursor:pointer}.mdc-snackbar__action-button::-moz-focus-inner{border:0}.mdc-snackbar__action-button:not([aria-hidden]){visibility:inherit}.mdc-snackbar--active .mdc-snackbar__action-button:not([aria-hidden]),.mdc-snackbar--active .mdc-snackbar__text{-webkit-transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;transition:opacity .3s cubic-bezier(.4,0,1,1) 0ms;opacity:1}", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.switch.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.switch.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n.mdc-switch{display:inline-block;position:relative}.mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background:before{background-color:#000}.mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob{background-color:#fafafa}.mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob:before{background-color:#9e9e9e}.mdc-switch--theme-dark .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background:before,.mdc-theme--dark .mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background:before{background-color:#fff}.mdc-switch--theme-dark .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob,.mdc-theme--dark .mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob{background-color:#bdbdbd}.mdc-switch--theme-dark .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob:before,.mdc-theme--dark .mdc-switch .mdc-switch__native-control:enabled:not(:checked)~.mdc-switch__background .mdc-switch__knob:before{background-color:#f1f1f1}.mdc-switch .mdc-switch__native-control:enabled:checked~.mdc-switch__background .mdc-switch__knob,.mdc-switch .mdc-switch__native-control:enabled:checked~.mdc-switch__background .mdc-switch__knob:before,.mdc-switch .mdc-switch__native-control:enabled:checked~.mdc-switch__background:before{background-color:#ff4081;background-color:var(--mdc-theme-secondary,#ff4081)}.mdc-switch__native-control{position:absolute;top:-14px;left:-14px;width:48px;height:48px;display:inline-block;margin-top:-3px;-webkit-transition:-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);opacity:0;cursor:pointer;z-index:2}.mdc-switch__native-control:checked{-webkit-transform:translateX(14px);transform:translateX(14px)}.mdc-switch__background{display:block;position:relative;width:34px;height:14px;border-radius:7px;outline:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdc-switch__background:before{display:block;position:absolute;top:0;right:0;bottom:0;left:0;-webkit-transition:opacity 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1);transition:opacity 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1);border-radius:7px;opacity:.38;content:\"\"}.mdc-switch--theme-dark .mdc-switch__background:before,.mdc-theme--dark .mdc-switch__background:before{opacity:.3}.mdc-switch__background .mdc-switch__knob{-webkit-box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);display:block;position:absolute;top:-3px;left:0;width:20px;height:20px;-webkit-transform:translateX(0);transform:translateX(0);-webkit-transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);border-radius:10px;z-index:1}.mdc-switch__background .mdc-switch__knob:before{top:-14px;left:-14px;-webkit-transform:scale(0);transform:scale(0);opacity:.2;content:\"\"}.mdc-switch__background .mdc-switch__knob:before,.mdc-switch__native-control:focus~.mdc-switch__background .mdc-switch__knob:before{position:absolute;width:48px;height:48px;-webkit-transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);border-radius:24px}.mdc-switch__native-control:focus~.mdc-switch__background .mdc-switch__knob:before{-webkit-transform:scale(1);transform:scale(1)}.mdc-switch--theme-dark .mdc-switch__native-control:focus~.mdc-switch__background .mdc-switch__knob:before,.mdc-theme--dark .mdc-switch__native-control:focus~.mdc-switch__background .mdc-switch__knob:before{opacity:.14}.mdc-switch__native-control:checked~.mdc-switch__background:before{opacity:.5}.mdc-switch__native-control:checked~.mdc-switch__background .mdc-switch__knob{-webkit-transform:translateX(14px);transform:translateX(14px);-webkit-transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1);transition:transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1)}.mdc-switch__native-control:checked~.mdc-switch__background .mdc-switch__knob:before{opacity:.15}.mdc-switch__native-control:disabled{cursor:auto}.mdc-switch__native-control:disabled~.mdc-switch__background:before{background-color:#000;opacity:.12}.mdc-switch--theme-dark .mdc-switch__native-control:disabled~.mdc-switch__background:before,.mdc-theme--dark .mdc-switch__native-control:disabled~.mdc-switch__background:before{background-color:#fff;opacity:.1}.mdc-switch__native-control:disabled~.mdc-switch__background .mdc-switch__knob{background-color:#bdbdbd}.mdc-switch--theme-dark .mdc-switch__native-control:disabled~.mdc-switch__background .mdc-switch__knob,.mdc-theme--dark .mdc-switch__native-control:disabled~.mdc-switch__background .mdc-switch__knob{background-color:#424242}", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./mdc.textfield.min.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./mdc.textfield.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n Material Components for the web\n Copyright (c) 2017 Google Inc.\n License: Apache-2.0\n*/\n@-webkit-keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@-webkit-keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,.16)}}@-webkit-keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}@keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,.16)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var:1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug:before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-text-field__bottom-line{background-color:#3f51b5;background-color:var(--mdc-theme-primary,#3f51b5);position:absolute;bottom:0;left:0;width:100%;height:2px;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transition:opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);opacity:0;z-index:2}.mdc-text-field__bottom-line--active{-webkit-transform:scaleX(1);transform:scaleX(1)}.mdc-text-field .mdc-text-field__input:focus~.mdc-text-field__bottom-line{opacity:1}.mdc-text-field-helper-text{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-light,rgba(0,0,0,.38));margin:0;-webkit-transition:opacity .18s cubic-bezier(.4,0,.2,1);transition:opacity .18s cubic-bezier(.4,0,.2,1);opacity:0;font-size:.75rem;will-change:opacity}.mdc-text-field-helper-text--theme-dark,.mdc-theme--dark .mdc-text-field-helper-text{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-hint-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field+.mdc-text-field-helper-text{margin-bottom:8px}.mdc-text-field-helper-text--persistent{-webkit-transition:none;transition:none;opacity:1;will-change:auto}@-webkit-keyframes invalid-shake-float-above-standard{0%{-webkit-transform:translateX(0) translateY(-100%) scale(.75);transform:translateX(0) translateY(-100%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(10px) translateY(-100%) scale(.75);transform:translateX(10px) translateY(-100%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-5px) translateY(-100%) scale(.75);transform:translateX(-5px) translateY(-100%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-100%) scale(.75);transform:translateX(0) translateY(-100%) scale(.75)}}@keyframes invalid-shake-float-above-standard{0%{-webkit-transform:translateX(0) translateY(-100%) scale(.75);transform:translateX(0) translateY(-100%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(10px) translateY(-100%) scale(.75);transform:translateX(10px) translateY(-100%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-5px) translateY(-100%) scale(.75);transform:translateX(-5px) translateY(-100%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-100%) scale(.75);transform:translateX(0) translateY(-100%) scale(.75)}}@-webkit-keyframes invalid-shake-float-above-box{0%{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(10px) translateY(-50%) scale(.75);transform:translateX(10px) translateY(-50%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-5px) translateY(-50%) scale(.75);transform:translateX(-5px) translateY(-50%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}}@keyframes invalid-shake-float-above-box{0%{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(10px) translateY(-50%) scale(.75);transform:translateX(10px) translateY(-50%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-5px) translateY(-50%) scale(.75);transform:translateX(-5px) translateY(-50%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}}.mdc-text-field{display:inline-block;position:relative;margin-bottom:8px;will-change:opacity,transform,color}.mdc-text-field__input{color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87));font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;letter-spacing:.04em;width:100%;padding:0 0 8px;-webkit-transition:opacity .18s cubic-bezier(.4,0,.2,1);transition:opacity .18s cubic-bezier(.4,0,.2,1);border:none;border-bottom:1px solid rgba(0,0,0,.5);background:none;font-size:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none}.mdc-text-field__input::-webkit-input-placeholder{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-light,rgba(0,0,0,.38));-webkit-transition:color .18s cubic-bezier(.4,0,.2,1);transition:color .18s cubic-bezier(.4,0,.2,1);opacity:1}.mdc-text-field__input::-moz-placeholder{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-light,rgba(0,0,0,.38));-webkit-transition:color .18s cubic-bezier(.4,0,.2,1);transition:color .18s cubic-bezier(.4,0,.2,1);opacity:1}.mdc-text-field__input:-ms-input-placeholder{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-light,rgba(0,0,0,.38));-webkit-transition:color .18s cubic-bezier(.4,0,.2,1);transition:color .18s cubic-bezier(.4,0,.2,1);opacity:1}.mdc-text-field__input::placeholder{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-light,rgba(0,0,0,.38));-webkit-transition:color .18s cubic-bezier(.4,0,.2,1);transition:color .18s cubic-bezier(.4,0,.2,1);opacity:1}.mdc-text-field__input:hover{border-color:#000}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:focus::-webkit-input-placeholder{color:hsla(0,0%,100%,.3)}.mdc-text-field__input:focus::-moz-placeholder{color:hsla(0,0%,100%,.3)}.mdc-text-field__input:focus:-ms-input-placeholder{color:hsla(0,0%,100%,.3)}.mdc-text-field__input:focus::placeholder{color:hsla(0,0%,100%,.3)}.mdc-text-field__input:invalid{-webkit-box-shadow:none;box-shadow:none}.mdc-text-field__input--theme-dark,.mdc-theme--dark .mdc-text-field__input{color:#fff;color:var(--mdc-theme-text-primary-on-dark,#fff);border-bottom:1px solid hsla(0,0%,100%,.5)}.mdc-text-field__input--theme-dark:hover,.mdc-theme--dark .mdc-text-field__input:hover{border-bottom:1px solid #fff}.mdc-text-field__input--theme-dark::-webkit-input-placeholder,.mdc-theme--dark .mdc-text-field__input::-webkit-input-placeholder{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-hint-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field__input--theme-dark::-moz-placeholder,.mdc-theme--dark .mdc-text-field__input::-moz-placeholder{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-hint-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field__input--theme-dark:-ms-input-placeholder,.mdc-theme--dark .mdc-text-field__input:-ms-input-placeholder{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-hint-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field__input--theme-dark::placeholder,.mdc-theme--dark .mdc-text-field__input::placeholder{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-hint-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field__input--theme-dark:focus::-webkit-input-placeholder,.mdc-theme--dark .mdc-text-field__input:focus::-webkit-input-placeholder{color:rgba(0,0,0,.38)}.mdc-text-field__input--theme-dark:focus::-moz-placeholder,.mdc-theme--dark .mdc-text-field__input:focus::-moz-placeholder{color:rgba(0,0,0,.38)}.mdc-text-field__input--theme-dark:focus:-ms-input-placeholder,.mdc-theme--dark .mdc-text-field__input:focus:-ms-input-placeholder{color:rgba(0,0,0,.38)}.mdc-text-field__input--theme-dark:focus::placeholder,.mdc-theme--dark .mdc-text-field__input:focus::placeholder{color:rgba(0,0,0,.38)}.mdc-text-field__label{position:absolute;bottom:8px;left:0;-webkit-transform-origin:left top;transform-origin:left top;-webkit-transition:color .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:color .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),color .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),color .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);color:rgba(0,0,0,.5);cursor:text}.mdc-text-field[dir=rtl] .mdc-text-field__label,[dir=rtl] .mdc-text-field .mdc-text-field__label{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top}.mdc-text-field--theme-dark .mdc-text-field__label,.mdc-theme--dark .mdc-text-field__label{color:hsla(0,0%,100%,.6)}.mdc-text-field__label--float-above{-webkit-transform:translateY(-100%) scale(.75);transform:translateY(-100%) scale(.75);cursor:auto}.mdc-text-field__input:-webkit-autofill+.mdc-text-field__label{-webkit-transform:translateY(-100%) scale(.75);transform:translateY(-100%) scale(.75);cursor:auto}.mdc-text-field--box{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent;border-radius:4px 4px 0 0;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;position:relative;height:56px;background-color:rgba(0,0,0,.04);overflow:hidden}.mdc-text-field--box:after,.mdc-text-field--box:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\";will-change:transform,opacity}.mdc-text-field--box:before{-webkit-transition:opacity 15ms linear;transition:opacity 15ms linear}.mdc-text-field--box.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-text-field--box.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-text-field--box.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards;animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-text-field--box.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:.15s mdc-ripple-fg-opacity-out;animation:.15s mdc-ripple-fg-opacity-out;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-text-field--box:after,.mdc-text-field--box:before{background-color:rgba(0,0,0,.87)}@supports not (-ms-ime-align:auto){.mdc-text-field--box:after,.mdc-text-field--box:before{background-color:var(--mdc-theme-text-primary-on-light,rgba(0,0,0,.87))}}.mdc-text-field--box:hover:before{opacity:.04}.mdc-text-field--box.mdc-ripple-upgraded--background-focused:before,.mdc-text-field--box:not(.mdc-ripple-upgraded):focus-within:before,.mdc-text-field--box:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-text-field--box:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-text-field--box:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.16}.mdc-text-field--box.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.16}.mdc-text-field--box:after,.mdc-text-field--box:before{top:-50%;left:-50%;width:200%;height:200%}.mdc-text-field--box.mdc-ripple-upgraded:before{top:-50%;left:-50%;width:200%;height:200%;-webkit-transform:scale(var(--mdc-ripple-fg-scale,0));transform:scale(var(--mdc-ripple-fg-scale,0))}.mdc-text-field--box.mdc-ripple-upgraded--unbounded:before{top:var(--mdc-ripple-top,0%);left:var(--mdc-ripple-left,0%);-webkit-transform:scale(var(--mdc-ripple-fg-scale,0));transform:scale(var(--mdc-ripple-fg-scale,0))}.mdc-text-field--box.mdc-ripple-upgraded--unbounded:before,.mdc-text-field--box.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-text-field--theme-dark.mdc-text-field--box,.mdc-theme--dark .mdc-text-field--box{background-color:hsla(0,0%,100%,.1)}.mdc-text-field--theme-dark.mdc-text-field--box:after,.mdc-text-field--theme-dark.mdc-text-field--box:before,.mdc-theme--dark .mdc-text-field--box:after,.mdc-theme--dark .mdc-text-field--box:before{background-color:#fff}@supports not (-ms-ime-align:auto){.mdc-text-field--theme-dark.mdc-text-field--box:after,.mdc-text-field--theme-dark.mdc-text-field--box:before,.mdc-theme--dark .mdc-text-field--box:after,.mdc-theme--dark .mdc-text-field--box:before{background-color:var(--mdc-theme-text-primary-on-dark,#fff)}}.mdc-text-field--theme-dark.mdc-text-field--box:hover:before,.mdc-theme--dark .mdc-text-field--box:hover:before{opacity:.08}.mdc-text-field--theme-dark.mdc-text-field--box.mdc-ripple-upgraded--background-focused:before,.mdc-text-field--theme-dark.mdc-text-field--box:not(.mdc-ripple-upgraded):focus-within:before,.mdc-text-field--theme-dark.mdc-text-field--box:not(.mdc-ripple-upgraded):focus:before,.mdc-theme--dark .mdc-text-field--box.mdc-ripple-upgraded--background-focused:before,.mdc-theme--dark .mdc-text-field--box:not(.mdc-ripple-upgraded):focus-within:before,.mdc-theme--dark .mdc-text-field--box:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-text-field--theme-dark.mdc-text-field--box:not(.mdc-ripple-upgraded):after,.mdc-theme--dark .mdc-text-field--box:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-text-field--theme-dark.mdc-text-field--box:not(.mdc-ripple-upgraded):active:after,.mdc-theme--dark .mdc-text-field--box:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.32}.mdc-text-field--theme-dark.mdc-text-field--box.mdc-ripple-upgraded,.mdc-theme--dark .mdc-text-field--box.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:.32}.mdc-text-field--box .mdc-text-field__input{-ms-flex-item-align:end;align-self:flex-end;-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;padding:20px 16px 0}.mdc-text-field--box .mdc-text-field__label{left:16px;right:auto;position:absolute;bottom:20px;width:calc(100% - 48px);color:rgba(0,0,0,.6);text-overflow:ellipsis;white-space:nowrap;pointer-events:none;overflow:hidden;will-change:transform}.mdc-text-field--box .mdc-text-field__label[dir=rtl],[dir=rtl] .mdc-text-field--box .mdc-text-field__label{left:auto;right:16px}.mdc-text-field--theme-dark .mdc-text-field--box .mdc-text-field__label,.mdc-theme--dark .mdc-text-field--box .mdc-text-field__label{color:hsla(0,0%,100%,.7);color:var(--mdc-theme-text-secondary-on-dark,hsla(0,0%,100%,.7))}.mdc-text-field--box .mdc-text-field__label--float-above{-webkit-transform:translateY(-50%) scale(.75);transform:translateY(-50%) scale(.75)}.mdc-text-field--box .mdc-text-field__label--float-above.mdc-text-field__label--shake{-webkit-animation:invalid-shake-float-above-box .25s 1;animation:invalid-shake-float-above-box .25s 1}.mdc-text-field--box.mdc-text-field--disabled{color:hsla(0,0%,100%,.3);border-bottom:none;background-color:rgba(0,0,0,.02)}.mdc-text-field--theme-dark.mdc-text-field--box.mdc-text-field--disabled,.mdc-theme--dark .mdc-text-field--box.mdc-text-field--disabled{background-color:#303030;color:rgba(0,0,0,.38);border-bottom:none}.mdc-text-field--box.mdc-text-field--disabled .mdc-text-field__label{bottom:20px}.mdc-text-field--box.mdc-text-field--disabled .mdc-text-field__icon{color:rgba(0,0,0,.3)}.mdc-text-field--box.mdc-text-field--disabled .mdc-text-field__icon--theme-dark,.mdc-theme--dark .mdc-text-field--box.mdc-text-field--disabled .mdc-text-field__icon{color:hsla(0,0%,100%,.3)}.mdc-text-field--box.mdc-text-field--dense .mdc-text-field__input{padding:12px 12px 0}.mdc-text-field--box.mdc-text-field--dense .mdc-text-field__label{left:12px;right:auto;bottom:20px}.mdc-text-field--box.mdc-text-field--dense .mdc-text-field__label[dir=rtl],[dir=rtl] .mdc-text-field--box.mdc-text-field--dense .mdc-text-field__label{left:auto;right:12px}.mdc-text-field--box.mdc-text-field--dense .mdc-text-field__label--float-above{-webkit-transform:translateY(calc(-75% - 2px)) scale(.923);transform:translateY(calc(-75% - 2px)) scale(.923)}.mdc-text-field--with-leading-icon .mdc-text-field__icon,.mdc-text-field--with-trailing-icon .mdc-text-field__icon{position:absolute;bottom:16px;cursor:pointer}.mdc-text-field--theme-dark .mdc-text-field--with-leading-icon .mdc-text-field__icon,.mdc-text-field--theme-dark .mdc-text-field--with-trailing-icon .mdc-text-field__icon,.mdc-theme--dark .mdc-text-field--with-leading-icon .mdc-text-field__icon,.mdc-theme--dark .mdc-text-field--with-trailing-icon .mdc-text-field__icon{color:hsla(0,0%,100%,.7);color:var(--mdc-theme-text-secondary-on-dark,hsla(0,0%,100%,.7))}.mdc-text-field--with-leading-icon .mdc-text-field__input{padding-left:48px;padding-right:15px}.mdc-text-field--with-leading-icon .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__input{padding-left:15px;padding-right:48px}.mdc-text-field--with-leading-icon .mdc-text-field__icon{left:15px;right:auto}.mdc-text-field--with-leading-icon .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__icon{left:auto;right:15px}.mdc-text-field--with-leading-icon .mdc-text-field__label{left:48px;right:auto}.mdc-text-field--with-leading-icon .mdc-text-field__label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__label{left:auto;right:48px}.mdc-text-field--with-trailing-icon .mdc-text-field__input{padding-left:15px;padding-right:48px}.mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__input{padding-left:48px;padding-right:15px}.mdc-text-field--with-trailing-icon .mdc-text-field__icon{left:auto;right:15px}.mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__icon{left:15px;right:auto}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex=\"-1\"]{cursor:default;pointer-events:none}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon{bottom:16px;-webkit-transform:scale(.8);transform:scale(.8)}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input{padding-left:38px;padding-right:12px}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input{padding-left:12px;padding-right:38px}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon{left:12px;right:auto}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon{left:auto;right:12px}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__label{left:38px;right:auto}.mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__label{left:auto;right:38px}.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input{padding-left:12px;padding-right:38px}.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input{padding-left:38px;padding-right:12px}.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon{left:auto;right:12px}.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon{left:12px;right:auto}.mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box){display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;position:relative;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;-webkit-box-sizing:border-box;box-sizing:border-box;margin-top:16px}.mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box):not(.mdc-text-field--textarea){height:48px}.mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box) .mdc-text-field__label{pointer-events:none}.mdc-text-field--invalid .mdc-text-field__label{color:#d50000}.mdc-text-field--invalid .mdc-text-field__input{border-color:#d50000}.mdc-text-field--invalid .mdc-text-field__bottom-line{background-color:#d50000}.mdc-text-field--invalid.mdc-text-field--textarea{border-color:#d50000}.mdc-text-field__label--float-above.mdc-text-field__label--shake{-webkit-animation:invalid-shake-float-above-standard .25s 1;animation:invalid-shake-float-above-standard .25s 1}.mdc-text-field--dense{margin-top:12px;margin-bottom:4px;font-size:.813rem}.mdc-text-field--dense .mdc-text-field__label--float-above{-webkit-transform:translateY(calc(-100% - 2px)) scale(.923);transform:translateY(calc(-100% - 2px)) scale(.923)}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{border-bottom:1px dotted rgba(35,31,32,.26)}.mdc-text-field--theme-dark.mdc-text-field--disabled .mdc-text-field__input,.mdc-theme--dark .mdc-text-field--disabled .mdc-text-field__input{border-bottom:1px dotted hsla(0,0%,100%,.3)}.mdc-text-field--disabled+.mdc-text-field-helper-text,.mdc-text-field--disabled .mdc-text-field__input,.mdc-text-field--disabled .mdc-text-field__label{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-disabled-on-light,rgba(0,0,0,.38))}.mdc-text-field--theme-dark.mdc-text-field--disabled+.mdc-text-field-helper-text,.mdc-text-field--theme-dark .mdc-text-field--disabled .mdc-text-field__input,.mdc-text-field--theme-dark .mdc-text-field--disabled .mdc-text-field__label,.mdc-theme--dark .mdc-text-field--disabled+.mdc-text-field-helper-text,.mdc-theme--dark .mdc-text-field--disabled .mdc-text-field__input,.mdc-theme--dark .mdc-text-field--disabled .mdc-text-field__label{color:hsla(0,0%,100%,.5);color:var(--mdc-theme-text-disabled-on-dark,hsla(0,0%,100%,.5))}.mdc-text-field--disabled .mdc-text-field__label{bottom:8px;cursor:default}.mdc-text-field__input:required+.mdc-text-field__label:after{margin-left:1px;content:\"*\"}.mdc-text-field--focused .mdc-text-field__input:required+.mdc-text-field__label:after{color:#d50000}.mdc-text-field--theme-dark.mdc-text-field--focused .mdc-text-field__input:required+.mdc-text-field__label:after,.mdc-theme--dark .mdc-text-field--focused .mdc-text-field__input:required+.mdc-text-field__label:after{color:#ff6e6e}.mdc-text-field--textarea{border-radius:4px;display:-webkit-box;display:-ms-flexbox;display:flex;height:auto;-webkit-transition:none;transition:none;border:1px solid rgba(0,0,0,.73);overflow:hidden}.mdc-text-field--textarea .mdc-text-field__label{border-radius:4px 4px 0 0}.mdc-text-field--textarea .mdc-text-field__input{border-radius:2px}.mdc-text-field--theme-dark .mdc-text-field--textarea,.mdc-theme--dark .mdc-text-field--textarea{border-color:#fff}.mdc-text-field--textarea .mdc-text-field__input{padding:16px;padding-top:32px;border:1px solid transparent}.mdc-text-field--textarea .mdc-text-field__input:focus{border-color:#3f51b5;border-color:var(--mdc-theme-primary,#3f51b5)}.mdc-text-field--textarea .mdc-text-field__input:invalid:not(:focus){border-color:#d50000}.mdc-text-field--theme-dark .mdc-text-field--textarea .mdc-text-field__input:hover,.mdc-theme--dark .mdc-text-field--textarea .mdc-text-field__input:hover{border-bottom-color:transparent}.mdc-text-field--theme-dark .mdc-text-field--textarea .mdc-text-field__input:focus,.mdc-theme--dark .mdc-text-field--textarea .mdc-text-field__input:focus{border-color:#ff4081;border-color:var(--mdc-theme-secondary,#ff4081)}.mdc-text-field--theme-dark .mdc-text-field--textarea .mdc-text-field__input:invalid:not(:focus),.mdc-theme--dark .mdc-text-field--textarea .mdc-text-field__input:invalid:not(:focus){border-color:#ff6e6e}.mdc-text-field--textarea .mdc-text-field__label{left:1px;right:auto;top:18px;bottom:auto;padding:8px 16px;background-color:#fff}.mdc-text-field--textarea .mdc-text-field__label[dir=rtl],[dir=rtl] .mdc-text-field--textarea .mdc-text-field__label{left:auto;right:1px}.mdc-text-field--theme-dark .mdc-text-field--textarea .mdc-text-field__label,.mdc-theme--dark .mdc-text-field--textarea .mdc-text-field__label{background-color:#303030}.mdc-text-field--textarea .mdc-text-field__label--float-above{-webkit-transform:translateY(-50%) scale(.923);transform:translateY(-50%) scale(.923)}.mdc-text-field--textarea.mdc-text-field--disabled{border-style:solid;border-color:rgba(35,31,32,.26);background-color:#f9f9f9}.mdc-text-field--theme-dark .mdc-text-field--textarea.mdc-text-field--disabled,.mdc-theme--dark .mdc-text-field--textarea.mdc-text-field--disabled{border-color:hsla(0,0%,100%,.3);background-color:#2f2f2f}.mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__label{background-color:#f9f9f9}.mdc-text-field--theme-dark .mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__label,.mdc-theme--dark .mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__label{background-color:#2f2f2f}.mdc-text-field--textarea:not(.mdc-text-field--upgraded) .mdc-text-field__input{padding-top:16px}.mdc-text-field--textarea.mdc-text-field--focused{border-color:#3f51b5;border-color:var(--mdc-theme-primary,#3f51b5)}.mdc-text-field--fullwidth{width:100%}.mdc-text-field--fullwidth:not(.mdc-text-field--textarea){display:block;-webkit-box-sizing:border-box;box-sizing:border-box;height:56px;margin:0;border:none;border-bottom:1px solid rgba(0,0,0,.12);outline:none}.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input{width:100%;height:100%;padding:0;resize:none;border:none!important}.mdc-text-field--fullwidth--theme-dark,.mdc-theme--dark .mdc-text-field--fullwidth{border-bottom:1px solid hsla(0,0%,100%,.12)}.mdc-text-field:not(.mdc-text-field--upgraded):not(.mdc-text-field--textarea) .mdc-text-field__input{-webkit-transition:border-bottom-color .18s cubic-bezier(.4,0,.2,1);transition:border-bottom-color .18s cubic-bezier(.4,0,.2,1);border-bottom:1px solid rgba(0,0,0,.12)}.mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:focus{border-color:#3f51b5;border-color:var(--mdc-theme-primary,#3f51b5)}.mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:disabled{color:rgba(0,0,0,.38);border-bottom-style:dotted}.mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:invalid:not(:focus){border-color:#d50000}.mdc-text-field--theme-dark:not(.mdc-text-field--upgraded) .mdc-text-field__input:not(:focus),.mdc-theme--dark .mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:not(:focus){border-color:hsla(0,0%,100%,.12)}.mdc-text-field--theme-dark:not(.mdc-text-field--upgraded) .mdc-text-field__input:disabled,.mdc-theme--dark .mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:disabled{color:rgba(0,0,0,.38);border-color:hsla(0,0%,100%,.3);background-color:#2f2f2f}.mdc-text-field--theme-dark:not(.mdc-text-field--upgraded) .mdc-text-field__input:invalid:not(:focus),.mdc-theme--dark .mdc-text-field:not(.mdc-text-field--upgraded) .mdc-text-field__input:invalid:not(:focus){border-color:#ff6e6e}.mdc-text-field--box:not(.mdc-text-field--upgraded){height:56px}.mdc-text-field--box:not(.mdc-text-field--upgraded):after,.mdc-text-field--box:not(.mdc-text-field--upgraded):before{border-radius:0}.mdc-text-field--box:not(.mdc-text-field--upgraded) .mdc-text-field__input{padding-top:0}.mdc-text-field--dense+.mdc-text-field-helper-text{margin-bottom:4px}.mdc-text-field--focused+.mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--box+.mdc-text-field-helper-text{margin-right:16px;margin-left:16px}.mdc-text-field--invalid+.mdc-text-field-helper-text--validation-msg{opacity:1;color:#d50000}.mdc-text-field--theme-dark.mdc-text-field--invalid+.mdc-text-field-helper-text--validation-msg,.mdc-theme--dark .mdc-text-field--invalid+.mdc-text-field-helper-text--validation-msg{color:#ff6e6e}.mdc-form-field>.mdc-text-field+label{-ms-flex-item-align:start;align-self:flex-start}", ""]);

// exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "#canvas {\n    position: fixed;\n\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n}\n\n.mdc-card {\n    position: fixed;\n    max-width: 25%;\n\n    top: 1rem;\n    right: 1rem;\n\n    background: white;\n}\n\n.mdc-text-field {\n    width: 100%;\n}\n\n.mdc-switch {\n    margin-top: 16px;\n}\n\nbutton.app-fab--absolute {\n    position: fixed;\n\n    bottom: 1rem;\n    right: 1rem;\n}\n\n@media (min-width: 1024px) {\n    .mdc-card {\n        top: 1.5rem;\n        right: 1.5rem;\n    }\n\n    button.app-fab--absolute {\n        bottom: 1.5rem;\n        right: 1.5rem;\n    }\n}", ""]);

// exports


/***/ })
/******/ ]);