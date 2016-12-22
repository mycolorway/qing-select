SearchBox = require './search-box.coffee'
OptionsList = require './options-list.coffee'

class Popover extends QingModule

  @opts:
    wrapper: null
    dataProvider: null
    locales: null
    maxListSize: 0
    searchableSize: 8
    optionRenderer: null

  _setOptions: (opts) ->
    super
    $.extend @opts, Popover.opts, opts

  _init: ->
    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @active = false
    @dataProvider = @opts.dataProvider
    @searchable = @dataProvider.totalOptionSize > @dataProvider.options.length ||
      @dataProvider.options.length > @opts.searchableSize
    @_render()
    @_initChildComponents()
    @_bind()

  _render: ->
    @el = $('<div class="qing-select-popover">')

  _initChildComponents: ->
    @searchBox = new SearchBox
      wrapper: @el
      placeholder: @opts.locales.searchPlaceholder
      hidden: !@searchable

    @optionsList = new OptionsList
      wrapper: @el
      locales: @opts.locales
      options: @dataProvider.options
      optionRenderer: @opts.optionRenderer
      totalOptionSize: @dataProvider.totalOptionSize
      maxListSize: @opts.maxListSize

  _bind: ->
    @searchBox.on 'change', (e, val) =>
      @optionsList.setLoading true
      @dataProvider.filter val

    @dataProvider.on 'filter', (e, result, value) =>
      @optionsList.setLoading false
      @optionsList.renderOptions result.options, result.totalSize
      @optionsList.highlightNextOption() unless @optionsList.highlighted

    @searchBox.on 'enterPress', (e) =>
      if @optionsList.highlighted
        @_selectOption @optionsList.highlighted

    @searchBox.on 'escapePress', (e) =>
      @setActive false

    @searchBox.on 'arrowPress', (e, direction) =>
      if direction == 'up'
        @optionsList.highlightPrevOption()

      else if direction == 'down'
        @optionsList.highlightNextOption()

    @optionsList.on 'optionClick', (e, $option) =>
      @_selectOption $option

  _selectOption: ($option) ->
    option = $option.data 'option'
    @optionsList.setHighlighted option.value
    @searchBox.textField.val ''
    @trigger 'select', [option]

  setActive: (active) ->
    return if active == @active

    if active
      @el.addClass('active')
        .appendTo @opts.appendTo
      @trigger 'show'
      @searchBox.focus()
    else
      @el.removeClass('active')
        .detach()
      @trigger 'hide'

    @active = active
    @

module.exports = Popover
