Option = require './option.coffee'

class GroupOption extends QingModule

  constructor: (option) ->
    @name = option[0]
    if option[1][0] instanceof Option
      @options = option[1]
    else
      @options = (new Option(option) for option in option[1])

module.exports = GroupOption
