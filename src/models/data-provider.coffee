Option = require './option.coffee'

class DataProvider extends QingModule

  @opts:
    remote: false
    options: []
    totalOptionSize: null

  _setOptions: (opts) ->
    super
    $.extend @opts, DataProvider.opts, opts

  _init: ->
    @remote = @opts.remote
    @totalOptionSize = @opts.totalOptionSize
    @setOptions @opts.options

  _fetch: (value, callback) ->
    return if !@remote || @trigger('beforeFetch') == false

    onFetch = (result) =>
      result.options = (new Option(option) for option in result.options)
      @trigger 'fetch', [result, value]
      callback?.call @, result

    $.ajax
      url: @remote.url
      data: $.extend {}, @remote.params,
        "#{@remote.searchKey}": value
      dataType: 'json'
    .done (result) ->
      onFetch result

  filter: (value, callback) ->
    afterFilter = (result) =>
      @trigger 'beforeFilterComplete', [result, value]
      @trigger 'filter', [result, value]
      callback?.call @, result

    if @remote && @options.length < @totalOptionSize
      if value
        @_fetch value, afterFilter
      else
        afterFilter
          options: @options
          totalSize: @totalOptionSize
    else
      options = []
      $.each @options, (i, option) ->
        options.push(option) if option.match(value)
      afterFilter
        options: options
        totalSize: options.length
    null

  getOption: (value) ->
    value = value.toString()
    result = @options.filter (option, i) =>
      option.value == value
    if result.length > 0 then result[0] else null

  setOptions: (options) ->
    @options = (new Option(option) for option in @opts.options)

module.exports = DataProvider
