DataProvider = require './models/data-provider.coffee'
HtmlSelect = require './html-select.coffee'
MultipleResultBox = require './multiple-result-box.coffee'
ResultBox = require './result-box.coffee'
Popover = require './popover.coffee'

class QingSelect extends QingModule

  @name: 'QingSelect'

  @opts:
    el: null
    remote: false
    totalOptionSize: null
    maxListSize: 20
    locales: null

  @locales:
    searchPlaceholder: 'Search'
    noOptions: 'Found nothing.'
    hiddenSize: '{{ size }} more records are hidden, please search for them.'

  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingSelect: option el is required'

    @opts = $.extend {}, QingSelect.opts, @opts
    @locales = $.extend {}, QingSelect.locales, @opts.locales
    @active = false
    @_render()
    @_initChildComponents()
    @_bind()

  _render: ->
    @wrapper = $('<div class="qing-select"></div>').insertBefore @el
    @el.addClass ' qing-select'
      .appendTo @wrapper
      .data 'qingSelect', @

  _initChildComponents: ->
    @htmlSelect = new HtmlSelect
      el: @el

    options = @htmlSelect.getOptions()
    @dataProvider = new DataProvider
      remote: @opts.remote
      options: options
      totalOptionSize: @opts.totalOptionSize || options.length

    @multiple = @el.is '[multiple]'
    selected = @dataProvider.options.filter (option) -> option.selected
    @resultBox = if @multiple
      new MultipleResultBox
        wrapper: @wrapper
        placeholder: @_placeholder()
        selected: selected
    else
      new ResultBox
        wrapper: @wrapper
        placeholder: @_placeholder()
        selected: if selected.length > 0 then selected[0] else false

    @popover = new Popover
      wrapper: @wrapper
      dataProvider: @dataProvider
      locales: @locales
      maxListSize: @opts.maxListSize

  _bind: ->
    if @multiple
      @resultBox.on 'addClick', (e) =>
        @_setActive true

      @resultBox.on 'optionClick', (e, option) =>
        @unselectOption option
    else
      @resultBox.on 'click', (e) =>
        @_setActive !@active

      @resultBox.on 'clearClick', (e) =>
        return unless @resultBox.selected
        @unselectOption @resultBox.selected

    @popover.on 'select', (e, option) =>
      @selectOption option

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

    $(document).off '.qing-select'
    if active
      $(document).one 'mousedown.qing-select', (e) =>
        return if e.target == @el[0] || $.contains(@el[0], e.target)
        @_setActive false

    @active = active
    @

  selectOption: (option) ->
    if @multiple
      @resultBox.addSelected option
    else
      @resultBox.setSelected option

    @htmlSelect.selectOption option
    @_setActive false
    @

  unselectOption: (option) ->
    if @multiple
      @resultBox.removeSelected option
    else
      @resultBox.setSelected false

    @htmlSelect.unselectOption option
    @_setActive false
    @

  destroy: ->
    @el.empty()
      .removeData 'qingSelect'
    $(document).off '.qing-select'
    @

module.exports = QingSelect
