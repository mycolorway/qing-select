
class OptionsList extends QingModule

  @opts:
    wrapper: null
    locales: null
    options: null
    totalOptionSize: null
    maxListSize: 0

  constructor: (opts) ->
    super
    $.extend @opts, OptionsList, opts

    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @highlighted = false
    @_render()
    @_bind()

  _render: ->
    @el = $ '<div class="options-list"></div>'
      .appendTo @wrapper

    if @opts.options
      @renderOptions @opts.options, @opts.totalOptionSize

  _bind: ->
    @el.on 'click', '.option', (e) =>
      $option = $ e.currentTarget
      @setHighlighted $option
      @trigger 'optionClick', [$option]
      null

  renderOptions: (options = [], totalOptionSize) ->
    options = options.slice 0, @opts.maxListSize
    @el.empty()
    @highlighted = false

    if options.length > 0
      @el.append(@_optionEl(option) for option in options)
    else if !totalOptionSize
      @_renderEmpty()

    if totalOptionSize && totalOptionSize > options.length
      @_renderHiddenSize(totalOptionSize - options.length)

    @setHighlighted @el.find('.option:first')

  _optionEl: (option) ->
    $optionEl = $("""
      <div class="option">
        <span class="label"></span>
        <span class="hint"></span>
      </div>
    """).data('option', option)
    $optionEl.find('.label').text(option.name)
    $optionEl.find('.hint').text(option.data.hint) if option.data.hint
    $optionEl.attr 'data-value', option.value
    $optionEl.data 'option', option

    if $.isFunction @opts.opitonRenderer
      @opts.opitonRenderer.call(@, $optionEl, option)

    $optionEl

  _renderEmpty: ->
    @el.append """
      <div class="no-options">#{@opts.locales.noOptions}</div>
    """

  _renderHiddenSize: (size) ->
    text = @opts.locales.hiddenSize.replace(/\{\{\s?size\s?\}\}/g, size)
    @el.append """
      <div class="hidden-size">#{text}</div>
    """

  setHighlighted: (highlighted) ->
    unless typeof highlighted == 'object'
      highlighted = @el.find(".option[data-value='#{highlighted}']")

    return unless highlighted.length > 0

    @highlighted.removeClass('highlighted') if @highlighted
    @highlighted = highlighted.addClass('highlighted')
    @

  highlightNextOption: ->
    if @highlighted
      $nextOption = @highlighted.next('.option')
    else
      $nextOption = @el.find('.option:first')

    @setHighlighted($nextOption) if $nextOption.length > 0

  highlightPrevOption: ->
    if @highlighted
      $prevOption = @highlighted.prev('.option')
    else
      $prevOption = @el.find('.option:first')

    @setHighlighted($prevOption) if $prevOption.length > 0


module.exports = OptionsList
