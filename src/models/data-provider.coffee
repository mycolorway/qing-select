Option = require './option.coffee'

class DataProvider extends QingModule

  @opts:
    remote: false
    options: []
    totalOptionSize: null

  constructor: (opts) ->
    super
    $.extend @opts, DataProvider.opts, opts

    @remote = @opts.remote
    @options = (new Option(option) for option in @opts.options)
    @totalSize = @opts.totalSize

  _fetch: (value, callback) ->
    return if !@remote || @trigger('beforeFetch') == false

    onFetch = (result) =>
      options = (new Option(option) for option in result.options)
      @trigger 'fetch', [options, result.totalSize, value]
      callback?.call @, options, result.totalSize

    $.ajax
      url: @remote.url
      data: $.extend {}, @remote.params,
        "#{@remote.searchKey}": value
      dataType: 'json'
    .done (result) ->
      onFetch result

  filter: (value, callback) ->
    afterFilter = (options, totalSize) =>
      options = options.filter (option, i) =>
        !option.selected
      callback?.call @, options, totalSize
      @trigger 'filter', [options, totalSize, value]

    if @remote
      if value
        @_fetch value, afterFilter
      else
        afterFilter @options, @totalSize
    else
      options = []
      $.each @options, (i, option) ->
        options.push(option) if option.match(value)
      afterFilter options, options.length
    null

module.exports = DataProvider
