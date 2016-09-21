
class OptionsList extends QingModule

  @opts:
    wrapper: null
    locales: null
    options: null
    opitonRenderer: null
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
    @el.empty().css('min-height', 0)
    @highlighted = false

    if options.length > 0
      @el.append(@_optionEl(option) for option in options)
      if totalOptionSize > options.length
        @_renderHiddenSize(totalOptionSize - options.length)
    else
      @_renderEmpty()

    @setHighlighted(@el.find('.option:first')) unless @highlighted

  _optionEl: (option) ->
    $optionEl = $("""
      <div class="option">
        <div class="left">
          <span class="name"></span>
        </div>
        <div class="right">
          <span class="hint"></span>
        </div>
      </div>
    """).data('option', option)
    $optionEl.find('.name').text(option.name)
    $optionEl.find('.hint').text(option.data.hint) if option.data.hint
    $optionEl.attr 'data-value', option.value
    $optionEl.data 'option', option

    @setHighlighted($optionEl) if option.selected

    if $.isFunction @opts.opitonRenderer
      @opts.opitonRenderer.call(@, $optionEl, option)

    $optionEl

  _renderEmpty: ->
    @el.append """
      <div class="no-options">#{@opts.locales.noOptions}</div>
    """

  _renderHiddenSize: (size) ->
    text = @opts.locales.hiddenSize.replace(/\__size__\}/g, size)
    @el.append """
      <div class="hidden-size">#{text}</div>
    """

  setLoading: (loading) ->
    return if loading == @loading
    @el.toggleClass 'loading', loading

    if loading
      @el.append """
        <div class="loading-message">#{@opts.locales.loading}</div>
      """
    else
      @el.find('.loading').remove()

    @loading = loading
    @

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
