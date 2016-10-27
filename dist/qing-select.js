/**
 * qing-select v0.0.1
 * http://mycolorway.github.io/qing-select
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-select/license.html
 *
 * Date: 2016-10-27
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingSelect = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var HtmlSelect,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

HtmlSelect = (function(superClass) {
  extend(HtmlSelect, superClass);

  function HtmlSelect() {
    return HtmlSelect.__super__.constructor.apply(this, arguments);
  }

  HtmlSelect.opts = {
    el: null
  };

  HtmlSelect.prototype._setOptions = function(opts) {
    HtmlSelect.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, HtmlSelect.opts, opts);
  };

  HtmlSelect.prototype._init = function() {
    return this.el = $(this.opts.el);
  };

  HtmlSelect.prototype.getOptions = function() {
    var options;
    options = [];
    this.el.find('option').each((function(_this) {
      return function(i, optionEl) {
        var $option, data, value;
        $option = $(optionEl);
        if (!((value = $option.val()) && !$option.is(':disabled'))) {
          return;
        }
        data = $option.data();
        if ($option.is(':selected')) {
          data.selected = true;
        }
        if ($option.parent('optgroup').length) {
          data.group = $option.parent('optgroup').prop('label');
        }
        return options.push([$option.text(), value, data]);
      };
    })(this));
    return options;
  };

  HtmlSelect.prototype.selectOption = function(option) {
    var $option;
    $option = this.el.find("option[value='" + option.value + "']");
    if (!($option.length > 0)) {
      $option = this._renderOption(option).appendTo(this.el);
    }
    $option.prop('selected', true);
    return this;
  };

  HtmlSelect.prototype.unselectOption = function(option) {
    var $option;
    $option = this.el.find("option[value='" + option.value + "']");
    $option.prop('selected', false);
    return this;
  };

  HtmlSelect.prototype._renderOption = function(option) {
    return $('<option>', {
      text: option.name,
      value: option.value,
      data: option.data
    });
  };

  HtmlSelect.prototype.getValue = function() {
    return this.el.val();
  };

  HtmlSelect.prototype.setValue = function(value) {
    this.el.val(value);
    return this;
  };

  HtmlSelect.prototype.getBlankOption = function() {
    var $blankOption;
    $blankOption = this.el.find('option:not([value]), option[value=""]');
    if ($blankOption.length > 0) {
      return $blankOption;
    } else {
      return false;
    }
  };

  return HtmlSelect;

})(QingModule);

module.exports = HtmlSelect;

},{}],2:[function(require,module,exports){
var DataProvider, Option,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Option = require('./option.coffee');

DataProvider = (function(superClass) {
  extend(DataProvider, superClass);

  function DataProvider() {
    return DataProvider.__super__.constructor.apply(this, arguments);
  }

  DataProvider.opts = {
    remote: false,
    options: [],
    totalOptionSize: null
  };

  DataProvider.prototype._setOptions = function(opts) {
    DataProvider.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, DataProvider.opts, opts);
  };

  DataProvider.prototype._init = function() {
    this.remote = this.opts.remote;
    this.totalOptionSize = this.opts.totalOptionSize;
    return this.setOptions(this.opts.options);
  };

  DataProvider.prototype._fetch = function(value, callback) {
    var obj, onFetch;
    if (!this.remote || this.trigger('beforeFetch') === false) {
      return;
    }
    onFetch = (function(_this) {
      return function(result) {
        var option;
        result.options = (function() {
          var j, len, ref, results;
          ref = result.options;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            option = ref[j];
            results.push(new Option(option));
          }
          return results;
        })();
        _this.trigger('fetch', [result, value]);
        return callback != null ? callback.call(_this, result) : void 0;
      };
    })(this);
    return $.ajax({
      url: this.remote.url,
      data: $.extend({}, this.remote.params, (
        obj = {},
        obj["" + this.remote.searchKey] = value,
        obj
      )),
      dataType: 'json'
    }).done(function(result) {
      return onFetch(result);
    });
  };

  DataProvider.prototype.filter = function(value, callback) {
    var afterFilter, options;
    afterFilter = (function(_this) {
      return function(result) {
        _this.trigger('beforeFilterComplete', [result, value]);
        _this.trigger('filter', [result, value]);
        return callback != null ? callback.call(_this, result) : void 0;
      };
    })(this);
    if (this.remote && this.options.length < this.totalOptionSize) {
      if (value) {
        this._fetch(value, afterFilter);
      } else {
        afterFilter({
          options: this.options,
          totalSize: this.totalOptionSize
        });
      }
    } else {
      options = [];
      $.each(this.options, function(i, option) {
        if (option.match(value)) {
          return options.push(option);
        }
      });
      afterFilter({
        options: options,
        totalSize: options.length
      });
    }
    return null;
  };

  DataProvider.prototype.getOption = function(value) {
    var result;
    value = value.toString();
    result = this.options.filter((function(_this) {
      return function(option, i) {
        return option.value === value;
      };
    })(this));
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  };

  DataProvider.prototype.setOptions = function(options) {
    var option;
    return this.options = (function() {
      var j, len, ref, results;
      ref = this.opts.options;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        option = ref[j];
        results.push(new Option(option));
      }
      return results;
    }).call(this);
  };

  return DataProvider;

})(QingModule);

module.exports = DataProvider;

},{"./option.coffee":3}],3:[function(require,module,exports){
var Option;

Option = (function() {
  function Option(option) {
    this.name = option[0];
    this.value = option[1].toString();
    this.data = {};
    if (option.length > 2 && $.isPlainObject(option[2])) {
      $.each(option[2], (function(_this) {
        return function(key, value) {
          key = key.replace(/^data-/, '').split('-');
          $.each(key, function(i, part) {
            if (i > 0) {
              return key[i] = part.charAt(0).toUpperCase() + part.slice(1);
            }
          });
          _this.data[key.join('')] = value;
          return null;
        };
      })(this));
    }
    this.selected = this.data.selected || false;
  }

  Option.prototype.match = function(value) {
    var e, filterKey, re;
    try {
      re = new RegExp("(^|\\s)" + value, "i");
    } catch (error) {
      e = error;
      re = new RegExp("", "i");
    }
    filterKey = this.data.searchKey || this.name;
    return re.test(filterKey);
  };

  return Option;

})();

module.exports = Option;

},{}],4:[function(require,module,exports){
var MultipleResultBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MultipleResultBox = (function(superClass) {
  extend(MultipleResultBox, superClass);

  function MultipleResultBox() {
    return MultipleResultBox.__super__.constructor.apply(this, arguments);
  }

  MultipleResultBox.opts = {
    wrapper: null,
    placeholder: '',
    selected: false,
    locales: null
  };

  MultipleResultBox.prototype._setOptions = function(opts) {
    MultipleResultBox.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, MultipleResultBox.opts, opts);
  };

  MultipleResultBox.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (!(this.wrapper.length > 0)) {
      return;
    }
    this.active = false;
    this.disabled = false;
    this.selected = [];
    this._render();
    this._bind();
    if (this.opts.selected) {
      return this.addSelected(this.opts.selected);
    }
  };

  MultipleResultBox.prototype._render = function() {
    this.el = $("<div class=\"multiple-result-box\">\n  <a class=\"link-add\" href=\"javascript:;\">\n    <i class=\"icon-add\">&#65291;</i>\n    <span>" + this.opts.locales.addSelected + "</span>\n  </a>\n</div>").appendTo(this.wrapper);
    return this.linkAdd = this.el.find('.link-add');
  };

  MultipleResultBox.prototype._bind = function() {
    this.el.on('click', '.link-add', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        return _this.trigger('addClick');
      };
    })(this));
    this.el.on('click', '.selected-option', (function(_this) {
      return function(e) {
        var $option;
        if (_this.disabled) {
          return;
        }
        $option = $(e.currentTarget);
        return _this.trigger('optionClick', [$option.data('option')]);
      };
    })(this));
    this.el.on('keydown', '.selected-option', (function(_this) {
      return function(e) {
        var $option;
        if (_this.disabled) {
          return;
        }
        $option = $(e.currentTarget);
        if (e.which === 13) {
          _this.trigger('optionClick', [$option.data('option')]);
          return false;
        }
      };
    })(this));
    return this.linkAdd.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (e.which === 13) {
          _this.trigger('enterPress');
          return false;
        } else if (e.which === 38) {
          _this.trigger('arrowPress', ['up']);
          return false;
        } else if (e.which === 40) {
          _this.trigger('arrowPress', ['down']);
          return false;
        }
      };
    })(this));
  };

  MultipleResultBox.prototype.addSelected = function(option) {
    var j, len, opt;
    if ($.isArray(option)) {
      for (j = 0, len = option.length; j < len; j++) {
        opt = option[j];
        this.addSelected(opt);
      }
      return;
    }
    $("<a href=\"javascript:;\" class=\"selected-option\"\n  data-value=\"" + option.value + "\">\n  <span class=\"name\">" + option.name + "</span>\n  <i class=\"icon-remove\">&#10005;</i>\n</a>").data('option', option).insertBefore(this.linkAdd);
    this.selected.push(option);
    return this;
  };

  MultipleResultBox.prototype.removeSelected = function(option) {
    var i, index, j, len, opt, ref;
    this.el.find(".selected-option[data-value='" + option.value + "']").remove();
    index = -1;
    ref = this.selected;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      opt = ref[i];
      if (option.value === opt.value) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this.selected.splice(index, 1);
    }
    return this;
  };

  MultipleResultBox.prototype.setActive = function(active) {
    if (active === this.active) {
      return;
    }
    this.el.toggleClass('active', active);
    this.active = active;
    return this;
  };

  MultipleResultBox.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) {
      return;
    }
    this.el.toggleClass('disabled', disabled);
    this.disabled = disabled;
    return this;
  };

  MultipleResultBox.prototype.focus = function() {
    this.linkAdd.focus();
    return this;
  };

  return MultipleResultBox;

})(QingModule);

module.exports = MultipleResultBox;

},{}],5:[function(require,module,exports){
var OptionsList,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

OptionsList = (function(superClass) {
  extend(OptionsList, superClass);

  function OptionsList() {
    return OptionsList.__super__.constructor.apply(this, arguments);
  }

  OptionsList.opts = {
    wrapper: null,
    locales: null,
    options: null,
    opitonRenderer: null,
    totalOptionSize: null,
    maxListSize: 0
  };

  OptionsList.prototype._setOptions = function(opts) {
    OptionsList.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, OptionsList.opts, opts);
  };

  OptionsList.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (!(this.wrapper.length > 0)) {
      return;
    }
    this.highlighted = false;
    this._render();
    return this._bind();
  };

  OptionsList.prototype._render = function() {
    this.el = $('<div class="options-list"></div>').appendTo(this.wrapper);
    if (this.opts.options) {
      return this.renderOptions(this.opts.options, this.opts.totalOptionSize);
    }
  };

  OptionsList.prototype._bind = function() {
    return this.el.on('click', '.option', (function(_this) {
      return function(e) {
        var $option;
        $option = $(e.currentTarget);
        _this.setHighlighted($option);
        _this.trigger('optionClick', [$option]);
        return null;
      };
    })(this));
  };

  OptionsList.prototype.renderOptions = function(options, totalOptionSize) {
    var i, len, option;
    if (options == null) {
      options = [];
    }
    options = options.slice(0, this.opts.maxListSize);
    this.el.empty().css('min-height', 0);
    this.highlighted = false;
    if (options.length > 0) {
      for (i = 0, len = options.length; i < len; i++) {
        option = options[i];
        this._append(this._optionEl(option));
      }
      if (totalOptionSize > options.length) {
        this._renderHiddenSize(totalOptionSize - options.length);
      }
      return this._lastRenderGroup = null;
    } else {
      return this._renderEmpty();
    }
  };

  OptionsList.prototype._groupEl = function(groupName) {
    return $("<div class=\"optgroup\">" + groupName + "</div>");
  };

  OptionsList.prototype._optionEl = function(option) {
    var $optionEl;
    $optionEl = $("<div class=\"option\">\n  <div class=\"left\">\n    <span class=\"name\"></span>\n  </div>\n  <div class=\"right\">\n    <span class=\"hint\"></span>\n  </div>\n</div>").data('option', option);
    $optionEl.find('.name').text(option.data.label || option.name);
    if (option.data.hint) {
      $optionEl.find('.hint').text(option.data.hint);
    }
    $optionEl.attr('data-value', option.value);
    $optionEl.data('option', option);
    if (option.selected) {
      this.setHighlighted($optionEl);
    }
    if ($.isFunction(this.opts.opitonRenderer)) {
      this.opts.opitonRenderer.call(this, $optionEl, option);
    }
    return $optionEl;
  };

  OptionsList.prototype._append = function(optionEl) {
    var $groupEl, group, ref;
    $groupEl = null;
    group = (ref = optionEl.data('option').data) != null ? ref.group : void 0;
    if (!group) {
      return this.el.append(optionEl);
    }
    if (this._lastRenderGroup !== group) {
      this._lastRenderGroup = group;
      this.el.append(this._groupEl(group));
    }
    return this.el.append(optionEl);
  };

  OptionsList.prototype._renderEmpty = function() {
    return this.el.append("<div class=\"no-options\">" + this.opts.locales.noOptions + "</div>");
  };

  OptionsList.prototype._renderHiddenSize = function(size) {
    var text;
    text = this.opts.locales.hiddenSize.replace(/__size__/g, size);
    return this.el.append("<div class=\"hidden-size\">" + text + "</div>");
  };

  OptionsList.prototype.setLoading = function(loading) {
    if (loading === this.loading) {
      return;
    }
    if (loading) {
      setTimeout((function(_this) {
        return function() {
          if (!_this.loading) {
            return;
          }
          _this.el.addClass('loading');
          return _this.el.append("<div class=\"loading-message\">" + _this.opts.locales.loading + "</div>");
        };
      })(this), 500);
    } else {
      this.el.removeClass('loading');
      this.el.find('.loading').remove();
    }
    this.loading = loading;
    return this;
  };

  OptionsList.prototype.setHighlighted = function(highlighted) {
    if (typeof highlighted !== 'object') {
      highlighted = this.el.find(".option[data-value='" + highlighted + "']");
    }
    if (!(highlighted.length > 0)) {
      return;
    }
    if (this.highlighted) {
      this.highlighted.removeClass('highlighted');
    }
    this.highlighted = highlighted.addClass('highlighted');
    return this;
  };

  OptionsList.prototype.highlightNextOption = function() {
    var $nextOption;
    if (this.highlighted) {
      $nextOption = this.highlighted.nextAll('.option:first');
    } else {
      $nextOption = this.el.find('.option:first');
    }
    if ($nextOption.length > 0) {
      return this.setHighlighted($nextOption);
    }
  };

  OptionsList.prototype.highlightPrevOption = function() {
    var $prevOption;
    if (this.highlighted) {
      $prevOption = this.highlighted.prevAll('.option:first');
    } else {
      $prevOption = this.el.find('.option:first');
    }
    if ($prevOption.length > 0) {
      return this.setHighlighted($prevOption);
    }
  };

  return OptionsList;

})(QingModule);

module.exports = OptionsList;

},{}],6:[function(require,module,exports){
var OptionsList, Popover, SearchBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SearchBox = require('./search-box.coffee');

OptionsList = require('./options-list.coffee');

Popover = (function(superClass) {
  extend(Popover, superClass);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover.opts = {
    wrapper: null,
    dataProvider: null,
    locales: null,
    maxListSize: 0,
    searchableSize: 8,
    opitonRenderer: null
  };

  Popover.prototype._setOptions = function(opts) {
    Popover.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, Popover.opts, opts);
  };

  Popover.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (!(this.wrapper.length > 0)) {
      return;
    }
    this.active = false;
    this.dataProvider = this.opts.dataProvider;
    this.searchable = this.dataProvider.totalOptionSize > this.dataProvider.options.length || this.dataProvider.options.length > this.opts.searchableSize;
    this._render();
    this._initChildComponents();
    return this._bind();
  };

  Popover.prototype._render = function() {
    return this.el = $('<div class="qing-select-popover">');
  };

  Popover.prototype._initChildComponents = function() {
    this.searchBox = new SearchBox({
      wrapper: this.el,
      placeholder: this.opts.locales.searchPlaceholder,
      hidden: !this.searchable
    });
    return this.optionsList = new OptionsList({
      wrapper: this.el,
      locales: this.opts.locales,
      options: this.dataProvider.options,
      optionRenderer: this.opts.optionRenderer,
      totalOptionSize: this.dataProvider.totalOptionSize,
      maxListSize: this.opts.maxListSize
    });
  };

  Popover.prototype._bind = function() {
    this.searchBox.on('change', (function(_this) {
      return function(e, val) {
        _this.optionsList.setLoading(true);
        return _this.dataProvider.filter(val);
      };
    })(this));
    this.dataProvider.on('filter', (function(_this) {
      return function(e, result, value) {
        _this.optionsList.setLoading(false);
        _this.optionsList.renderOptions(result.options, result.totalSize);
        if (!_this.optionsList.highlighted) {
          return _this.optionsList.highlightNextOption();
        }
      };
    })(this));
    this.searchBox.on('enterPress', (function(_this) {
      return function(e) {
        if (_this.optionsList.highlighted) {
          return _this._selectOption(_this.optionsList.highlighted);
        }
      };
    })(this));
    this.searchBox.on('escapePress', (function(_this) {
      return function(e) {
        return _this.setActive(false);
      };
    })(this));
    this.searchBox.on('arrowPress', (function(_this) {
      return function(e, direction) {
        if (direction === 'up') {
          return _this.optionsList.highlightPrevOption();
        } else if (direction === 'down') {
          return _this.optionsList.highlightNextOption();
        }
      };
    })(this));
    return this.optionsList.on('optionClick', (function(_this) {
      return function(e, $option) {
        return _this._selectOption($option);
      };
    })(this));
  };

  Popover.prototype._selectOption = function($option) {
    var option;
    option = $option.data('option');
    this.optionsList.setHighlighted(option.value);
    this.searchBox.textField.val('');
    return this.trigger('select', [option]);
  };

  Popover.prototype.setActive = function(active) {
    if (active === this.active) {
      return;
    }
    if (active) {
      this.el.addClass('active').appendTo(this.opts.appendTo);
      this.trigger('show');
      this.searchBox.focus();
    } else {
      this.el.removeClass('active').detach();
      this.trigger('hide');
    }
    this.active = active;
    return this;
  };

  return Popover;

})(QingModule);

module.exports = Popover;

},{"./options-list.coffee":5,"./search-box.coffee":8}],7:[function(require,module,exports){
var ResultBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResultBox = (function(superClass) {
  extend(ResultBox, superClass);

  function ResultBox() {
    return ResultBox.__super__.constructor.apply(this, arguments);
  }

  ResultBox.opts = {
    wrapper: null,
    placeholder: '',
    selected: false,
    clearable: true
  };

  ResultBox.prototype._setOptions = function(opts) {
    ResultBox.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, ResultBox.opts, opts);
  };

  ResultBox.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (!(this.wrapper.length > 0)) {
      return;
    }
    this.active = false;
    this.disabled = false;
    this._render();
    this._bind();
    return this.setSelected(this.opts.selected);
  };

  ResultBox.prototype._render = function() {
    this.el = $("<div class=\"result-box\" tabindex=\"0\">\n  <div class=\"placeholder\">" + this.opts.placeholder + "</div>\n  <div class=\"result\"></div>\n  <i class=\"icon-expand\"><span>&#9662;</span></i>\n  <a class=\"link-clear\" href=\"javascript:;\" tabindex=\"-1\">\n    &#10005;\n  </a>\n</div>").appendTo(this.wrapper);
    if (this.opts.clearable) {
      return this.el.addClass('clearable');
    }
  };

  ResultBox.prototype._bind = function() {
    this.el.on('click', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        return _this.trigger('click');
      };
    })(this));
    this.el.on('click', '.link-clear', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        _this.trigger('clearClick');
        return false;
      };
    })(this));
    return this.el.on('keydown', (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if (e.which === 13) {
          _this.trigger('enterPress');
          return false;
        } else if (e.which === 38) {
          _this.trigger('arrowPress', ['up']);
          return false;
        } else if (e.which === 40) {
          _this.trigger('arrowPress', ['down']);
          return false;
        }
      };
    })(this));
  };

  ResultBox.prototype.setSelected = function(selected) {
    if (selected === this.selected) {
      return;
    }
    if (selected) {
      this.el.removeClass('empty').find('.result').text(selected.name);
    } else {
      this.el.addClass('empty').find('.result').text('');
    }
    this.selected = selected;
    return this;
  };

  ResultBox.prototype.setActive = function(active) {
    if (active === this.active) {
      return;
    }
    this.el.toggleClass('active', active);
    this.active = active;
    return this;
  };

  ResultBox.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) {
      return;
    }
    this.el.toggleClass('disabled', disabled);
    if (disabled) {
      this.el.removeAttr('tabindex');
    } else {
      this.el.attr('tabindex', '0');
    }
    this.disabled = disabled;
    return this;
  };

  ResultBox.prototype.focus = function() {
    this.el.focus();
    return this;
  };

  return ResultBox;

})(QingModule);

module.exports = ResultBox;

},{}],8:[function(require,module,exports){
var SearchBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SearchBox = (function(superClass) {
  extend(SearchBox, superClass);

  function SearchBox() {
    return SearchBox.__super__.constructor.apply(this, arguments);
  }

  SearchBox.opts = {
    wrapper: null,
    placeholder: '',
    hidden: false,
    renderer: null
  };

  SearchBox.prototype._setOptions = function(opts) {
    SearchBox.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, SearchBox.opts, opts);
  };

  SearchBox.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (!(this.wrapper.length > 0)) {
      return;
    }
    this._inputDelay = 200;
    this._render();
    this._bind();
    if ($.isFunction(this.opts.renderer)) {
      return this.opts.renderer.call(this, this.wrapper, this);
    }
  };

  SearchBox.prototype._render = function() {
    this.el = $("<div class=\"search-box\">\n  <input type=\"text\" class=\"text-field\" tabindex=\"-1\"\n    placeholder=\"" + this.opts.placeholder + "\" />\n  <span class=\"icon-search\">&#128269;</span>\n</div>").appendTo(this.wrapper);
    if (this.opts.hidden) {
      this.el.addClass('hidden');
    }
    this.textField = this.el.find('.text-field');
    return this.el;
  };

  SearchBox.prototype._bind = function() {
    this.textField.on('input', (function(_this) {
      return function(e) {
        if (_this._inputTimer) {
          clearTimeout(_this._inputTimer);
          _this._inputTimer = null;
        }
        return _this._inputTimer = setTimeout(function() {
          return _this.trigger('change', [_this.textField.val()]);
        }, _this._inputDelay);
      };
    })(this));
    this.textField.on('keydown', (function(_this) {
      return function(e) {
        if (e.which === 13) {
          _this.trigger('enterPress');
          return false;
        } else if (e.which === 27) {
          _this.setValue('');
          _this.trigger('escapePress');
        } else if (e.which === 38) {
          _this.trigger('arrowPress', ['up']);
        } else if (e.which === 40) {
          _this.trigger('arrowPress', ['down']);
        }
        return null;
      };
    })(this));
    return this.on('change', function(e, val) {
      return this.el.toggleClass('empty', !!val);
    });
  };

  SearchBox.prototype.getValue = function() {
    return this.textField.val();
  };

  SearchBox.prototype.setValue = function(val) {
    this.textField.val(val);
    this.trigger('change', [val]);
    return this;
  };

  SearchBox.prototype.focus = function() {
    this.textField.focus();
    return this;
  };

  return SearchBox;

})(QingModule);

module.exports = SearchBox;

},{}],"qing-select":[function(require,module,exports){
var DataProvider, HtmlSelect, MultipleResultBox, Option, OptionsList, Popover, QingSelect, ResultBox, SearchBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

DataProvider = require('./models/data-provider.coffee');

Option = require('./models/option.coffee');

HtmlSelect = require('./html-select.coffee');

MultipleResultBox = require('./multiple-result-box.coffee');

ResultBox = require('./result-box.coffee');

Popover = require('./popover.coffee');

SearchBox = require('./search-box.coffee');

OptionsList = require('./options-list.coffee');

QingSelect = (function(superClass) {
  extend(QingSelect, superClass);

  function QingSelect() {
    return QingSelect.__super__.constructor.apply(this, arguments);
  }

  QingSelect.name = 'QingSelect';

  QingSelect.opts = {
    el: null,
    renderer: null,
    opitonRenderer: null,
    remote: false,
    totalOptionSize: 0,
    maxListSize: 20,
    popoverOffset: 6,
    popoverAppendTo: 'body',
    searchableSize: 8,
    locales: null
  };

  QingSelect.locales = {
    searchPlaceholder: 'Search',
    addSelected: 'New',
    noOptions: 'Found nothing.',
    hiddenSize: '__size__ more records are hidden, please search for them',
    loading: 'Loading...'
  };

  QingSelect.prototype._setOptions = function(opts) {
    QingSelect.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, QingSelect.opts, opts);
  };

  QingSelect.prototype._init = function() {
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingSelect: option el is required');
    }
    this.locales = $.extend({}, QingSelect.locales, this.opts.locales);
    this.active = false;
    this._render();
    this._initChildComponents();
    this._bind();
    if ($.isFunction(this.opts.renderer)) {
      this.opts.renderer.call(this, this.wrapper, this);
    }
    return this.dataProvider.filter('');
  };

  QingSelect.prototype._render = function() {
    this.wrapper = $('<div class="qing-select"></div>').insertBefore(this.el);
    return this.el.hide().appendTo(this.wrapper).data('qingSelect', this);
  };

  QingSelect.prototype._initChildComponents = function() {
    var options, selected;
    this.htmlSelect = new HtmlSelect({
      el: this.el
    });
    options = this.htmlSelect.getOptions();
    this.dataProvider = new DataProvider({
      remote: this.opts.remote,
      options: options,
      totalOptionSize: this.opts.totalOptionSize
    });
    this.multiple = this.el.is('[multiple]');
    selected = this.dataProvider.options.filter(function(option) {
      return option.selected;
    });
    this.resultBox = this.multiple ? new MultipleResultBox({
      wrapper: this.wrapper,
      placeholder: this._placeholder(),
      selected: selected,
      locales: this.locales
    }) : new ResultBox({
      wrapper: this.wrapper,
      placeholder: this._placeholder(),
      selected: selected.length > 0 ? selected[0] : false,
      clearable: !!this.htmlSelect.getBlankOption()
    });
    return this.popover = new Popover({
      wrapper: this.wrapper,
      dataProvider: this.dataProvider,
      locales: this.locales,
      maxListSize: this.opts.maxListSize,
      searchableSize: this.opts.searchableSize,
      appendTo: this.opts.popoverAppendTo,
      optionRenderer: this.opts.optionRenderer
    });
  };

  QingSelect.prototype._bind = function() {
    this.resultBox.on('enterPress', (function(_this) {
      return function(e) {
        var highlighted;
        if (_this.active && !_this.popover.searchable && (highlighted = _this.popover.optionsList.highlighted)) {
          return _this.selectOption(highlighted.data('option'));
        } else {
          return _this._setActive(!_this.active);
        }
      };
    })(this));
    this.resultBox.on('arrowPress', (function(_this) {
      return function(e, direction) {
        if (_this.active && !_this.popover.searchable) {
          if (direction === 'up') {
            return _this.popover.optionsList.highlightPrevOption();
          } else {
            return _this.popover.optionsList.highlightNextOption();
          }
        } else {
          return _this._setActive(!_this.active);
        }
      };
    })(this));
    if (this.multiple) {
      this.resultBox.on('addClick', (function(_this) {
        return function(e) {
          return _this._setActive(true);
        };
      })(this));
      this.resultBox.on('optionClick', (function(_this) {
        return function(e, option) {
          return _this.unselectOption(option);
        };
      })(this));
    } else {
      this.resultBox.on('click', (function(_this) {
        return function(e) {
          return _this._setActive(!_this.active);
        };
      })(this));
      this.resultBox.on('clearClick', (function(_this) {
        return function(e) {
          return _this.clear();
        };
      })(this));
    }
    this.popover.on('select', (function(_this) {
      return function(e, option) {
        return _this.selectOption(option);
      };
    })(this));
    this.popover.on('show', (function(_this) {
      return function(e) {
        return _this.popover.el.css(_this._popoverPosition());
      };
    })(this));
    this.popover.searchBox.on('escapePress', (function(_this) {
      return function(e) {
        return _this._setActive(false);
      };
    })(this));
    this.dataProvider.on('beforeFilterComplete', (function(_this) {
      return function(e, result, value) {
        var j, len, option, ref, ref1, results, selected;
        selected = _this.htmlSelect.getValue() || [];
        if (!$.isArray(selected)) {
          selected = [selected];
        }
        if (_this.multiple) {
          result.options = result.options.filter(function(option, i) {
            var ref;
            return !(ref = option.value, indexOf.call(selected, ref) >= 0);
          });
          return result.totalSize -= selected.length;
        } else {
          ref = result.options;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            option = ref[j];
            results.push(option.selected = (ref1 = option.value, indexOf.call(selected, ref1) >= 0));
          }
          return results;
        }
      };
    })(this));
    return this.on('change', (function(_this) {
      return function(e) {
        return _this.el.trigger('change');
      };
    })(this));
  };

  QingSelect.prototype._placeholder = function() {
    var $blankOption;
    return this.placeholder || (this.placeholder = this.opts.placeholder ? this.opts.placeholder : ($blankOption = this.htmlSelect.getBlankOption()) ? $blankOption.text() : '');
  };

  QingSelect.prototype._setActive = function(active) {
    if (active === this.active) {
      return;
    }
    this.resultBox.setActive(active);
    this.popover.setActive(active);
    $(document).off('mousedown.qing-select');
    if (active) {
      $(document).on('mousedown.qing-select', (function(_this) {
        return function(e) {
          if (($.contains(_this.wrapper[0], e.target) || $.contains(_this.popover.el[0], e.target)) && !$(e.target).is('.multiple-result-box')) {
            return;
          }
          _this._setActive(false);
          return $(document).off('mousedown.qing-select');
        };
      })(this));
    } else {
      this.resultBox.focus();
    }
    this.active = active;
    return this;
  };

  QingSelect.prototype._popoverPosition = function() {
    var resultBoxHeight, resultBoxPosition, resultBoxWidth;
    resultBoxPosition = this.resultBox.el.offset();
    resultBoxHeight = this.resultBox.el.outerHeight();
    resultBoxWidth = this.resultBox.el.outerWidth();
    return {
      top: resultBoxPosition.top + resultBoxHeight + this.opts.popoverOffset,
      left: resultBoxPosition.left,
      minWidth: resultBoxWidth
    };
  };

  QingSelect.prototype.selectOption = function(option, quiet) {
    var oldOption;
    if (quiet == null) {
      quiet = false;
    }
    if (!(option instanceof Option)) {
      option = this.dataProvider.getOption(option);
    }
    if (!option) {
      return;
    }
    option.selected = true;
    if (this.multiple) {
      this.resultBox.addSelected(option);
    } else {
      if (oldOption = this.resultBox.selected) {
        oldOption.selected = false;
        this.htmlSelect.unselectOption(oldOption);
      }
      this.resultBox.setSelected(option);
    }
    this.htmlSelect.selectOption(option);
    this._afterSelectionChange(quiet);
    return this;
  };

  QingSelect.prototype.unselectOption = function(option, quiet) {
    if (quiet == null) {
      quiet = false;
    }
    if (!(option instanceof Option)) {
      option = this.dataProvider.getOption(option);
    }
    if (!option) {
      return;
    }
    option.selected = false;
    if (this.multiple) {
      this.resultBox.removeSelected(option);
    } else {
      this.resultBox.setSelected(false);
    }
    this.htmlSelect.unselectOption(option);
    this._afterSelectionChange(quiet);
    return this;
  };

  QingSelect.prototype.clear = function(quiet) {
    var j, len, option, ref;
    if (quiet == null) {
      quiet = false;
    }
    if (this.multiple) {
      if (!(this.resultBox.selected.length > 0)) {
        return;
      }
      ref = this.resultBox.selected;
      for (j = 0, len = ref.length; j < len; j++) {
        option = ref[j];
        option.selected = false;
        this.resultBox.removeSelected(option);
        this.htmlSelect.unselectOption(option);
      }
    } else {
      if (!(option = this.resultBox.selected)) {
        return;
      }
      option.selected = false;
      this.resultBox.setSelected(false);
      this.htmlSelect.unselectOption(option);
    }
    this._afterSelectionChange(quiet);
    return this;
  };

  QingSelect.prototype._afterSelectionChange = function(quiet) {
    if (quiet == null) {
      quiet = false;
    }
    this._setActive(false);
    this.dataProvider.setOptions(this.htmlSelect.getOptions());
    this.dataProvider.filter('');
    if (!quiet) {
      return this.trigger('change', [this.resultBox.selected]);
    }
  };

  QingSelect.prototype.destroy = function() {
    this.el.insertBefore(this.wrapper).show().removeData('qingSelect');
    this.popover.el.remove();
    this.wrapper.remove();
    $(document).off('.qing-select');
    return this;
  };

  return QingSelect;

})(QingModule);

QingSelect.extend({
  DataProvider: DataProvider,
  Option: Option,
  HtmlSelect: HtmlSelect,
  MultipleResultBox: MultipleResultBox,
  ResultBox: ResultBox,
  Popover: Popover,
  SearchBox: SearchBox,
  OptionsList: OptionsList
});

module.exports = QingSelect;

},{"./html-select.coffee":1,"./models/data-provider.coffee":2,"./models/option.coffee":3,"./multiple-result-box.coffee":4,"./options-list.coffee":5,"./popover.coffee":6,"./result-box.coffee":7,"./search-box.coffee":8}]},{},[]);

return b('qing-select');
}));
