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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/companies.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/companies.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_uploader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/uploader */ "./resources/js/components/uploader.vue");
/* harmony import */ var _ajax_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ajax-mixin */ "./resources/js/ajax-mixin.js");
/* harmony import */ var _ajax_mixin__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ajax_mixin__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _form_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../form-mixin */ "./resources/js/form-mixin.js");
/* harmony import */ var _form_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_form_mixin__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared-methods-mixin */ "./resources/js/shared-methods-mixin.js");
/* harmony import */ var _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shared_methods_mixin__WEBPACK_IMPORTED_MODULE_3__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Uploader Component

Vue.component('cd-uploader', _components_uploader__WEBPACK_IMPORTED_MODULE_0__["default"]); // Mixins




/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [_ajax_mixin__WEBPACK_IMPORTED_MODULE_1___default.a, _form_mixin__WEBPACK_IMPORTED_MODULE_2___default.a, _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_3___default.a],
  computed: {
    currentLogo: function currentLogo() {
      var self = this;
      var logoPath = '';

      if (_.has(self, 'currentObj.logo') && !_.isEmpty(self.currentObj.logo)) {
        return logoPath = '/logo/square_' + self.currentObj.logo + '?' + Math.random();
      }

      return '';
    }
  },
  data: function data() {
    return {
      blankObj: {
        name: '',
        email: '',
        logo: '',
        new_logo: '',
        website: ''
      },
      closeWithPendingUpload: false,
      currentObjType: 'company',
      headers: [// { text : '', width : '10%', class : 'blue lighten-5', sortable : false, },
      {
        text: 'LOGO',
        width: '10%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: 'COMPANY NAME',
        width: '30%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: 'EMAIL',
        width: '30%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: 'EMPLOYEES',
        width: '20%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: '',
        width: '10%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }],
      masterCollection: 'companies',
      resetTimeStamp: 0,
      uploadPending: false
    };
  },
  methods: {
    closeEditor: function closeEditor(force) {
      var self = this;
      var force = force || 'no';

      if (self.uploadPending && force != 'yes') {
        self.setValue(self, 'closeWithPendingUpload', true);
      } else {
        self.setValue(self, 'uploadPending', false);
        self.setValue(self, 'closeWithPendingUpload', false);
        self.setValue(self, 'showEditor', false);
      }
    },
    companyLogo: function companyLogo(company) {
      var self = this;
      var company = company || null;

      if (_.isNull(company) || !_.has(company, 'logo') || _.isNull(company.logo)) {
        return '/logo/logo-placeholder.png';
      }

      return '/logo/square_' + company.logo + '?nc=' + Math.random();
    },
    toggleUploadPending: function toggleUploadPending(status) {
      var self = this;
      self.setValue(self, 'uploadPending', status);
    },
    save: function save() {
      var self = this; // Stop multiple submissions.

      if (self.saving || self.uploadPending) return; // Check all OK.

      if (!this.$refs.form.validate()) {
        self.alert('Please check the company details and correct an issues.', 'warning');
        return;
      } // Setup data.


      var url = '/company/create';
      var data = {
        email: self.getStringValue('currentObj.email'),
        name: self.getStringValue('currentObj.name'),
        logo: self.getStringValue('currentObj.logo'),
        new_logo: self.getStringValue('currentObj.new_logo'),
        website: self.getStringValue('currentObj.website') // Override if editing.

      };

      if (self.updating) {
        url = '/company/update';

        _.merge(data, {
          id: self.getNumericValue('currentObj.id')
        });
      }

      self.fetch({
        url: url,
        data: data,
        success: function success(_ref) {
          var data = _ref.data;

          if (_.has(data, 'status') && data.status == 'success') {
            if (self.creating) {
              self.setValue(self, 'query', '');
              self.setValue(self, 'deleted', 0);
            }

            self.debouncedLoader(self.collectionLoader);
            self.closeEditor();
          }
        },
        flag: 'saving'
      });
    }
  },
  mounted: function mounted() {
    var self = this; // Check for filters

    if (_.has(self.$route, 'query.q')) {
      self.setValue(self, 'query', self.$route.query.q);
    }

    if (_.has(self.$route, 'query.d')) {
      self.setValue(self, 'deleted', self.$route.query.d);
    }

    self.setValue(self, 'collectionLoader', 'loadCompanies');
    self.debouncedLoader(self.collectionLoader);
    window.log('Companies mounted.');
  },
  watch: {
    showEditor: function showEditor(val) {
      var self = this;

      if (!val) {
        setTimeout(function () {
          self.setValue(self, 'resetTimeStamp', new Date().getMilliseconds());
        }, 1000);
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/employees.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/employees.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajax_mixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ajax-mixin */ "./resources/js/ajax-mixin.js");
/* harmony import */ var _ajax_mixin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ajax_mixin__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _form_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../form-mixin */ "./resources/js/form-mixin.js");
/* harmony import */ var _form_mixin__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_form_mixin__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared-methods-mixin */ "./resources/js/shared-methods-mixin.js");
/* harmony import */ var _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shared_methods_mixin__WEBPACK_IMPORTED_MODULE_2__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Mixins



/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [_ajax_mixin__WEBPACK_IMPORTED_MODULE_0___default.a, _form_mixin__WEBPACK_IMPORTED_MODULE_1___default.a, _shared_methods_mixin__WEBPACK_IMPORTED_MODULE_2___default.a],
  data: function data() {
    return {
      blankObj: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: {}
      },
      currentObjType: 'employee',
      headers: [// { text : '', width : '10%', class : 'blue lighten-5', sortable : false },
      {
        text: 'EMPLOYEE',
        width: '50%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: 'CONTACT DETAILS',
        width: '40%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }, {
        text: '',
        width: '10%',
        class: 'body-2 blue lighten-5',
        sortable: false
      }],
      masterCollection: 'employees'
    };
  },
  methods: {
    companyName: function companyName(employee) {
      var self = this;
      var employee = employee || null;
      if (_.isNull(employee) || !_.has(employee, 'company.name')) return '';
      return employee.company.deleted ? employee.company.name + ' [Deleted] ' : employee.company.name;
    },
    save: function save() {
      var self = this; // Stop multiple submissions.

      if (self.saving) return; // Check all OK.

      if (!this.$refs.form.validate()) {
        self.alert('Please check the employee details and correct an issues.', 'warning');
        return;
      } // Setup data.


      var url = '/employee/create';
      var data = {
        email: self.getStringValue('currentObj.email'),
        first_name: self.getStringValue('currentObj.first_name'),
        last_name: self.getStringValue('currentObj.last_name'),
        phone: self.getStringValue('currentObj.phone'),
        company_id: self.getNumericValue('currentObj.company.id') // Override if editing.

      };

      if (self.updating) {
        url = '/employee/update';

        _.merge(data, {
          id: self.getNumericValue('currentObj.id')
        });
      }

      self.fetch({
        url: url,
        data: data,
        success: function success(_ref) {
          var data = _ref.data;

          if (_.has(data, 'status') && data.status == 'success') {
            if (self.creating) {
              self.setValue(self, 'query', '');
              self.setValue(self, 'deleted', 0);
            }

            self.debouncedLoader(self.collectionLoader);
            self.setValue(self, 'showEditor', false);
          }
        },
        flag: 'saving'
      });
    }
  },
  mounted: function mounted() {
    var self = this; // Check for filters

    if (_.has(self.$route, 'query.q')) {
      self.setValue(self, 'query', self.$route.query.q);
    }

    if (_.has(self.$route, 'query.d') && self.$route.query.d == 1) {
      self.setValue(self, 'deleted', 1);
    }

    self.setValue(self, 'collectionLoader', 'loadEmployees');
    self.debouncedLoader(self.collectionLoader);
    self.debouncedLoader('loadCompanies');
    console.log('Employees mounted.');
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/uploader.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/uploader.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  computed: {
    id: function id() {
      var self = this;
      return 'uploader-' + self._uid;
    },
    hasDefaultImage: function hasDefaultImage() {
      var self = this;
      return _.has(self, 'defaultImage') && !_.isEmpty(self.defaultImage);
    },
    hasOriginalImage: function hasOriginalImage() {
      var self = this;
      return _.has(self, 'originalImage') && !_.isEmpty(self.originalImage);
    },
    isImageUpload: function isImageUpload() {
      var self = this;
      return _.some(self.allowedTypes, function (allowedType) {
        return _.includes(allowedType, 'image');
      });
    }
  },
  data: function data() {
    return {
      componentIsMounted: false,
      defaultImage: '',
      file: {
        name: '',
        type: '',
        size: 0
      },
      fileAdded: false,
      fileSize: 0,
      originalImage: '',
      previewImage: {
        src: ''
      },
      progress: 0,
      progressDetail: '',
      uploaded: false,
      uploader: {},
      uploading: false
    };
  },
  props: {
    allowedTypes: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    browse: {
      type: String,
      default: 'browse'
    },
    currentImage: {
      type: String,
      default: ''
    },
    maxFiles: {
      type: Number,
      default: 1
    },
    maxHeight: {
      type: Number,
      default: 3000
    },
    maxFileSize: {
      type: Number,
      default: 2000000 // 2MB

    },
    maxWidth: {
      type: Number,
      default: 3000
    },
    minFiles: {
      type: Number,
      default: 1
    },
    note: {
      type: String,
      default: ''
    },
    resetUploader: {
      type: Number
    }
  },
  methods: {
    clearUploader: function clearUploader() {
      var self = this;
      self.$set(self, 'defaultImage', '');
      self.$set(self, 'file', {
        name: '',
        type: '',
        size: 0
      });
      self.$set(self, 'fileAdded', false);
      self.$set(self, 'fileSize', 0);
      self.$set(self, 'previewImage', {
        src: ''
      });
      self.$set(self, 'uploaded', false);
      self.$set(self, 'progress', 0);
      self.$set(self, 'progressDetail', '');
      self.emit('fileName', ''); // Clear Uploader

      self.uploader.reset();
      window.localStorage.clear();
    },
    emit: function emit(emitType, message) {
      var self = this;
      self.$emit(emitType, message);
    },
    prettyBytes: function prettyBytes(num) {
      // jacked from: https://github.com/sindresorhus/pretty-bytes
      if (typeof num !== 'number' || isNaN(num)) {
        throw new TypeError('Expected a number');
      }

      var exponent;
      var unit;
      var neg = num < 0;
      var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      if (neg) {
        num = -num;
      }

      if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
      }

      exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
      num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
      unit = units[exponent];
      return (neg ? '-' : '') + num + ' ' + unit;
    },
    removeDiacritics: function removeDiacritics(str) {
      var str = str || '';
      if (typeof str !== 'string') return str;
      var diacriticsMap = {
        A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
        AA: /[\uA732]/g,
        AE: /[\u00C6\u01FC\u01E2]/g,
        AO: /[\uA734]/g,
        AU: /[\uA736]/g,
        AV: /[\uA738\uA73A]/g,
        AY: /[\uA73C]/g,
        B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
        C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
        D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
        DZ: /[\u01F1\u01C4]/g,
        Dz: /[\u01F2\u01C5]/g,
        E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
        F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
        G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
        H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
        I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
        J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
        K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
        L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
        LJ: /[\u01C7]/g,
        Lj: /[\u01C8]/g,
        M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
        N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
        NJ: /[\u01CA]/g,
        Nj: /[\u01CB]/g,
        O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
        OI: /[\u01A2]/g,
        OO: /[\uA74E]/g,
        OU: /[\u0222]/g,
        P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
        Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
        R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
        S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
        T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
        TZ: /[\uA728]/g,
        U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
        V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
        VY: /[\uA760]/g,
        W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
        X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
        Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
        Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
        a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
        aa: /[\uA733]/g,
        ae: /[\u00E6\u01FD\u01E3]/g,
        ao: /[\uA735]/g,
        au: /[\uA737]/g,
        av: /[\uA739\uA73B]/g,
        ay: /[\uA73D]/g,
        b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
        c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
        d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
        dz: /[\u01F3\u01C6]/g,
        e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
        f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
        g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
        h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
        hv: /[\u0195]/g,
        i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
        j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
        k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
        l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
        lj: /[\u01C9]/g,
        m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
        n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
        nj: /[\u01CC]/g,
        o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
        oi: /[\u01A3]/g,
        ou: /[\u0223]/g,
        oo: /[\uA74F]/g,
        p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
        q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
        r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
        s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
        ss: /[\u00DF]/g,
        t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
        tz: /[\uA729]/g,
        u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
        v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
        vy: /[\uA761]/g,
        w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
        x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
        y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
        z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
      };

      for (var x in diacriticsMap) {
        str = str.replace(diacriticsMap[x], x);
      }

      return str;
    },
    revertToOriginal: function revertToOriginal() {
      var self = this;
      self.clearUploader();
      self.$set(self, 'defaultImage', _.clone(self.originalImage));
      self.$set(self.previewImage, 'src', _.clone(self.originalImage));
    },
    slugify: function slugify(text) {
      var self = this;
      var text = self.removeDiacritics(text);
      return text.toString().toLowerCase().trim().replace(/\s+/g, '-') // replace spaces with -
      .replace(/_+/g, '-') // replace _ with -
      .replace(/&/g, '-and-') // replace & with 'and'
      .replace(/[^\w\-]+/g, '') // remove all non-word chars
      .replace(/\-\-+/g, '-'); // replace multiple '-' with single '-'
    },
    uniqueFileName: function uniqueFileName(fileName) {
      var self = this;
      var fileName = fileName || null;
      if (_.isNull(fileName)) return null;
      var ext = fileName.substring(fileName.lastIndexOf('.'), fileName.length) || '';
      return Date.now() + '_' + self.slugify(fileName.replace(ext, '')) + ext;
    },
    updateProgress: function updateProgress(soFar, total) {
      var self = this;
      var progress = Math.round(soFar / total * 100);
      self.$set(self, 'progress', progress);

      if (progress == 100) {
        self.$set(self, 'progressDetail', 'Upload finalising ...');
      } else {
        self.$set(self, 'progressDetail', progress + '%');
      }
    },
    uploadFile: function uploadFile() {
      var self = this;
      if (self.uploading) return;
      self.$set(self, 'uploading', true);
      self.uploader.upload().then(function (result) {
        self.$set(self, 'uploading', false);

        if (result.failed.length > 0) {
          console.error('Errors:');
          result.failed.forEach(function (file) {
            console.error(file.error);
          });
        }
      });
    }
  },
  mounted: function mounted() {
    // Reference this.
    var self = this; // Clear

    window.localStorage.clear(); // Ensure Uploader is present.

    self.uploader = Uppy.Core({
      allowMultipleUploads: true,
      onBeforeFileAdded: function onBeforeFileAdded(currentFile) {
        // Validate file types.
        if (_.has(self, '_props.allowedTypes') && _.isArray(self.allowedTypes) && !_.isEmpty(self.allowedTypes)) {
          if (!_.includes(self.allowedTypes, currentFile.type)) {
            self.emit('oops', 'Please select the correct type of file. The one you selected is a ' + (currentFile.type || 'undefined type') + ', and we a file that\'s ' + self.allowedTypes.join(' or '));
            return;
          }
        } // Validate Size(kb)


        if (currentFile.data.size > self.maxFileSize) {
          self.emit('oops', 'Your file is too large. It\'s ' + self.prettyBytes(currentFile.data.size) + ' and it can be a maximum of ' + self.prettyBytes(self.maxFileSize));
          return;
        } // Inject 'safe' name.


        var modifiedFile = Object.assign({}, currentFile, {
          original_name: _.clone(currentFile.name),
          name: self.uniqueFileName(currentFile.name)
        });
        return modifiedFile;
      },
      restrictions: {
        maxFileSize: self.maxFileSize,
        maxNumberOfFiles: self.maxFiles,
        minNumberOfFiles: self.minFiles,
        allowedFileTypes: self.allowedTypes
      }
    }).use(Uppy.DragDrop, {
      note: self.note,
      target: '#' + self.id,
      locale: {
        strings: {
          dropHereOr: 'Drop file here or %{browse}',
          browse: this.browse
        }
      }
    }).use(Uppy.Tus, {
      autoRetry: true,
      endpoint: '/tus/',
      limit: 10,
      resume: true,
      retryDelays: [0, 1000, 3000, 5000]
    }).on('file-added', function (currentFile) {
      var currentFile = currentFile || null;

      if (_.isNull(currentFile) || !_.has(currentFile, 'data')) {
        self.error('We could not add your file, please try again in a few minutes or contact us to help.');
        return;
      } // Validate Dimensions


      if (self.isImageUpload) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(currentFile.data);

        fileReader.onload = function () {
          self.previewImage = new Image();

          self.previewImage.onload = function () {
            if (self.previewImage.width < 400 && self.previewImage.height < 400) {
              self.emit('oops', 'Your image file is too small, it\'s ' + self.previewImage.width + 'px wide by ' + self.previewImage.height + 'px high and needs to be less at least 400px wide or high.');
              Vue.nextTick(function () {
                self.clearUploader();
              });
            }

            if (self.previewImage.width > self.maxWidth) {
              self.emit('oops', 'Your image file is too wide, it\'s ' + self.previewImage.width + 'px wide and needs to be less than ' + self.maxWidth + 'px wide.');
              Vue.nextTick(function () {
                self.clearUploader();
              });
            }

            if (self.previewImage.height > self.maxHeight) {
              self.emit('oops', 'Your image file is too tall, it\'s ' + self.previewImage.height + 'px high and needs to be less than ' + self.maxHeight + 'px high.');
              self.clearUploader();
            }
          };

          self.previewImage.src = fileReader.result;
        };
      }

      self.$set(self, 'fileAdded', true);
      self.$set(self, 'file', currentFile.data);
      self.$set(self, 'fileSize', currentFile.size);
      self.emit('uploadPending', true);
    }).on('upload-progress', function (file, progress) {
      self.updateProgress(progress.bytesUploaded, progress.bytesTotal);
    }).on('complete', function (result) {
      var result = result || null;

      if (!_.isNull(result) && _.has(result, 'successful') && _.isArray(result.successful) && !_.isEmpty(result.successful)) {
        self.$set(self, 'uploaded', true);
        self.emit('uploadPending', false);
        self.emit('snackMessage', 'The logo was uploaded successfully.');
        self.emit('fileName', result.successful[0].name);
        self.emit('fileType', result.successful[0].type);
        self.emit('fileSize', result.successful[0].size);
        window.localStorage.clear();
      }
    });
    self.uploader.reset(); // Hide flickers if current Image (allow for evaluations);

    setTimeout(function () {
      self.$set(self, 'componentIsMounted', true);
    }, 1000);
  },
  watch: {
    currentImage: function currentImage(image) {
      var self = this;
      var image = image || null;
      if (_.isNull(image)) return;

      if (_.has(self, 'previewImage') && !_.isEmpty(image) && !_.isEqual(image, self.previewImage.src)) {
        self.$set(self, 'originalImage', _.clone(image));
        self.$set(self, 'defaultImage', _.clone(image));
        self.$set(self.previewImage, 'src', _.clone(image));
      }
    },
    resetUploader: function resetUploader() {
      var self = this;
      self.clearUploader();
    }
  }
});

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("v-progress-linear", {
        staticClass: "ma-0",
        attrs: { indeterminate: _vm.isLoading }
      }),
      _vm._v(" "),
      _c(
        "v-container",
        [
          _c(
            "v-layout",
            { attrs: { wrap: "" } },
            [
              _c(
                "v-flex",
                { staticClass: "xs12 font-weight-light display-1 py-4" },
                [_vm._v("\n                COMPANIES\n            ")]
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { attrs: { xs6: "" } },
                [
                  _c("v-text-field", {
                    attrs: {
                      "prepend-icon": "search",
                      label: "Search",
                      clearable: ""
                    },
                    model: {
                      value: _vm.query,
                      callback: function($$v) {
                        _vm.query = $$v
                      },
                      expression: "query"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { attrs: { xs3: "" } },
                [
                  _c("v-checkbox", {
                    attrs: { label: "Show Deleted" },
                    model: {
                      value: _vm.deleted,
                      callback: function($$v) {
                        _vm.deleted = $$v
                      },
                      expression: "deleted"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { staticClass: "text-sm-right", attrs: { xs3: "" } },
                [
                  _c(
                    "v-btn",
                    {
                      staticClass: "white--text mt-3 mr-0",
                      attrs: { color: "primary" },
                      on: {
                        click: function($event) {
                          _vm.edit()
                        }
                      }
                    },
                    [
                      _c("v-icon", { attrs: { small: "", dark: "" } }, [
                        _vm._v("add")
                      ]),
                      _vm._v("\n                    Create\n                ")
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-layout",
            { attrs: { wrap: "", "mt-2": "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "" } },
                [
                  _c(
                    "v-data-table",
                    {
                      attrs: {
                        headers: _vm.headers,
                        items: _vm.companies,
                        "item-key": "id",
                        "rows-per-page-items": [5, 10, 25],
                        pagination: _vm.paginator,
                        "total-items": _vm.paginator.totalItems
                      },
                      on: {
                        "update:pagination": [
                          function($event) {
                            _vm.paginator = $event
                          },
                          _vm.loadCompanies
                        ]
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "items",
                          fn: function(props) {
                            return [
                              _c("v-hover", {
                                scopedSlots: _vm._u([
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var hover = ref.hover
                                      return _c(
                                        "tr",
                                        { attrs: { active: props.selected } },
                                        [
                                          _c(
                                            "td",
                                            {
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c(
                                                "v-avatar",
                                                {
                                                  attrs: {
                                                    size: 50,
                                                    color: "grey lighten-4",
                                                    tile: ""
                                                  }
                                                },
                                                [
                                                  _c("img", {
                                                    attrs: {
                                                      src: _vm.companyLogo(
                                                        props.item
                                                      )
                                                    }
                                                  })
                                                ]
                                              )
                                            ],
                                            1
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            {
                                              staticClass: "text-xs-left",
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c("div", [
                                                _c("a", {
                                                  domProps: {
                                                    innerHTML: _vm._s(
                                                      _vm.highlight(
                                                        props.item.name || ""
                                                      )
                                                    )
                                                  },
                                                  on: {
                                                    click: function($event) {
                                                      _vm.edit(props.item)
                                                    }
                                                  }
                                                })
                                              ]),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "body-1 grey--text text--lighten-1"
                                                },
                                                [
                                                  _c("span", {
                                                    domProps: {
                                                      innerHTML: _vm._s(
                                                        _vm.highlight(
                                                          props.item.website
                                                        )
                                                      )
                                                    }
                                                  })
                                                ]
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            {
                                              staticClass: "text-xs-left",
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c("span", {
                                                domProps: {
                                                  innerHTML: _vm._s(
                                                    _vm.highlight(
                                                      props.item.email
                                                    )
                                                  )
                                                }
                                              })
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            {
                                              staticClass: "text-xs-center",
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c(
                                                "v-tooltip",
                                                { attrs: { top: "" } },
                                                [
                                                  _c(
                                                    "v-btn",
                                                    {
                                                      attrs: {
                                                        slot: "activator",
                                                        icon: "",
                                                        to:
                                                          "/employees?q=" +
                                                          props.item.name +
                                                          "&d=" +
                                                          (props.item.deleted
                                                            ? 1
                                                            : 0)
                                                      },
                                                      slot: "activator"
                                                    },
                                                    [
                                                      _c(
                                                        "v-icon",
                                                        {
                                                          attrs: {
                                                            color: "primary"
                                                          }
                                                        },
                                                        [_vm._v("contact_mail")]
                                                      )
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c("span", [
                                                    _vm._v("Show Employees")
                                                  ])
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            [
                                              _c(
                                                "v-speed-dial",
                                                {
                                                  attrs: {
                                                    direction: "left",
                                                    "open-on-hover": "",
                                                    transition:
                                                      "scale-transition"
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "v-btn",
                                                    {
                                                      attrs: {
                                                        slot: "activator",
                                                        color: "blue darken-2",
                                                        dark: "",
                                                        fab: "",
                                                        flat: ""
                                                      },
                                                      slot: "activator"
                                                    },
                                                    [
                                                      _c("v-icon", [
                                                        _vm._v("more_vert")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      _c(
                                                        "v-btn",
                                                        {
                                                          attrs: {
                                                            slot: "activator",
                                                            fab: "",
                                                            dark: "",
                                                            small: "",
                                                            color: "primary"
                                                          },
                                                          on: {
                                                            click: function(
                                                              $event
                                                            ) {
                                                              _vm.edit(
                                                                props.item
                                                              )
                                                            }
                                                          },
                                                          slot: "activator"
                                                        },
                                                        [
                                                          _c("v-icon", [
                                                            _vm._v("edit")
                                                          ])
                                                        ],
                                                        1
                                                      ),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Edit")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      !_vm.isDeleted(props.item)
                                                        ? _c(
                                                            "v-btn",
                                                            {
                                                              attrs: {
                                                                slot:
                                                                  "activator",
                                                                fab: "",
                                                                dark: "",
                                                                small: "",
                                                                color: "error"
                                                              },
                                                              on: {
                                                                click: function(
                                                                  $event
                                                                ) {
                                                                  _vm.softDelete(
                                                                    props.item
                                                                  )
                                                                }
                                                              },
                                                              slot: "activator"
                                                            },
                                                            [
                                                              _c("v-icon", [
                                                                _vm._v("delete")
                                                              ])
                                                            ],
                                                            1
                                                          )
                                                        : _vm._e(),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Delete")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      _vm.isDeleted(props.item)
                                                        ? _c(
                                                            "v-btn",
                                                            {
                                                              attrs: {
                                                                slot:
                                                                  "activator",
                                                                fab: "",
                                                                dark: "",
                                                                small: "",
                                                                color: "success"
                                                              },
                                                              on: {
                                                                click: function(
                                                                  $event
                                                                ) {
                                                                  _vm.restore(
                                                                    props.item
                                                                  )
                                                                }
                                                              },
                                                              slot: "activator"
                                                            },
                                                            [
                                                              _c("v-icon", [
                                                                _vm._v(
                                                                  "restore"
                                                                )
                                                              ])
                                                            ],
                                                            1
                                                          )
                                                        : _vm._e(),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Restore")
                                                      ])
                                                    ],
                                                    1
                                                  )
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          )
                                        ]
                                      )
                                    }
                                  }
                                ])
                              })
                            ]
                          }
                        }
                      ]),
                      model: {
                        value: _vm.selected,
                        callback: function($$v) {
                          _vm.selected = $$v
                        },
                        expression: "selected"
                      }
                    },
                    [
                      _c(
                        "v-alert",
                        {
                          attrs: {
                            slot: "no-results",
                            value: true,
                            color: "red lighten-5",
                            icon: "warning"
                          },
                          slot: "no-results"
                        },
                        [
                          _vm._v(
                            '\n                        Your search for "' +
                              _vm._s(_vm.query) +
                              '" found no companies.\n                        '
                          ),
                          !_vm.deleted
                            ? _c("span", [
                                _vm._v(
                                  " There may be deleted match, try enabling 'Show Deleted' above."
                                )
                              ])
                            : _vm._e()
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-dialog",
            {
              attrs: { persistent: "", "max-width": "900px" },
              model: {
                value: _vm.showEditor,
                callback: function($$v) {
                  _vm.showEditor = $$v
                },
                expression: "showEditor"
              }
            },
            [
              _c(
                "v-card",
                [
                  _c(
                    "v-card-title",
                    {
                      staticClass: "headline blue darken-2",
                      attrs: { "primary-title": "" }
                    },
                    [
                      _c(
                        "span",
                        {
                          staticClass:
                            "headline font-weight-light text-uppercase white--text"
                        },
                        [
                          _vm.isDeleted(_vm.currentObj)
                            ? _c("span", [_vm._v("Restore")])
                            : _c("span", {
                                domProps: { textContent: _vm._s(_vm.action) }
                              }),
                          _vm._v(
                            "\n                    Company\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { icon: "", dark: "", flat: "" },
                          on: { click: _vm.closeEditor }
                        },
                        [_c("v-icon", [_vm._v("close")])],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-text",
                    [
                      _c(
                        "v-container",
                        { attrs: { "grid-list-md": "" } },
                        [
                          _c(
                            "v-layout",
                            { attrs: { wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm6: "" } },
                                [
                                  _c(
                                    "v-form",
                                    {
                                      ref: "form",
                                      attrs: {
                                        "lazy-validation": "",
                                        autocomplete: "off"
                                      },
                                      model: {
                                        value: _vm.formIsValid,
                                        callback: function($$v) {
                                          _vm.formIsValid = $$v
                                        },
                                        expression: "formIsValid"
                                      }
                                    },
                                    [
                                      _vm.showEditor
                                        ? _c(
                                            "v-layout",
                                            { attrs: { wrap: "", "pa-3": "" } },
                                            [
                                              _c(
                                                "v-flex",
                                                { attrs: { xs12: "" } },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      counter: "75",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      "error-messages":
                                                        _vm.errorMessages,
                                                      label: "Company Name*",
                                                      maxlength: "75",
                                                      required: "",
                                                      rules: [
                                                        _vm.rules.required
                                                      ],
                                                      autofocus: _vm.creating,
                                                      "browser-autocomplete":
                                                        "off"
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.name,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "name",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.name"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    xs12: "",
                                                    "mt-3": ""
                                                  }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      counter: "64",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      label: "Email",
                                                      maxlength: "64",
                                                      type: "email",
                                                      rules: [_vm.rules.email],
                                                      "browser-autocomplete":
                                                        "off"
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.email,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "email",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.email"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    xs12: "",
                                                    "mt-3": ""
                                                  }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      counter: "50",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      label: "Website",
                                                      maxlength: "50",
                                                      rules: [
                                                        _vm.rules.http,
                                                        _vm.rules.url
                                                      ],
                                                      "browser-autocomplete":
                                                        "off"
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.website,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "website",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.website"
                                                    }
                                                  })
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          )
                                        : _vm._e()
                                    ],
                                    1
                                  )
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                {
                                  staticStyle: { "min-height": "500px" },
                                  attrs: { xs12: "", sm6: "", "pa-3": "" }
                                },
                                [
                                  _c(
                                    "v-card",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value:
                                            _vm.isDeleted(_vm.currentObj) &&
                                            _vm.updating,
                                          expression:
                                            "isDeleted(currentObj) && updating"
                                        }
                                      ],
                                      attrs: { raised: "", fluid: "" }
                                    },
                                    [
                                      _c("v-img", {
                                        attrs: {
                                          src: _vm.currentLogo,
                                          contain: true
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !_vm.isDeleted(_vm.currentObj),
                                          expression: "!isDeleted(currentObj)"
                                        }
                                      ]
                                    },
                                    [
                                      _c(
                                        "cd-uploader",
                                        {
                                          attrs: {
                                            currentImage: _vm.currentLogo,
                                            allowedTypes: [
                                              "image/jpeg",
                                              "image/png"
                                            ],
                                            browse: "select an image file",
                                            note:
                                              "Please upload the company's logo in either PNG or JPG format, minimum 400 x 400 pixels.",
                                            resetUploader: _vm.resetTimeStamp
                                          },
                                          on: {
                                            snackMessage: function($event) {
                                              _vm.alert($event, "success")
                                            },
                                            oops: function($event) {
                                              _vm.alert($event, "warning", 5000)
                                            },
                                            uploadPending: function($event) {
                                              _vm.toggleUploadPending($event)
                                            },
                                            fileName: function($event) {
                                              _vm.currentObj.new_logo = $event
                                            }
                                          }
                                        },
                                        [
                                          _c(
                                            "span",
                                            {
                                              attrs: { slot: "changeFile" },
                                              slot: "changeFile"
                                            },
                                            [_vm._v("Change Logo")]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "span",
                                            {
                                              attrs: { slot: "rememberToSave" },
                                              slot: "rememberToSave"
                                            },
                                            [
                                              _c(
                                                "strong",
                                                { staticClass: "red--text" },
                                                [_vm._v(" N.B.")]
                                              ),
                                              _vm._v(
                                                " Remember to save this company to have the logo saved to the database.\n                                    "
                                              )
                                            ]
                                          )
                                        ]
                                      )
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("small", [
                        _vm.isDeleted(_vm.currentObj)
                          ? _c(
                              "div",
                              { staticClass: "font-weight-bold mb-2" },
                              [
                                _vm._v(
                                  " You will need to restore this company before it can be edited."
                                )
                              ]
                            )
                          : _vm._e(),
                        _vm._v(
                          "\n                        * indicates a required field.\n                    "
                        )
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-divider"),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _vm.isDeleted(_vm.currentObj)
                        ? _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.restoring,
                                color: "success darken-1",
                                flat: ""
                              },
                              on: {
                                click: function($event) {
                                  _vm.restore(_vm.currentObj)
                                }
                              }
                            },
                            [_vm._v("Restore")]
                          )
                        : _c(
                            "div",
                            [
                              _vm.uploadPending
                                ? _c(
                                    "span",
                                    [
                                      _c(
                                        "span",
                                        { staticClass: "gray--text my-2" },
                                        [
                                          _vm._v(
                                            "Please upload logo to continue"
                                          )
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _vm.uploadPending
                                        ? _c(
                                            "v-btn",
                                            {
                                              attrs: {
                                                small: "",
                                                color: "blue darken-1",
                                                flat: ""
                                              },
                                              on: {
                                                click: function($event) {
                                                  _vm.uploadPending = false
                                                }
                                              }
                                            },
                                            [_vm._v("Ignore logo change")]
                                          )
                                        : _vm._e()
                                    ],
                                    1
                                  )
                                : _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        disabled: _vm.saving,
                                        color: "blue darken-1",
                                        flat: ""
                                      },
                                      on: { click: _vm.save }
                                    },
                                    [
                                      _vm._v(
                                        "\n                            Save\n                        "
                                      )
                                    ]
                                  )
                            ],
                            1
                          ),
                      _vm._v(" "),
                      _c("v-spacer"),
                      _vm._v(" "),
                      !_vm.isDeleted(_vm.currentObj) && _vm.updating
                        ? _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.deleting,
                                color: "error darken-1",
                                flat: ""
                              },
                              on: {
                                click: function($event) {
                                  _vm.softDelete(_vm.currentObj)
                                }
                              }
                            },
                            [_vm._v("Delete")]
                          )
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-dialog",
            {
              attrs: { "max-width": "290" },
              model: {
                value: _vm.closeWithPendingUpload,
                callback: function($$v) {
                  _vm.closeWithPendingUpload = $$v
                },
                expression: "closeWithPendingUpload"
              }
            },
            [
              _c(
                "v-card",
                [
                  _c("v-card-title", { staticClass: "headline" }, [
                    _vm._v("Are you sure?")
                  ]),
                  _vm._v(" "),
                  _c("v-card-text", { staticClass: "text-sm-center" }, [
                    _c("div", { staticClass: "text--blue" }, [
                      _vm._v(
                        "You have selected a new logo, but you have not uploaded it."
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "subheading font-weight-bold mt-3" },
                      [_vm._v("Continue to close the editor?")]
                    )
                  ]),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { color: "green darken-1", flat: "flat" },
                          on: {
                            click: function($event) {
                              _vm.closeWithPendingUpload = false
                            }
                          }
                        },
                        [
                          _vm._v(
                            "\n                        Oops, No!\n                    "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { color: "green darken-1", flat: "flat" },
                          on: {
                            click: function($event) {
                              _vm.closeEditor("yes")
                            }
                          }
                        },
                        [
                          _vm._v(
                            "\n                        Yes\n                    "
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/employees.vue?vue&type=template&id=f37fc16c&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/employees.vue?vue&type=template&id=f37fc16c& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("v-progress-linear", {
        staticClass: "ma-0",
        attrs: { indeterminate: _vm.isLoading }
      }),
      _vm._v(" "),
      _c(
        "v-container",
        [
          _c(
            "v-layout",
            { attrs: { wrap: "" } },
            [
              _c(
                "v-flex",
                { staticClass: "xs12 font-weight-light display-1 py-4" },
                [_vm._v("\n                EMPLOYEES\n            ")]
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { attrs: { xs6: "" } },
                [
                  _c("v-text-field", {
                    attrs: {
                      "prepend-icon": "search",
                      label: "Search",
                      clearable: ""
                    },
                    model: {
                      value: _vm.query,
                      callback: function($$v) {
                        _vm.query = $$v
                      },
                      expression: "query"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { attrs: { xs3: "" } },
                [
                  _c("v-checkbox", {
                    attrs: { label: "Show Deleted" },
                    model: {
                      value: _vm.deleted,
                      callback: function($$v) {
                        _vm.deleted = $$v
                      },
                      expression: "deleted"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-flex",
                { staticClass: "text-sm-right", attrs: { xs3: "" } },
                [
                  _c(
                    "v-btn",
                    {
                      staticClass: "white--text mt-3 mr-0",
                      attrs: { color: "primary" },
                      on: {
                        click: function($event) {
                          _vm.edit()
                        }
                      }
                    },
                    [
                      _c("v-icon", { attrs: { small: "", dark: "" } }, [
                        _vm._v("add")
                      ]),
                      _vm._v("\n                    Create\n                ")
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-layout",
            { attrs: { wrap: "", "mt-2": "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "" } },
                [
                  _c(
                    "v-data-table",
                    {
                      attrs: {
                        headers: _vm.headers,
                        items: _vm.employees,
                        "item-key": "id",
                        "rows-per-page-items": [5, 10, 25],
                        pagination: _vm.paginator,
                        "total-items": _vm.paginator.totalItems
                      },
                      on: {
                        "update:pagination": [
                          function($event) {
                            _vm.paginator = $event
                          },
                          _vm.loadEmployees
                        ]
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "items",
                          fn: function(props) {
                            return [
                              _c("v-hover", {
                                scopedSlots: _vm._u([
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var hover = ref.hover
                                      return _c(
                                        "tr",
                                        { attrs: { active: props.selected } },
                                        [
                                          _c(
                                            "td",
                                            {
                                              staticClass: "text-xs-left",
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c(
                                                "a",
                                                {
                                                  on: {
                                                    click: function($event) {
                                                      _vm.edit(props.item)
                                                    }
                                                  }
                                                },
                                                [
                                                  _c("span", {
                                                    domProps: {
                                                      innerHTML: _vm._s(
                                                        _vm.highlight(
                                                          props.item.first_name
                                                        )
                                                      )
                                                    }
                                                  }),
                                                  _vm._v(" "),
                                                  _c("span", {
                                                    domProps: {
                                                      innerHTML: _vm._s(
                                                        _vm.highlight(
                                                          props.item.last_name
                                                        )
                                                      )
                                                    }
                                                  })
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "body-1 grey--text text--lighten-1"
                                                },
                                                [
                                                  _c("span", {
                                                    domProps: {
                                                      innerHTML: _vm._s(
                                                        _vm.highlight(
                                                          _vm.companyName(
                                                            props.item
                                                          )
                                                        )
                                                      )
                                                    }
                                                  })
                                                ]
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            {
                                              staticClass: "text-xs-left",
                                              class: {
                                                deleted: _vm.isDeleted(
                                                  props.item
                                                )
                                              }
                                            },
                                            [
                                              _c("span", {
                                                domProps: {
                                                  innerHTML: _vm._s(
                                                    _vm.highlight(
                                                      props.item.email
                                                    )
                                                  )
                                                }
                                              }),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "body-1 grey--text text--lighten-1"
                                                },
                                                [
                                                  _c("span", {
                                                    domProps: {
                                                      innerHTML: _vm._s(
                                                        _vm.highlight(
                                                          props.item.phone
                                                        )
                                                      )
                                                    }
                                                  })
                                                ]
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "td",
                                            [
                                              _c(
                                                "v-speed-dial",
                                                {
                                                  attrs: {
                                                    direction: "left",
                                                    "open-on-hover": "",
                                                    transition:
                                                      "scale-transition"
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "v-btn",
                                                    {
                                                      attrs: {
                                                        slot: "activator",
                                                        color: "blue darken-2",
                                                        dark: "",
                                                        fab: "",
                                                        flat: ""
                                                      },
                                                      slot: "activator"
                                                    },
                                                    [
                                                      _c("v-icon", [
                                                        _vm._v("more_vert")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      _c(
                                                        "v-btn",
                                                        {
                                                          attrs: {
                                                            slot: "activator",
                                                            fab: "",
                                                            dark: "",
                                                            small: "",
                                                            color: "primary"
                                                          },
                                                          on: {
                                                            click: function(
                                                              $event
                                                            ) {
                                                              _vm.edit(
                                                                props.item
                                                              )
                                                            }
                                                          },
                                                          slot: "activator"
                                                        },
                                                        [
                                                          _c("v-icon", [
                                                            _vm._v("edit")
                                                          ])
                                                        ],
                                                        1
                                                      ),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Edit")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      !_vm.isDeleted(props.item)
                                                        ? _c(
                                                            "v-btn",
                                                            {
                                                              attrs: {
                                                                slot:
                                                                  "activator",
                                                                fab: "",
                                                                dark: "",
                                                                small: "",
                                                                color: "error"
                                                              },
                                                              on: {
                                                                click: function(
                                                                  $event
                                                                ) {
                                                                  _vm.softDelete(
                                                                    props.item
                                                                  )
                                                                }
                                                              },
                                                              slot: "activator"
                                                            },
                                                            [
                                                              _c("v-icon", [
                                                                _vm._v("delete")
                                                              ])
                                                            ],
                                                            1
                                                          )
                                                        : _vm._e(),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Delete")
                                                      ])
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "v-tooltip",
                                                    { attrs: { top: "" } },
                                                    [
                                                      _vm.isDeleted(props.item)
                                                        ? _c(
                                                            "v-btn",
                                                            {
                                                              attrs: {
                                                                slot:
                                                                  "activator",
                                                                fab: "",
                                                                dark: "",
                                                                small: "",
                                                                color: "success"
                                                              },
                                                              on: {
                                                                click: function(
                                                                  $event
                                                                ) {
                                                                  _vm.restore(
                                                                    props.item
                                                                  )
                                                                }
                                                              },
                                                              slot: "activator"
                                                            },
                                                            [
                                                              _c("v-icon", [
                                                                _vm._v(
                                                                  "restore"
                                                                )
                                                              ])
                                                            ],
                                                            1
                                                          )
                                                        : _vm._e(),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v("Restore")
                                                      ])
                                                    ],
                                                    1
                                                  )
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          )
                                        ]
                                      )
                                    }
                                  }
                                ])
                              })
                            ]
                          }
                        }
                      ]),
                      model: {
                        value: _vm.selected,
                        callback: function($$v) {
                          _vm.selected = $$v
                        },
                        expression: "selected"
                      }
                    },
                    [
                      _c(
                        "v-alert",
                        {
                          attrs: {
                            slot: "no-results",
                            value: true,
                            color: "error",
                            icon: "warning"
                          },
                          slot: "no-results"
                        },
                        [
                          _vm._v(
                            '\n                        Your search for "' +
                              _vm._s(_vm.query) +
                              '" found no employees.\n                        '
                          ),
                          !_vm.deleted
                            ? _c("span", [
                                _vm._v(
                                  " There may be deleted match, try enabling 'Show Deleted' above."
                                )
                              ])
                            : _vm._e()
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-dialog",
            {
              attrs: { persistent: "", "max-width": "900px" },
              model: {
                value: _vm.showEditor,
                callback: function($$v) {
                  _vm.showEditor = $$v
                },
                expression: "showEditor"
              }
            },
            [
              _c(
                "v-card",
                [
                  _c(
                    "v-card-title",
                    {
                      staticClass: "headline blue darken-2",
                      attrs: { "primary-title": "" }
                    },
                    [
                      _c(
                        "span",
                        {
                          staticClass:
                            "headline font-weight-light text-uppercase white--text"
                        },
                        [
                          _vm.isDeleted(_vm.currentObj)
                            ? _c("span", [_vm._v("Restore")])
                            : _c("span", {
                                domProps: { textContent: _vm._s(_vm.action) }
                              }),
                          _vm._v(
                            "\n                    Company\n                "
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { icon: "", dark: "", flat: "" },
                          on: {
                            click: function($event) {
                              _vm.showEditor = false
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("close")])],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-text",
                    [
                      _c(
                        "v-container",
                        { attrs: { "grid-list-md": "" } },
                        [
                          _c(
                            "v-layout",
                            { attrs: { wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                { attrs: { xs12: "" } },
                                [
                                  _c(
                                    "v-form",
                                    {
                                      ref: "form",
                                      attrs: {
                                        autocomplete: "off",
                                        autofill: "off",
                                        "lazy-validation": ""
                                      },
                                      model: {
                                        value: _vm.formIsValid,
                                        callback: function($$v) {
                                          _vm.formIsValid = $$v
                                        },
                                        expression: "formIsValid"
                                      }
                                    },
                                    [
                                      _vm.showEditor
                                        ? _c(
                                            "v-layout",
                                            { attrs: { wrap: "", "pa-3": "" } },
                                            [
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: { xs12: "", sm6: "" }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      autofocus: _vm.creating,
                                                      "browser-autocomplete":
                                                        "off",
                                                      counter: "75",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      "error-messages":
                                                        _vm.errorMessages,
                                                      label: "First Name*",
                                                      maxlength: "75",
                                                      required: "",
                                                      rules: [
                                                        _vm.rules.required
                                                      ]
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj
                                                          .first_name,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "first_name",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.first_name"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: { xs12: "", sm6: "" }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      "browser-autocomplete":
                                                        "off",
                                                      counter: "75",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      "error-messages":
                                                        _vm.errorMessages,
                                                      label: "Last Name*",
                                                      maxlength: "75",
                                                      required: "",
                                                      rules: [
                                                        _vm.rules.required
                                                      ]
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj
                                                          .last_name,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "last_name",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.last_name"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    xs12: "",
                                                    sm6: "",
                                                    "mt-3": ""
                                                  }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      "browser-autocomplete":
                                                        "off",
                                                      counter: "64",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      label: "Email",
                                                      maxlength: "64",
                                                      rules: [_vm.rules.email],
                                                      type: "email"
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.email,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "email",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.email"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: {
                                                    xs12: "",
                                                    sm6: "",
                                                    "mt-3": ""
                                                  }
                                                },
                                                [
                                                  _c("v-text-field", {
                                                    attrs: {
                                                      "browser-autocomplete":
                                                        "off",
                                                      counter: "50",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      label: "Phone Number",
                                                      maxlength: "50"
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.phone,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "phone",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.phone"
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "v-flex",
                                                {
                                                  attrs: { x12: "", "mt-3": "" }
                                                },
                                                [
                                                  _c("v-autocomplete", {
                                                    attrs: {
                                                      autofill: "off",
                                                      "browser-autocomplete":
                                                        "off",
                                                      clearable: "",
                                                      disabled: _vm.isDeleted(
                                                        _vm.currentObj
                                                      ),
                                                      items:
                                                        _vm.autocompleteCompanies,
                                                      "hide-no-data": "",
                                                      "item-text": "name",
                                                      "item-value": "id",
                                                      label: "Company",
                                                      loading: _vm.loading,
                                                      placeholder:
                                                        "Start typing to search",
                                                      "return-object": "",
                                                      rules: [_vm.rules.hasId],
                                                      "search-input":
                                                        _vm.companyAutocompleteSearch
                                                    },
                                                    on: {
                                                      "update:searchInput": function(
                                                        $event
                                                      ) {
                                                        _vm.companyAutocompleteSearch = $event
                                                      }
                                                    },
                                                    model: {
                                                      value:
                                                        _vm.currentObj.company,
                                                      callback: function($$v) {
                                                        _vm.$set(
                                                          _vm.currentObj,
                                                          "company",
                                                          $$v
                                                        )
                                                      },
                                                      expression:
                                                        "currentObj.company"
                                                    }
                                                  })
                                                ],
                                                1
                                              )
                                            ],
                                            1
                                          )
                                        : _vm._e()
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("small", [
                        _vm.isDeleted(_vm.currentObj)
                          ? _c(
                              "div",
                              { staticClass: "font-weight-bold mb-2" },
                              [
                                _vm.currentObj.company.deleted
                                  ? _c("div", [
                                      _c("a", {
                                        attrs: {
                                          href:
                                            "/app#/companies?d=1&q=" +
                                            _vm.currentObj.company.name
                                        },
                                        domProps: {
                                          textContent: _vm._s(
                                            _vm.currentObj.company.name
                                          )
                                        }
                                      }),
                                      _vm._v(
                                        " is currently deleted, you will need to restore this company before you can edit this employee.\n                            "
                                      )
                                    ])
                                  : _c("div", [
                                      _vm._v(
                                        "\n                                You will need to restore this employee before they can be edited.\n                            "
                                      )
                                    ])
                              ]
                            )
                          : _vm._e(),
                        _vm._v(
                          "\n                        * indicates a required field.\n                    "
                        )
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-divider"),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _vm.isDeleted(_vm.currentObj)
                        ? _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.restoring,
                                color: "success darken-1",
                                flat: ""
                              },
                              on: {
                                click: function($event) {
                                  _vm.restore(_vm.currentObj)
                                }
                              }
                            },
                            [_vm._v("Restore")]
                          )
                        : _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.saving,
                                color: "blue darken-1",
                                flat: ""
                              },
                              on: { click: _vm.save }
                            },
                            [_vm._v("Save")]
                          ),
                      _vm._v(" "),
                      _c("v-spacer"),
                      _vm._v(" "),
                      !_vm.isDeleted(_vm.currentObj) && _vm.updating
                        ? _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.deleting,
                                color: "error darken-1",
                                flat: ""
                              },
                              on: {
                                click: function($event) {
                                  _vm.softDelete(_vm.currentObj)
                                }
                              }
                            },
                            [_vm._v("Delete")]
                          )
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.componentIsMounted,
          expression: "componentIsMounted"
        }
      ]
    },
    [
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.fileAdded && !_vm.hasDefaultImage,
              expression: "!fileAdded && !hasDefaultImage"
            }
          ]
        },
        [
          _c("div", { attrs: { id: _vm.id } }),
          _vm._v(" "),
          _vm.hasDefaultImage
            ? _c(
                "v-btn",
                {
                  staticClass: "mr-0 float-right",
                  attrs: { flat: "", color: "orange" },
                  on: { click: _vm.revertToOriginal }
                },
                [_vm._t("seeOriginal", [_vm._v("Revert to Original")])],
                2
              )
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-card",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.fileAdded || _vm.hasDefaultImage,
              expression: "fileAdded || hasDefaultImage"
            }
          ],
          attrs: { raised: "", fluid: "" }
        },
        [
          _c(
            "div",
            { staticStyle: { "min-height": "385px !important" } },
            [
              _vm.previewImage.src
                ? _c("v-img", {
                    attrs: { src: _vm.previewImage.src, contain: true }
                  })
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-card-actions",
            [
              _vm.uploaded
                ? _c(
                    "v-btn",
                    { attrs: { flat: "", disabled: true } },
                    [
                      _vm._v("\n                UPLOADED\n                "),
                      _c(
                        "v-icon",
                        {
                          staticClass: "ml-1",
                          attrs: { small: "", color: "success", dark: "" }
                        },
                        [_vm._v("done")]
                      )
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              !_vm.hasDefaultImage && !_vm.uploaded
                ? _c(
                    "v-btn",
                    {
                      attrs: { flat: "", color: "primary" },
                      on: { click: _vm.uploadFile }
                    },
                    [
                      _vm.uploading
                        ? _c("span", [
                            _vm._v(
                              "\n                        Uploading ...\n                    "
                            )
                          ])
                        : _c(
                            "span",
                            [
                              _vm._v(
                                "\n                        Upload\n                        "
                              ),
                              _c(
                                "v-icon",
                                {
                                  staticClass: "ml-1",
                                  attrs: { small: "", dark: "" }
                                },
                                [_vm._v("cloud_upload")]
                              )
                            ],
                            1
                          )
                    ]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              !_vm.uploading
                ? _c(
                    "v-btn",
                    {
                      staticClass: "float-right",
                      attrs: { flat: "", color: "primary" },
                      on: { click: _vm.clearUploader }
                    },
                    [_vm._t("changeFile", [_vm._v("Change Logo")])],
                    2
                  )
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-card-title",
            { staticClass: "pt-0" },
            [
              _vm.uploading
                ? _c("v-progress-linear", {
                    attrs: {
                      "background-color": "info",
                      "background-opacity": "0.2",
                      buffer: ""
                    },
                    model: {
                      value: _vm.progress,
                      callback: function($$v) {
                        _vm.progress = $$v
                      },
                      expression: "progress"
                    }
                  })
                : _vm._e(),
              _vm._v(" "),
              _vm.uploaded
                ? _c("div", { staticClass: "text-center" }, [
                    _c(
                      "span",
                      { staticClass: "caption grey--text text--lighten-1" },
                      [
                        _vm._t("rememberToSave", [
                          _c("strong", { staticClass: "red--text" }, [
                            _vm._v(" N.B.")
                          ]),
                          _vm._v(" Remember to save.\n                    ")
                        ])
                      ],
                      2
                    )
                  ])
                : _vm._e()
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./resources/js/ajax-mixin.js":
/*!************************************!*\
  !*** ./resources/js/ajax-mixin.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  computed: {
    autocompleteCompanies: function autocompleteCompanies() {
      var self = this;
      if (!_.has(self, 'companies') || !_.isArray(self.companies)) return [];
      return self.companies.map(function (company) {
        var description = '';

        if (_.has(company, 'name') && company.name.length > self.companyNameLengthLimit) {
          company.name = company.name.slice(0, self.companyNameLengthLimit) + '...';
        }

        return company;
      });
    },
    isLoading: function isLoading() {
      var self = this;
      return self.loading || self.saving || self.deleting || self.restoring;
    },
    reloadTrigger: function reloadTrigger() {
      var self = this;
      return [self.query, self.deleted].join('');
    }
  },
  data: function data() {
    return {
      collectionLoader: '',
      companies: [],
      companyNameLengthLimit: 60,
      companyAutocompleteSearch: '',
      currentObj: {},
      deleted: 0,
      deleting: false,
      employees: [],
      noRecords: false,
      loading: false,
      originalObj: {},
      paginator: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        totalItems: 0
      },
      query: '',
      restoring: false,
      saving: false,
      selected: [],
      serverReturned: false
    };
  },
  methods: {
    debouncedLoader: _.debounce(function (loader) {
      var self = this;
      self.setValue(self.paginator, 'page', 1);
      self[loader]();
    }, 500),
    edit: function edit(obj) {
      var self = this;
      var obj = obj || null; // Reset.

      self.resetForm();
      self.resetValidation();
      self.setValue(self, 'currentObj', _.clone(self.blankObj));
      self.setValue(self, 'originalObj', _.clone(self.blankObj)); // Create/Update?

      if (_.isNull(obj)) {
        self.setValue(self, 'action', 'create');
      } else {
        self.setValue(self, 'action', 'update');
        self.setValue(self, 'currentObj', _.clone(obj));
        self.setValue(self, 'originalObj', _.clone(obj));
      } // Edit.


      self.setValue(self, 'showEditor', true);
    },
    fetch: function fetch(configIn) {
      var self = this;
      var config = configIn || null;

      if (_.isNull(config)) {
        window.log('ajax-mixins.fetch: No config?!', config);
        return;
      }

      window.log('ajax-mixins.fetch: Calling server with data:', config); // Setup method

      var method = _.has(config, 'method') && !_.isEmpty(config.method) ? config.method : 'post'; // Stop multi submissions.

      if (_.has(config, 'flag') && self[config.flag]) {
        return; // in-progress
      } else {
        self.setValue(self, config.flag, true);
      } // Default success callback.


      var onSuccess = config.success || function (response) {}; // Default error callback.


      var onError = config.error || function (response) {}; // Call Server ...


      self.serverReturned = false;
      window.axios[method](config.url, config.data).then(function (success) {
        window.log('ajax-mixins.fetch: Success Response:', success);

        if (_.has(success, 'data.status') && _.isEqual(success.data.status, 'success')) {
          var successMessages = []; // General server error responses.

          if (_.has(success.data, 'messages')) {
            _.each(success.data.messages, function (value, key) {
              successMessages.push(_.isArray(value) ? value.join(', ') : value);
            });

            self.alert(successMessages.join(', ') + '.', 'success', 3000);
          }
        }

        onSuccess(success);
      }).catch(function (error) {
        window.log('ajax-mixins.fetch: Error Response:', error); // Check for bad auth.

        if (_.has(error, 'response.status') && _.isEqual(error.response.status, 403)) {
          self.alert('Either you are not authorised to access to this resource or you may have been logged out due to inactivity. Try reloading the page, if the problem persist please contact your admin to assist.', 'warning', 6000);
        } // Check for server-sent issue.


        if (_.has(error, 'response.status') && _.isEqual(error.response.status, 422)) {
          var validationErrors = []; // Request Validation issues.

          if (_.has(error, 'response.data.errors')) {
            _.each(error.response.data.errors, function (value, key) {
              validationErrors.push(_.isArray(value) ? value.join(', ') : value);
            });
          } // General server error responses.


          if (_.has(error, 'response.data.messages')) {
            _.each(error.response.data.messages, function (value, key) {
              validationErrors.push(_.isArray(value) ? value.join(', ') : value);
            });
          }

          self.alert('There was a problem with your request: ' + validationErrors.join(', ') + '. Please try again or contact your admin to assist.', 'error', 6000);
        }

        if (_.has(error, 'response.data')) {//self.processMessages(error.response.data, error.response.status);
        }

        onError(error);
      }).then(function () {
        window.log('ajax-mixins.fetch: Always called:');
        self.setValue(self, config.flag, false); // All done ..

        self.setValue(self, 'serverReturned', true);
      });
    },
    loadCompanies: function loadCompanies() {
      var self = this;
      self.fetch({
        url: '/companies/search',
        data: {
          deleted: self.deleted ? 1 : 0,
          q: self.query,
          page: self.paginator.page,
          per_page: self.paginator.rowsPerPage
        },
        success: function success(_ref) {
          var data = _ref.data;

          if (_.has(data, 'status') && data.status == 'success') {
            self.setValue(self, 'companies', []);

            if (_.has(data, 'companies') && !_.isEmpty(data.companies)) {
              _.each(data.companies, function (company) {
                company.new_logo = '';
                self.companies.push(company);
              });

              if (_.has(data, 'pagination') && !_.isEmpty(data.pagination)) {
                self.setValue(self, 'paginator', data.pagination);
              }
            }
          }
        },
        flag: 'loading'
      });
    },
    loadEmployees: function loadEmployees() {
      var self = this;
      self.fetch({
        url: '/employees/search',
        data: {
          deleted: self.deleted ? 1 : 0,
          q: self.query,
          page: self.paginator.page,
          per_page: self.paginator.rowsPerPage
        },
        success: function success(_ref2) {
          var data = _ref2.data;

          if (_.has(data, 'status') && data.status == 'success') {
            self.setValue(self, 'employees', []);

            if (_.has(data, 'employees') && !_.isEmpty(data.employees)) {
              _.each(data.employees, function (employee) {
                self.employees.push(employee);
              });

              if (_.has(data, 'pagination') && !_.isEmpty(data.pagination)) {
                self.setValue(self, 'paginator', data.pagination);
              }
            }
          }
        },
        flag: 'loading'
      });
    },
    restore: function restore(obj) {
      var self = this;
      var obj = obj || null;
      if (self.restoring || _.isNull(obj) && _.has(obj, 'id')) return;
      self.fetch({
        url: '/' + self.currentObjType + '/restore',
        data: {
          id: obj.id
        },
        success: function success(_ref3) {
          var data = _ref3.data;

          if (_.has(data, 'status') && data.status == 'success') {
            self.debouncedLoader(self.collectionLoader);
            self.setValue(self, 'showEditor', false);
          }
        },
        flag: 'restoring'
      });
    },
    searchCompanies: function searchCompanies() {
      var self = this;
      self.fetch({
        url: '/companies/search',
        data: {
          deleted: 1,
          q: self.companyAutocompleteSearch,
          page: 1,
          per_page: self.paginator.rowsPerPage
        },
        success: function success(_ref4) {
          var data = _ref4.data;

          if (_.has(data, 'status') && data.status == 'success') {
            self.setValue(self, 'companies', []);

            if (_.has(data, 'companies') && !_.isEmpty(data.companies)) {
              _.each(data.companies, function (company) {
                self.companies.push(company);
              });
            }
          }
        },
        flag: 'loading'
      });
    },
    softDelete: function softDelete(obj) {
      var self = this;
      var obj = obj || null;
      if (self.deleting || _.isNull(obj) && _.has(obj, 'id')) return;
      self.fetch({
        url: '/' + self.currentObjType + '/delete',
        data: {
          id: obj.id
        },
        success: function success(_ref5) {
          var data = _ref5.data;

          if (_.has(data, 'status') && data.status == 'success') {
            self.debouncedLoader(self.collectionLoader);
            self.setValue(self, 'showEditor', false);
          }
        },
        flag: 'deleting'
      });
    }
  },
  watch: {
    companyAutocompleteSearch: function companyAutocompleteSearch() {
      var self = this;
      self.searchCompanies();
    },
    reloadTrigger: function reloadTrigger() {
      var self = this;
      self.debouncedLoader(self.collectionLoader);
    }
  }
};

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_companies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/companies */ "./resources/js/components/companies.vue");
/* harmony import */ var _components_employees__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/employees */ "./resources/js/components/employees.vue");
/**
 * Bootstrap that app. // That not the ccs lib :)
 */
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
/**
 * Create Global Event Bus
 */


window.EventBus = new Vue();
/**
 * Setup Libraries.
 */

Vue.use(Vuetify);
Vue.use(VueRouter);
/**
 * Views.
 */



var router = new VueRouter({
  routes: [{
    path: '/companies',
    component: _components_companies__WEBPACK_IMPORTED_MODULE_0__["default"]
  }, {
    path: '/employees',
    component: _components_employees__WEBPACK_IMPORTED_MODULE_1__["default"]
  }, {
    path: '*',
    redirect: '/companies'
  }]
});
var app = new Vue({
  data: {
    currentScreenWidth: 0,
    currentScreenHeight: 0,
    snackAlert: false,
    snackMessage: '',
    snackStatus: 'info',
    snackTimeout: 3000
  },
  el: '#app',
  methods: {
    gt: function gt(size) {
      var self = this;
      return self.currentScreenWidth > size;
    },
    lt: function lt(size) {
      var self = this;
      return self.currentScreenWidth < size;
    },
    logout: function logout() {
      window.log('Doing Logout');
      axios.post('/logout').then(function (response) {
        window.log('Logged Out');
      });
    },
    init: function init() {
      var self = this;
      window.addEventListener('resize', function (event) {
        self.updateScreenSize();
      });
      Vue.nextTick(function () {
        self.updateScreenSize();
      });
    },
    isCurrentPath: function isCurrentPath(path) {
      var self = this;
      return _.isEqual(self.$route.path, path);
    },
    showSnackMessage: function showSnackMessage(data) {
      var self = this;
      var data = data || null;

      if (!_.isNull(data) && _.has(data, 'message')) {
        self.$set(self, 'snackMessage', data.message);
        self.$set(self, 'snackStatus', data.status);
        self.$set(self, 'snackTimeout', data.timeout);
        self.$set(self, 'snackAlert', true);
      }
    },
    updateScreenSize: function updateScreenSize() {
      var self = this;
      self.$set(self, 'currentScreenWidth', window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
      self.$set(self, 'currentScreenHeight', window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    }
  },
  mounted: function mounted() {
    var self = this;
    self.init(); // Wait for snack messages.

    EventBus.$on('snackmessage', function (data) {
      self.showSnackMessage(data);
    });
    window.log('Application Mounted.');
  },
  router: router
});

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Setup Debugging.
 * usage: log('inside coolFunc',this,arguments); http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
window.debugLS = true;

window.log = function () {
  if (!window.edb) return;
  log.history = log.history || []; // store logs to an array for reference

  log.history.push(arguments);

  if (this.console) {
    console.log(Array.prototype.slice.call(arguments));
  } // console.trace('callers ..'); // (if backtrace is needed.)

};
/**
 * Axios for XHR
 */


window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; // Catch Ajax errors.

window.axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  var originalRequest = error.config; // Logged out (no auth)

  if (error.response.status === 401 || error.response.status === 419) {
    window.location.href = '/';
    return;
  } // Do something with response error


  return Promise.reject(error);
});
/**
 * CSRF Injection.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/***/ }),

/***/ "./resources/js/components/companies.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/companies.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./companies.vue?vue&type=template&id=0c42f6a0& */ "./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0&");
/* harmony import */ var _companies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./companies.vue?vue&type=script&lang=js& */ "./resources/js/components/companies.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _companies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/companies.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/companies.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/components/companies.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_companies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./companies.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/companies.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_companies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0&":
/*!******************************************************************************!*\
  !*** ./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./companies.vue?vue&type=template&id=0c42f6a0& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/companies.vue?vue&type=template&id=0c42f6a0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_companies_vue_vue_type_template_id_0c42f6a0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/employees.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/employees.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./employees.vue?vue&type=template&id=f37fc16c& */ "./resources/js/components/employees.vue?vue&type=template&id=f37fc16c&");
/* harmony import */ var _employees_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./employees.vue?vue&type=script&lang=js& */ "./resources/js/components/employees.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _employees_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/employees.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/employees.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/components/employees.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_employees_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./employees.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/employees.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_employees_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/employees.vue?vue&type=template&id=f37fc16c&":
/*!******************************************************************************!*\
  !*** ./resources/js/components/employees.vue?vue&type=template&id=f37fc16c& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./employees.vue?vue&type=template&id=f37fc16c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/employees.vue?vue&type=template&id=f37fc16c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_employees_vue_vue_type_template_id_f37fc16c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/uploader.vue":
/*!**********************************************!*\
  !*** ./resources/js/components/uploader.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uploader.vue?vue&type=template&id=6b590e8e& */ "./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e&");
/* harmony import */ var _uploader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uploader.vue?vue&type=script&lang=js& */ "./resources/js/components/uploader.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _uploader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/uploader.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/uploader.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/components/uploader.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_uploader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./uploader.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/uploader.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_uploader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e&":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./uploader.vue?vue&type=template&id=6b590e8e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/uploader.vue?vue&type=template&id=6b590e8e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uploader_vue_vue_type_template_id_6b590e8e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/form-mixin.js":
/*!************************************!*\
  !*** ./resources/js/form-mixin.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  data: function data() {
    return {
      deleted: 0,
      errorMessages: '',
      formIsValid: true,
      rules: {
        required: function required(value) {
          return !!value || 'Required.';
        },
        hasId: function hasId(value) {
          return !!_.has(value, 'id') || 'Required.';
        },
        email: function email(value) {
          var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid or incomplete e-mail.';
        },
        url: function url(value) {
          var pattern = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
          return pattern.test(value) || _.isEmpty(value) || 'Invalid or incomplete website, E.g. https://my.website.com';
        },
        http: function http(value) {
          var pattern = /^(http|https):\/\/(.*)/i;
          return pattern.test(value) || _.isEmpty(value) || 'It should begin with http(s)://';
        }
      },
      showEditor: false
    };
  },
  methods: {
    resetForm: function resetForm() {
      var self = this;
      self.$refs.form.reset();
    },
    resetValidation: function resetValidation() {
      var self = this;
      self.$refs.form.resetValidation();
    },
    validate: function validate() {
      var self = this;
      return self.$refs.form.validate();
    }
  }
};

/***/ }),

/***/ "./resources/js/shared-methods-mixin.js":
/*!**********************************************!*\
  !*** ./resources/js/shared-methods-mixin.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  computed: {
    creating: function creating() {
      var self = this;
      return _.has(self, 'action') && _.isEqual(self.action, 'create');
    },
    updating: function updating() {
      var self = this;
      return _.has(self, 'action') && _.isEqual(self.action, 'update');
    }
  },
  data: function data() {
    return {
      action: ''
    };
  },
  methods: {
    alert: function alert(message, status, timeout) {
      var self = this;
      var status = status || 'success';
      var message = message || null;
      var timeout = timeout || 3000;
      if (_.isNull(message)) return;
      var messagePacket = {
        message: message,
        status: status,
        timeout: timeout
      };
      EventBus.$emit('snackmessage', messagePacket);
    },
    clear: function clear(field, value) {
      var self = this;
      var field = field || null;
      var value = value || '';
      if (_.isNull(field)) return;

      if (_.has(self, field)) {
        self.setValue(self, field, value);
      }
    },
    exists: function exists(obj, root) {
      var self = this;
      var root = root || self;
      return _.has(root, obj);
    },
    getBooleanValue: function getBooleanValue(ref) {
      var self = this;
      var ref = ref || null;

      if (_.isNull(ref) || !_.isString(ref)) {
        window.log('shared-mixins.getBooleanValue: bad string reference.');
        return '';
      }

      if (!_.has(self, ref)) {
        window.log('shared-mixins.getBooleanValue: self.' + ref + ' does not exist.');
        return '';
      }

      return _.get(self, ref) ? 1 : 0;
    },
    getNumericValue: function getNumericValue(ref) {
      var self = this;
      var ref = ref || null;

      if (_.isNull(ref) || !_.isString(ref)) {
        window.log('shared-mixins.getNumericValue: bad string reference.');
        return '';
      }

      if (!_.has(self, ref)) {
        window.log('shared-mixins.getNumericValue: self.' + ref + ' does not exist.');
        return '';
      }

      return _.toNumber(_.get(self, ref));
    },
    getStringValue: function getStringValue(ref) {
      var self = this;
      var ref = ref || null;

      if (_.isNull(ref) || !_.isString(ref)) {
        window.log('shared-mixins.getStringValue: bad string reference.');
        return '';
      }

      if (!_.has(self, ref)) {
        window.log('shared-mixins.getStringValue: self.' + ref + ' does not exist.');
        return '';
      }

      return _.get(self, ref);
    },
    hasLength: function hasLength(value) {
      var self = this;
      var value = value || null;
      if (_.isNull(value)) return false;

      if (_.isArray(value)) {
        return !_.isEmpty(value);
      } else {
        return !!_.toString(value).length;
      }
    },
    highlight: function highlight(value, field) {
      var self = this;
      var field = field || 'query';
      var value = value || ''; // Only if needed.

      if (_.has(self, field) && _.isEmpty(self[field])) {
        return value;
      } // Highlight


      if (_.has(self, field) && _.isString(self[field]) && !_.isEmpty(self[field])) {
        var keywords = self[field].replace(/\s\s+/g, ' ').split(' '); // Make sure we have search data or return original.

        if (!_.isArray(keywords) || _.isEmpty(keywords) || _.isEmpty(keywords[0])) return value;
        keywords = keywords.filter(function (n) {
          return n != undefined && n != '' && n != null;
        });
        var keywords = keywords.join('|').replace('(', '\\(').replace(')', '\\)');
        var search = new RegExp('(' + keywords + ')', 'gi');

        if (_.isString(value) && !_.isEmpty(value)) {
          var value = value.replace(search, function (match) {
            return '<span class="lime lighten-3">' + match + '</span>';
          });
        }

        return value;
      }

      return value;
    },
    isDeleted: function isDeleted(obj) {
      var self = this;
      var obj = obj || null;
      if (_.isNull(obj) || !_.has(obj, 'deleted')) return false;
      return obj.deleted;
    },
    isSelected: function isSelected(item, collectionPath, id) {
      var self = this;
      var item = item || null;
      var collectionPath = collectionPath || null;
      var id = id || 'id'; // e.g. countries uses cca2.

      if (_.isNull(item) || _.isNull(collectionPath) || !_.isString(collectionPath) || !_.has(self, collectionPath) || !_.has(item, id)) {
        window.log('shared-mixins.isSelected: Bad item, id key or collection path.');
        return false;
      }

      return !!_.find(_.get(self, collectionPath) || [], {
        'id': item[id]
      });
    },
    selectItem: function selectItem(item, collection, key) {
      var self = this;
      var item = item || null;
      var collection = collection || null;
      var key = key || 'id';
      var search = {};
      search[key] = item[key]; // Validate collection.

      if (_.isNull(collection) || !_.isArray(collection)) {
        window.log('shared-mixin.selectItem: Bad collection.');
        return;
      } // Validate Item


      if (_.isNull(item) || !_.has(item, key)) {
        window.log('shared-mixin.selectItem: Bad Item or no key.');
        return;
      } // Toggle item in collection (Add or delete).


      if (self.isSelected(item, collection)) {
        var index = _.findIndex(collection, search);

        window.log('Track', collction, index);
        collection.splice(index, 1);
      } else {
        self.setValue(collection, collection.length, item);
      }
    },
    setValue: function setValue(obj, fields, value) {
      var self = this;
      var fields = fields || null;
      var obj = obj || self;
      var value = _.isUndefined(value) ? '' : value; // false is a valid value!

      if (!_.isObject(obj)) {
        window.log('shared-methods-mixin.setValue: Cannot set fields to bad object.');
        return;
      }

      if (_.isNull(value) || _.isNull(fields)) {
        window.log('shared-methods-mixin.setValue: Cannot set fields with bad params.');
        return;
      } // Check for fields that is an index (collection update)


      if (_.isNumber(fields)) {
        var index = fields; // Just for readability.

        Vue.set(obj, index, value);
        window.log('shared-methods-mixin.setValue: Set ' + index + ' to :', value);
        return self;
      } // Check for multi-set.


      fields = _.isArray(fields) ? fields : [fields];

      _.each(fields, function (field) {
        if (_.isString(field)) {
          Vue.set(obj, field, value);
          window.log('shared-methods-mixin.setValue: Set ' + field + ' to :', value, obj);
        }
      });

      return self;
    }
  }
};

/***/ }),

/***/ 0:
/*!***********************************!*\
  !*** multi ./resources/js/app.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/david/Documents/webdev/active/cyber-duck/resources/js/app.js */"./resources/js/app.js");


/***/ })

/******/ });