QingSelect = require '../src/qing-select'
expect = chai.expect

describe 'QingSelect', ->

  select = null
  multipleSelect = null

  beforeEach ->
    $select = $("""
      <select id="select-one">
        <optgroup label="Swedish Cars">
          <option value="volvo" data-hint="car 1">Volvo</option>
          <option value="saab" data-hint="car 2">Saab</option>
        </optgroup>
        <optgroup label="German Cars">
          <option value="mercedes" data-hint="car 3">Mercedes</option>
          <option value="audi" data-hint="car 4" selected>Audi</option>
        </optgroup>
      </select>
    """).appendTo 'body'

    $multipleSelect = $("""
      <select id="select-two" multiple="true">
        <option value="">select something</option>
        <option value="0" data-key="George Washington" selected>George Washington</option>
        <option value="1" data-key="John Adams">John Adams</option>
        <option value="2" data-key="Thomas Jefferson">Thomas Jefferson</option>
      </select>
    """).appendTo 'body'

    select = new QingSelect
      el: $('#select-one')

    multipleSelect = new QingSelect
      el: $('#select-two')

  afterEach ->
    select?.destroy()
    multipleSelect?.destroy()
    select = null
    multipleSelect = null

  it 'should inherit from QingModule', ->
    expect(select).to.be.instanceof QingModule
    expect(select).to.be.instanceof QingSelect
