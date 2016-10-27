DataProvider = require './models/data-provider.coffee'
Option = require './models/option.coffee'
HtmlSelect = require './html-select.coffee'
MultipleResultBox = require './multiple-result-box.coffee'
ResultBox = require './result-box.coffee'
Popover = require './popover.coffee'
SearchBox = require './search-box.coffee'
OptionsList = require './options-list.coffee'

class QingSelect extends QingModule

  @name: 'QingSelect'

  @opts:
    el: null
    renderer: null
    opitonRenderer: null
    remote: false
    totalOptionSize: 0
    maxListSize: 20
    popoverOffset: 6
    popoverAppendTo: 'body'
    searchableSize: 8
    locales: null

  @locales:
    searchPlaceholder: 'Search'
    addSelected: 'New'
    noOptions: 'Found nothing.'
    hiddenSize: '__size__ more records are hidden, please search for them'
    loading: 'Loading...'

  _setOptions: (opts) ->
    super
    $.extend @opts, QingSelect.opts, opts

  _init: ->
    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingSelect: option el is required'

    @locales = $.extend {}, QingSelect.locales, @opts.locales
    @active = false
    @_render()
    @_initChildComponents()
    @_bind()

    if $.isFunction(@opts.renderer)
      @opts.renderer.call @, @wrapper, @

    # generate default options list
    @dataProvider.filter ''

  _render: ->
    @wrapper = $('<div class="qing-select"></div>').insertBefore @el
    @el.hide().appendTo @wrapper
      .data 'qingSelect', @

  _initChildComponents: ->
    @htmlSelect = new HtmlSelect
      el: @el

    options = @htmlSelect.getOptions()
    @dataProvider = new DataProvider
      remote: @opts.remote
      options: options
      totalOptionSize: @opts.totalOptionSize

    @multiple = @el.is '[multiple]'
    selected = @dataProvider.options.filter (option) -> option.selected
    @resultBox = if @multiple
      new MultipleResultBox
        wrapper: @wrapper
        placeholder: @_placeholder()
        selected: selected
        locales: @locales
    else
      new ResultBox
        wrapper: @wrapper
        placeholder: @_placeholder()
        selected: if selected.length > 0 then selected[0] else false
        clearable: !!@htmlSelect.getBlankOption()

    @popover = new Popover
      wrapper: @wrapper
      dataProvider: @dataProvider
      locales: @locales
      maxListSize: @opts.maxListSize
      searchableSize: @opts.searchableSize
      appendTo: @opts.popoverAppendTo
      optionRenderer: @opts.optionRenderer

  _bind: ->
    @resultBox.on 'enterPress', (e) =>
      if @active && !@popover.searchable &&
          (highlighted = @popover.optionsList.highlighted)
        @selectOption highlighted.data('option')
      else
        @_setActive !@active

    @resultBox.on 'arrowPress', (e, direction) =>
      if @active && !@popover.searchable
        if direction == 'up'
          @popover.optionsList.highlightPrevOption()
        else
          @popover.optionsList.highlightNextOption()
      else
        @_setActive !@active

    if @multiple
      @resultBox.on 'addClick', (e) =>
        @_setActive true

      @resultBox.on 'optionClick', (e, option) =>
        @unselectOption option
    else
      @resultBox.on 'click', (e) =>
        @_setActive !@active

      @resultBox.on 'clearClick', (e) =>
        @clear()

    @popover.on 'select', (e, option) =>
      @selectOption option

    @popover.on 'show', (e) =>
      @popover.el.css @_popoverPosition()

    @popover.searchBox.on 'escapePress', (e) =>
      @_setActive false

    @dataProvider.on 'beforeFilterComplete', (e, result, value) =>
      selected = @htmlSelect.getValue() || []
      selected = [selected] unless $.isArray(selected)
      if @multiple
        result.options = result.options.filter (option, i) ->
          !(option.value in selected)
        result.totalSize -= selected.length
      else
        for option in result.options
          option.selected = (option.value in selected)

    @on 'change', (e) =>
      @el.trigger 'change'

  _placeholder: ->
    @placeholder ||= if @opts.placeholder
      @opts.placeholder
    else if ($blankOption = @htmlSelect.getBlankOption())
      $blankOption.text()
    else
      ''

  _setActive: (active) ->
    return if active == @active
    @resultBox.setActive active
    @popover.setActive active

    $(document).off 'mousedown.qing-select'
    if active
      $(document).on 'mousedown.qing-select', (e) =>
        return if ($.contains(@wrapper[0], e.target) ||
          $.contains(@popover.el[0], e.target)) &&
          !$(e.target).is('.multiple-result-box')
        @_setActive false
        $(document).off 'mousedown.qing-select'
    else
      @resultBox.focus()

    @active = active
    @

  _popoverPosition: ->
    resultBoxPosition = @resultBox.el.offset()
    resultBoxHeight = @resultBox.el.outerHeight()
    resultBoxWidth = @resultBox.el.outerWidth()

    top: resultBoxPosition.top + resultBoxHeight + @opts.popoverOffset
    left: resultBoxPosition.left
    minWidth: resultBoxWidth

  selectOption: (option, quiet = false) ->
    unless option instanceof Option
      option = @dataProvider.getOption option
    return unless option
    option.selected = true

    if @multiple
      @resultBox.addSelected option
    else
      if oldOption = @resultBox.selected
        oldOption.selected = false
        @htmlSelect.unselectOption oldOption
      @resultBox.setSelected option

    @htmlSelect.selectOption option
    @_afterSelectionChange quiet
    @

  unselectOption: (option, quiet = false) ->
    unless option instanceof Option
      option = @dataProvider.getOption option
    return unless option
    option.selected = false

    if @multiple
      @resultBox.removeSelected option
    else
      @resultBox.setSelected false

    @htmlSelect.unselectOption option
    @_afterSelectionChange quiet
    @

  clear: (quiet = false) ->
    if @multiple
      return unless @resultBox.selected.length > 0
      for option in @resultBox.selected
        option.selected = false
        @resultBox.removeSelected option
        @htmlSelect.unselectOption option
    else
      return unless (option = @resultBox.selected)
      option.selected = false
      @resultBox.setSelected false
      @htmlSelect.unselectOption option

    @_afterSelectionChange quiet
    @

  _afterSelectionChange: (quiet = false) ->
    @_setActive false
    @dataProvider.setOptions @htmlSelect.getOptions()
    @dataProvider.filter ''
    @trigger('change', [@resultBox.selected]) unless quiet

  destroy: ->
    @el.insertBefore @wrapper
      .show()
      .removeData 'qingSelect'
    @popover.el.remove()
    @wrapper.remove()
    $(document).off '.qing-select'
    @

QingSelect.extend
  DataProvider: DataProvider
  Option: Option
  HtmlSelect: HtmlSelect
  MultipleResultBox: MultipleResultBox
  ResultBox: ResultBox
  Popover: Popover
  SearchBox: SearchBox
  OptionsList: OptionsList

module.exports = QingSelect
