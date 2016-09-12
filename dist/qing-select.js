/**
 * qing-select v0.0.1
 * http://mycolorway.github.io/qing-select
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-select/license.html
 *
 * Date: 2016-09-12
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingSelect = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"qing-select":[function(require,module,exports){
var QingSelect,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

QingSelect = (function(superClass) {
  extend(QingSelect, superClass);

  QingSelect.opts = {
    el: null
  };

  function QingSelect(opts) {
    QingSelect.__super__.constructor.apply(this, arguments);
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingSelect: option el is required');
    }
    this.opts = $.extend({}, QingSelect.opts, this.opts);
    this._render();
    this.trigger('ready');
  }

  QingSelect.prototype._render = function() {
    this.el.append("<p>This is a sample component.</p>");
    return this.el.addClass(' qing-select').data('qingSelect', this);
  };

  QingSelect.prototype.destroy = function() {
    return this.el.empty().removeData('qingSelect');
  };

  return QingSelect;

})(QingModule);

module.exports = QingSelect;

},{}]},{},[]);

return b('qing-select');
}));
