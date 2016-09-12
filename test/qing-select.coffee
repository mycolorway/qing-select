QingSelect = require '../src/qing-select'
expect = chai.expect

describe 'QingSelect', ->

  $el = null
  qingSelect = null

  before ->
    $el = $('<div class="test-el"></div>').appendTo 'body'

  after ->
    $el.remove()
    $el = null

  beforeEach ->
    sample = new QingSelect
      el: '.test-el'

  afterEach ->
    qingSelect.destroy()
    qingSelect = null

  it 'should inherit from QingModule', ->
    expect(sample).to.be.instanceof QingModule
    expect(sample).to.be.instanceof QingSelect

  it 'should throw error when element not found', ->
    spy = sinon.spy QingSelect
    try
      new spy
        el: '.not-exists'
    catch e

    expect(spy.calledWithNew()).to.be.true
    expect(spy.threw()).to.be.true
