class Option

  constructor: (option) ->
    @name = option[0]
    @value = option[1].toString()
    @data = {}

    if option.length > 2 && $.isPlainObject(option[2])
      $.each option[2], (key, value) =>
        key = key.replace(/^data-/, '').split('-')
        # camel case format
        $.each key, (i, part) ->
          # capitalize
          key[i] = part.charAt(0).toUpperCase() + part.slice(1) if i > 0
        @data[key.join('')] = value
        null

    @selected = @data.selected || false

  match: (value) ->
    filterKey = @data.searchKey || @name
    filterKey.indexOf(value) > -1

module.exports = Option
