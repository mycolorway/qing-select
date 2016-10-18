
class SearchBox extends QingModule

  @opts:
    wrapper: null
    placeholder: ''
    hidden: false
    renderer: null

  _setOptions: (opts) ->
    super
    $.extend @opts, SearchBox.opts, opts

  _init: ->
    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @_inputDelay = 200
    @_render()
    @_bind()

    if $.isFunction(@opts.renderer)
      @opts.renderer.call @, @wrapper, @

  _render: ->
    @el = $("""
      <div class="search-box">
        <input type="text" class="text-field" tabindex="-1"
          placeholder="#{@opts.placeholder}" />
        <span class="icon-search">&#128269;</span>
      </div>
    """).appendTo @wrapper

    @el.addClass('hidden') if @opts.hidden
    @textField = @el.find '.text-field'
    @el

  _bind: ->
    @textField.on 'input', (e) =>
      if @_inputTimer
        clearTimeout @_inputTimer
        @_inputTimer = null
      @_inputTimer = setTimeout =>
        @trigger 'change', [@textField.val()]
      , @_inputDelay

    @textField.on 'keydown', (e) =>
      if e.which == 13
        @trigger 'enterPress'
        return false
      else if e.which == 27
        @setValue ''
        @trigger 'escapePress'
      else if e.which == 38
        @trigger 'arrowPress', ['up']
      else if e.which == 40
        @trigger 'arrowPress', ['down']
      null

    @on 'change', (e, val) ->
      @el.toggleClass 'empty', !!val

  getValue: ->
    @textField.val()

  setValue: (val) ->
    @textField.val val
    @trigger 'change', [val]
    @

  focus: ->
    @textField.focus()
    @

module.exports = SearchBox
