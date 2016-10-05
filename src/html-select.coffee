
class HtmlSelect extends QingModule

  @opts:
    el: null

  constructor: (opts) ->
    super
    $.extend @opts, HtmlSelect.opts, opts

    @el = $ @opts.el

  getOptions: ->
    options = []
    if @el.find('optgroup').length
      @el.find('optgroup').each (i, optgroupEl) =>
        option = @_parseOptgroupEl(optgroupEl)
        options.push option if option
    else
      @el.find('option').each (i, optionEl) =>
        option = @_parseOptionEl(optionEl)
        options.push option if option
    options

  selectOption: (option) ->
    $option = @el.find("option[value='#{option.value}']")
    unless $option.length > 0
      $option = @_renderOption(option).appendTo @el
    $option.prop 'selected', true
    @

  unselectOption: (option) ->
    $option = @el.find("option[value='#{option.value}']")
    $option.prop 'selected', false
    @

  _parseOptgroupEl: (optgroupEl) ->
    options = []
    $optgroup = $ optgroupEl
    groupName = $optgroup.prop('label')
    $optgroup.find('option').each (i, option) =>
      options.push @_parseOptionEl(option)
    [groupName, options]

  _parseOptionEl: (optionEl) ->
    $option = $ optionEl
    return false unless value = $option.val()
    data = $option.data()
    data.selected = true if $option.is(':selected')
    [$option.text(), value, data]

  _renderOption: (option) ->
    $ '<option>',
      text: option.name
      value: option.value
      data: option.data

  getValue: ->
    @el.val()

  setValue: (value) ->
    @el.val value
    @

  getBlankOption: ->
    $blankOption = @el.find('option:not([value]), option[value=""]')
    if $blankOption.length > 0 then $blankOption else false

module.exports = HtmlSelect
