class QingSelect extends QingModule

  @opts:
    el: null

  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingSelect: option el is required'

    @opts = $.extend {}, QingSelect.opts, @opts
    @_render()
    @trigger 'ready'

  _render: ->
    @el.append """
      <p>This is a sample component.</p>
    """
    @el.addClass ' qing-select'
      .data 'qingSelect', @

  destroy: ->
    @el.empty()
      .removeData 'qingSelect'

module.exports = QingSelect
