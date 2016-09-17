
class MultipleResultBox extends QingModule

  @opts:
    wrapper: null
    placeholder: ''
    selected: false

  constructor: (opts) ->
    super
    $.extend @opts, MultipleResultBox.opts, opts

    @wrapper = $ @opts.wrapper
    return unless @wrapper.length > 0

    @active = false
    @disabled = false
    @selected = []
    @_render()
    @_bind()

    @addSelected(@opts.selected) if @opts.selected

  _render: ->
    @el = $("""
      <div class="result-box">
        <a class="link-add" href="javascript:;" tabindex="0">+</a>
      </div>
    """).appendTo @wrapper
    @linkAdd = @el.find '.link-add'

  _bind: ->
    @el.on 'click', '.link-add', (e) =>
      return if @disabled
      @trigger 'addClick'

    @el.on 'click', '.selected-option', (e) =>
      return if @disabled
      $option = $ e.currentTarget
      @trigger 'optionClick', [$option.data('option')]

    @linkAdd.on 'keydown', (e) =>
      return if @disabled
      if e.which in [13, 38, 40]
        @trigger 'addClick'

  addSelected: (option) ->
    if $.isArray option
      @addSelected(opt) for opt in option
      return
    
    $("""
      <a href="javascript:;" class="selected-option" data-value="#{option.value}">
        #{option.name}
      </a>
    """)
      .data 'option', option
      .insertBefore @linkAdd
    @selected.push option
    @

  removeSelected: (option) ->
    @el.find(".selected-option[data-value='#{option.value}']").remove()
    index = -1
    for opt, i in @selected
      if option.value == opt.value
        index = i
        break
    @selected.splice(index, 1) if index > -1
    @

  setActive: (active) ->
    return if active == @active
    @el.toggleClass 'active', active
    @active = active
    @

  setDisabled: (disabled) ->
    return if disabled == @disabled
    @el.toggleClass 'disabled', disabled
    @disabled = disabled
    @

module.exports = MultipleResultBox
