
class SearchBox extends QingModule

  @opts:
    wrapper: null
    placeholder: ''

  constructor: (opts) ->
    super
    $.extend @opts, SearchBox.opts, opts

    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @_inputDelay = 200
    @_render()
    @_bind()

  _render: ->
    @el = $("""
      <div class="search-box">
        <input type="text" class="text-field" tabindex="-1"
          placeholder="#{@opts.placeholder}" />
        <span class="icon-search">&#128269;</span>
        <a href="javascript:;" class="link-clear" tabindex="-1">X</a>
      </div>
    """).appendTo @wrapper

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
      else if e.which == 38
        @trigger 'arrowPress', ['up']
      else if e.which == 40
        @trigger 'arrowPress', ['down']
      null

    @el.on 'click', '.link-clear', (e) =>
      @textField.val ''
      @trigger 'change', ['']

    @on 'change', (e, val) ->
      @el.toggleClass 'empty', !!val

  getValue: ->
    @textField.val()

  setValue: (val) ->
    @textField.val val
    @trigger 'change', [val]
    @

module.exports = SearchBox
