(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {Tab, Tabs} = require('../src/js/index.js')

Vue.component('Tab', Tab)
Vue.component('Tabs', Tabs)

new Vue({
    el: '#app',
    data: {
        version: require('../package.json').version,
    },
})

},{"../package.json":5,"../src/js/index.js":6}],2:[function(require,module,exports){
'use strict'

var parseReg = /([^=?&]+)=?([^&]*)/g
var qFlat = require('q-flat')
var qSet = require('q-set')

/**
 * Converts an object to a query string and optionally flattens it.
 * @param  {Object} obj - the object to convert.
 * @return {String}
 */
exports.stringify = function stringify (obj, flat) {
  if (flat) obj = qFlat(obj)
  var keys = Object.keys(obj)
  if (!keys.length) return ''

  for (var i = 0, len = keys.length, key; i < len; i++) {
    key = keys[i]
    keys[i] = encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  }

  return keys.join('&')
}

/**
 * Parses a query string and optionally unflattens it.
 * @param  {String} str - the query string to parse.
 * @param  {Boolean} [deep] - if true the query will be unflattened.
 * @return {Object}
 */
exports.parse = function (str, deep) {
  var set = deep ? qSet : qSet.flat
  var result = {}
  var part

  while ((part = parseReg.exec(str))) {
    set(result, decodeURIComponent(part[1]), decodeURIComponent(part[2]))
  }

  return result
}

},{"q-flat":3,"q-set":4}],3:[function(require,module,exports){
var toString       = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @description
 * Go from regular object syntax to a querystring style object.
 *
 * @example
 * var result = unflatten({ a: { b: 1 }, c: { d: 1 } });
 * result; //-> { "a[b]": 1, "c[d]": 2 }
 *
 * @param {Object} obj
 */
function qFlat (obj, path, result) {
	var type = toString.call(obj);
	if (result == null) {
		if (type === "[object Object]") result = {};
		else if (type === "[object Array]") result = [];
		else return;
	}

	for (var key in obj) {
		var val = obj[key];
		if (val === undefined || !hasOwnProperty.call(obj, key)) continue;
		switch (toString.call(val)) {
			case "[object Array]":
			case "[object Object]":
				qFlat(val, join(path, key), result);
				break;
			default:
				result[join(path, key)] = val;
				break;
		}
	}

	return result;
}

function join (path, key) {
	return path != null
		? path + "[" + key + "]"
		: key;
}

module.exports = qFlat;

},{}],4:[function(require,module,exports){
"use strict";

var matchArray   = /[^\[\]]+|\[\]/g;
var matchInteger = /^\d+$/;
var temp         = [];

/*
 * @description
 * A setter for querystring style fields like "a[b][c]".
 * The setter will create arrays for repeat keys.
 *
 * @param {Object} obj
 * @param {String} path
 * @param {*} val
 */
function qSet (obj, path, val) {
	var keys = path === "" ? [""] : path.match(matchArray);
	var len  = keys.length;
	var cur  = obj;
	var key, prev, next, exist;

	for (var i = 0; i < len; i++) {
		prev = cur;
		key  = keys[i];
		next = keys[i + 1];
		if (key === "[]") key = cur.length;
		// Make path as we go.
		cur = (exist = typeof cur === "object" && key in cur)
			? cur[key]
			// Check if the next path is an explicit array.
			: cur[key] = (next === "[]" || matchInteger.test(next))
				? []
				: {};
	}

	prev[key] = exist ? temp.concat(cur, val) : val;

	return obj;
};

/**
 * Like qset but doesn't resolve nested params such as a[b][c].
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */
function fSet (obj, key, val) {
	key = arrayPushIndexes(obj, key);
	obj[key] = key in obj
		? temp.concat(obj[key], val)
		: val;
	return obj;
}

/**
 * Given a qs style key and an object will convert array push syntax to integers.
 * Eg: a[b][] -> a[b][0]
 *
 * @param {Object} obj
 * @param {String} key
 * @return {String}
 */
function arrayPushIndexes (obj, key) {
	var path = key.split("[]");
	if (path.length === 1) return key;
	var cur = path[0];
	var keys = Object.keys(obj);

	for (var i = 1, len = path.length; i < len; i++) {
		cur += "[" + findLastIndex(keys, cur) + "]" + path[i];
	}

	return cur;
}

/**
 * Given a path to push to will return the next valid index if possible.
 * Eg: a[b][] -> 0 // if array is empty.
 *
 * @param {Array} keys
 * @param {String} path
 * @return {Number}
 */
function findLastIndex (keys, path) {
	var last = -1;

	for (var key, i = keys.length; i--;) {
		key = keys[i];
		if (key.indexOf(path) !== 0) continue;
		key = key.replace(path, "");
		key = key.slice(1, key.indexOf("]"));
		if (key > last) last = Number(key);
	}

	return last + 1;
}

qSet.flat      = fSet;
module.exports = qSet;

},{}],5:[function(require,module,exports){
module.exports={
  "name": "vue-tabcordion",
  "version": "1.0.3",
  "description": "Simple responsive commonjs tabs component for Vue.",
  "main": "src/js/index.js",
  "peerDependencies": {
    "bulma": ">=0.2",
    "vue": ">=2"
  },
  "watch": {
    "vue": {
      "patterns": [
        "src/vue/*.vue"
      ],
      "extensions": "vue",
      "quiet": true
    },
    "demo": {
      "patterns": [
        "demo/index.js",
        "src/js/*.js"
      ],
      "extensions": "js",
      "quiet": true
    }
  },
  "scripts": {
    "vue": "fuet -c -i 'src/vue/*.vue' -p src vue -o src/js/templates.js",
    "prepublish": "fuet -c -i 'src/vue/*.vue' -p src vue -o src/js/templates.js",
    "scss": "sass src/scss/styles.scss > demo/styles.css",
    "demo": "browserify demo/index.js > demo/build.js;npm run scss;",
    "demo_publish": "npm run demo;gh-pages -d demo",
    "watch": "npm-watch"
  },
  "files": [
    "src/js/*.js",
    "src/scss/*.scss",
    "LICENSE",
    "README.md"
  ],
  "repository": "https://github.com/wearespindle/vue-tabcordion",
  "keywords": [
    "vue",
    "bulma",
    "tabs"
  ],
  "author": "Devhouse Spindle",
  "license": "MIT",
  "devDependencies": {
    "gh-pages": "^1.0.0",
    "npm-watch": "^0.1.9"
  },
  "dependencies": {
    "mini-querystring": "^1.0.2"
  }
}

},{}],6:[function(require,module,exports){
const templates = require('./templates')
const Tab = require('./tab')(templates.tab)
const Tabs = require('./tabs')(templates.tabs)

module.exports = {Tab, Tabs}

},{"./tab":7,"./tabs":8,"./templates":9}],7:[function(require,module,exports){
module.exports = function(template) {
    return {
        render: template.r,
        staticRenderFns: template.s,
        data: function() {
            return {
                active: false,
            }
        },
        props: {
            id: {
                required: true,
                type: String,
            },
            title: {
                required: true,
                type: String,
            },
            isActive: {
                required: false,
                type: Boolean,
                default: false,
            },
        },
        methods: {
            removeTab: function() {
                this.$destroy()
            },
        },
        created: function() {
            this.active = this.isActive
            this.$parent.addTab(this)
        },
        watch: {

        },
    }
}

},{}],8:[function(require,module,exports){
(function (global){
const qs = require('mini-querystring')

module.exports = function(template) {
    return {
        render: template.r,
        staticRenderFns: template.s,
        data: function() {
            return {
                tabs: [],
                current: null,
            }
        },
        methods: {
            addTab: function(tab) {
                this.tabs.push(tab)
                let searchState = qs.parse(location.search)
                if (tab.id === searchState.tabid) {
                    this.current = tab
                    tab.active = true
                }
            },
            changeTab: function(tabid, pushState) {
                let searchState = qs.parse(location.search)
                for (let _tab of this.tabs) {
                    if (_tab.id === tabid) {
                        _tab.active = true
                        this.current = _tab
                        searchState.tabid = _tab.id

                        if (pushState && global.document) {
                            global.history.pushState(null, null, `?${qs.stringify(searchState)}`)
                        }
                    } else {
                        _tab.active = false
                    }
                }
            },
            tabFromLocation: function() {
                let searchState = qs.parse(location.search)
                this.changeTab(searchState.tabid, false)
            },
            removeTab: function(tab) {
                let index = this.tabs.indexOf(tab)
                this.tabs.splice(index, 1)
                this.$el.removeChild(tab.$el)
                tab.removeTab()
                if (this.tabs[0]) {
                    this.changeTab(this.tabs[0].id)
                }
            },
        },
        mounted: function() {
            if (global.document) {
                global.addEventListener('popstate', this.tabFromLocation)
            }


            // Set default active
            let searchState = qs.parse(location.search)
            if (!searchState.tabid) {
                // Set first tab active if no tabid is in the querystring.
                this.current = this.tabs[0]
                this.tabs[0].active = true
            }
        },
        beforeDestroy: function() {
            if (global.document) {
                global.removeEventListener('popstate', this.tabFromLocation)
            }
        },
    }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"mini-querystring":2}],9:[function(require,module,exports){
module.exports.tab={r:function r(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['tab', {'is-active': _vm.active}]},[_vm._t("default")],2)}};module.exports.tabs={r:function r(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"tabs"},[_c('ul',_vm._l((_vm.tabs),function(tab){return _c('li',{class:[{'is-active': _vm.current === tab},'item'],on:{"click":function($event){_vm.changeTab(tab.id, true)}}},[_c('a',[_vm._v(_vm._s(tab.title))])])}))]),_c('div',{staticClass:"content tabs-content"},[_vm._t("default")],2)])}};
},{}]},{},[1]);
