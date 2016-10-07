Option = require './option.coffee'
GroupOption = require './group-option.coffee'

class DataProvider extends QingModule

  @opts:
    remote: false
    options: []
    totalOptionSize: null

  constructor: (opts) ->
    super
    $.extend @opts, DataProvider.opts, opts

    @remote = @opts.remote

    @options = if $.isArray @opts.options[0]?[1]
      new GroupOption(option) for option in @opts.options
    else
      new Option(option) for option in @opts.options
    @totalOptionSize = @opts.totalOptionSize

  _fetch: (value, callback) ->
    return if !@remote || @trigger('beforeFetch') == false

    onFetch = (result) =>
      if result.options instanceof Array
        result.options = (new Option(option) for option in result.options)
      else
        result.options = (new GroupOption([groupName, options]) for groupName, options of result.options)
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
        if option instanceof GroupOption
          opt = option.options.filter (option) ->
            option.match value
          options.push(new GroupOption([option.name, opt])) if opt.length
        else
          options.push(option) if option.match(value)
      afterFilter
        options: options
        totalSize: @size()
    null

  size: ()->
    return @options.length unless @options[0] instanceof GroupOption
    result = @options.reduce (length, option) ->
      length += option.options.length
    , 0

  getOption: (value) ->
    result = @options.filter (option, i) =>
      option.value == value
    if result.length > 0 then result[0] else null

DataProvider.extend
  Option: Option
  GroupOption: GroupOption

module.exports = DataProvider
