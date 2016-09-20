
class ResultBox extends QingModule

  @opts:
    wrapper: null
    placeholder: ''
    selected: false

  constructor: (opts) ->
    super
    $.extend @opts, ResultBox.opts, opts

    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @active = false
    @disabled = false
    @_render()
    @_bind()

    @setSelected @opts.selected

  _render: ->
    @el = $("""
      <div class="result-box" tabindex="0">
        <div class="placeholder">#{@opts.placeholder}</div>
        <div class="result"></div>
        <i class="icon-expand"><span>&#9662;</span></i>
        <a class="link-clear" href="javascript:;" tabindex="-1">
          &#10005;
        </a>
      </div>
    """).appendTo @wrapper

  _bind: ->
    @el.on 'click', (e) =>
      return if @disabled
      @trigger 'click'

    @el.on 'click', '.link-clear', (e) =>
      return if @disabled
      @trigger 'clearClick'
      false

    @el.on 'keydown', (e) =>
      return if @disabled
      if e.which == 13
        @trigger 'enterPress'
        false
      else if e.which == 38
        @trigger 'arrowPress', ['up']
        false
      else if e.which == 40
        @trigger 'arrowPress', ['down']
        false

  setSelected: (selected) ->
    return if selected == @selected

    if selected
      @el.removeClass 'empty'
        .find('.result').text selected.name
    else
      @el.addClass 'empty'
        .find('.result').text ''

    @selected = selected
    @

  setActive: (active) ->
    return if active == @active
    @el.toggleClass 'active', active
    @active = active
    @

  setDisabled: (disabled) ->
    return if disabled == @disabled
    @el.toggleClass 'disabled', disabled
    if disabled
      @el.removeAttr 'tabindex'
    else
      @el.attr 'tabindex', '0'
    @disabled = disabled
    @

  focus: ->
    @el.focus()
    @

module.exports = ResultBox
