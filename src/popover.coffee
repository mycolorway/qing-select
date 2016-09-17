SearchBox = require './search-box.coffee'
OptionsList = require './options-list.coffee'

class Popover extends QingModule

  @opts:
    wrapper: null
    dataProvider: null
    locales: null
    maxListSize: 0

  constructor: (opts) ->
    super
    $.extend @opts, SearchBox.opts, opts

    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @active = false
    @dataProvider = @opts.dataProvider
    @_render()
    @_initChildComponents()
    @_bind()

  _render: ->
    @el = $('<div class="popover">').appendTo @wrapper

  _initChildComponents: ->
    @searchBox = new SearchBox
      wrapper: @el
      placeholder: @opts.locales.searchPlaceholder

    @optionsList = new OptionsList
      wrapper: @el
      locales: @opts.locales
      options: @dataProvider.options
      totalOptionSize: @dataProvider.totalOptionSize
      maxListSize: @opts.maxListSize

  _bind: ->
    @searchBox.on 'change', (e, val) =>
      @dataProvider.filter val, (options, totalSize) =>
        @optionsList.renderOptions options, totalSize

    @searchBox.on 'enterPress', (e) =>
      if @optionsList.highlighted
        @_selectOption @optionsList.highlighted

    @searchBox.on 'arrowPress', (e, direction) =>
      if direction == 'up'
        @optionsList.highlightPrevOption()
      else if direction == 'down'
        @optionsList.highlightNextOption()

    @optionsList.on 'optionClick', (e, $option) =>
      @_selectOption $option

  _selectOption: ($option) ->
    option = $option.data 'option'
    @searchBox.setValue ''
    @optionsList.setHighlighted option.value
    @trigger 'select', [option]

  setActive: (active) ->
    return if active == @active
    @el.toggleClass 'active', active
    @searchBox.focus()
    @active = active
    @

module.exports = Popover
