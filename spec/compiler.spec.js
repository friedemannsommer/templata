const templata = require('../index')
const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

function run() {
    describe('Templata.Compiler', function () {
        describe('Templata.Compiler#settings', function () {
            it('settings should be a Object', function () {
                expect(templata.compiler.settings).to.be.an('object')
            })

            it('settings should be all Uppercase',
                function () {
                    const keys = Object.keys(templata.compiler.settings)

                    keys.forEach(function (value) {
                        expect(value).to.be.equal(value.toUpperCase())
                    })
                }
            )

            it('settings should have non empty default values',
                function () {
                    const keys = Object.keys(templata.compiler.settings)
                    let allNonEmpty = true

                    keys.forEach((value) => {
                        expect(templata.compiler.settings[value]).to.be.not.empty
                    })
                }
            )
        })

        describe('Templata.Compiler#constructor', function () {
            it('constructor should return valid instance',
                function () {
                    const compiler = new templata.compiler()

                    expect(compiler).to.be.an.instanceof(templata.compiler)
                }
            )
        })

        /* Import */

        describe('Templata.Compiler#registerImport', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('registerImport should add import',
                function () {
                    compiler.registerImport('test', true)

                    // accessing private property (! dont do this !)
                    expect(compiler._importNames).to.include('test')
                    expect(compiler._importValues).to.include(true)
                }
            )

            it('registerImport should not throw an error when import already exists',
                function () {
                    expect(compiler.registerImport.bind(compiler, 'test', true))
                        .to.not.throw(Error)
                    expect(compiler.registerImport.bind(compiler, 'test', true))
                        .to.not.throw(Error)
                }
            )
        })

        describe('Templata.Compiler#hasImport', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('hasImport should return false if import does not exist',
                function () {
                    expect(compiler.hasImport('not-existing')).to.be.false
                }
            )

            it('hasImport should return true if import does exist',
                function () {
                    compiler.registerImport('existing', true)
                    expect(compiler.hasImport('existing')).to.be.true
                }
            )
        })

        describe('Templata.Compiler#removeImport', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('removeImport should remove given import',
                function () {
                    compiler.registerImport('test', true)
                    compiler.removeImport('test')

                    // accessing private property (! dont do this !)
                    expect(compiler._importNames).to.not.include('test')
                    expect(compiler._importValues).to.not.include(true)
                }
            )

            it('removeImport should not throw an exception when import does not exist',
                function () {
                    expect(compiler.removeImport.bind(compiler, 'test'))
                        .to.not.throw(Error)
                }
            )
        })

        /* Helper */

        describe('Templata.Compiler#registerHelper', function () {
            let compiler
            let helper = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('registerHelper should throw an exception when operator starts with closing-sign',
                function () {
                    expect(compiler.registerHelper.bind(compiler, '/op', helper))
                        .to.throw(Error)
                }
            )

            it('registerHelper should not throw an exception when operator already exists',
                function () {
                    expect(compiler.registerHelper.bind(compiler, 'op', helper))
                        .to.not.throw(Error)
                }
            )

            it('registerHelper should add helper',
                function () {
                    compiler.registerHelper('op', helper)

                    // accessing private property (! dont do this !)
                    expect(compiler._helper).to.have.property('op', helper)
                }
            )
        })

        describe('Templata.Compiler#hasHelper', function () {
            let compiler
            let helper = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('hasHelper should return false if helper does not exist',
                function () {
                    expect(compiler.hasHelper('op')).to.be.false
                }
            )

            it('hasHelper should return true if helper does exist',
                function () {
                    compiler.registerHelper('op', helper)
                    expect(compiler.hasHelper('op')).to.be.true
                }
            )
        })

        describe('Templata.Compiler#removeHelper', function () {
            let compiler
            let helper = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('removeHelper should remove given helper',
                function () {
                    compiler.registerHelper('op', helper)
                    compiler.removeHelper('op')

                    expect(compiler._helper).to.not.have.property('op')
                }
            )

            it('removeHelper should not throw an exception when helper does not exist',
                function () {
                    expect(compiler.removeHelper.bind(compiler, 'op'))
                        .to.not.throw(Error)
                }
            )
        })

        /* Filter */

        describe('Templata.Compiler#registerFilter', function () {
            let compiler
            let filter = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('registerFilter should not throw an exception when filter already exists',
                function () {
                    expect(compiler.registerFilter.bind(compiler, 'filter', filter))
                        .to.not.throw(Error)
                }
            )

            it('registerFilter should add filter',
                function () {
                    compiler.registerFilter('filter', filter)

                    // accessing private property (! dont do this !)
                    expect(compiler._filter).to.have.property('filter', filter)
                }
            )
        })

        describe('Templata.Compiler#hasFilter', function () {
            let compiler
            let filter = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('hasFilter should return false if filter does not exist',
                function () {
                    expect(compiler.hasFilter('filter')).to.be.false
                }
            )

            it('hasFilter should return true if filter does exist',
                function () {
                    compiler.registerFilter('filter', filter)
                    expect(compiler.hasFilter('filter')).to.be.true
                }
            )
        })

        describe('Templata.Compiler#removeFilter', function () {
            let compiler
            let filter = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('removeFilter should remove given filter',
                function () {
                    compiler.registerFilter('filter', filter)
                    compiler.removeFilter('filter')

                    // accessing private property (! dont do this !)
                    expect(compiler._filter).to.not.have.property('filter')
                }
            )

            it('removeFilter should not throw an exception when helper does not exist',
                function () {
                    expect(compiler.removeFilter.bind(compiler, 'filter'))
                        .to.not.throw(Error)
                }
            )
        })

        /* Provider */

        describe('Templata.Compiler#registerProvider', function () {
            let compiler
            let provider = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('registerProvider should not throw an exception when provider already exists',
                function () {
                    expect(compiler.registerProvider.bind(compiler, 'provider', provider))
                        .to.not.throw(Error)
                }
            )

            it('registerProvider should add provider',
                function () {
                    compiler.registerProvider('provider', provider)

                    // accessing private property (! dont do this !)
                    expect(compiler._provider).to.have.property('provider', provider)
                }
            )
        })

        describe('Templata.Compiler#hasProvider', function () {
            let compiler
            let provider = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('hasProvider should return false if provider does not exist',
                function () {
                    expect(compiler.hasProvider('provider')).to.be.false
                }
            )

            it('hasProvider should return true if provider does exist',
                function () {
                    compiler.registerProvider('provider', provider)
                    expect(compiler.hasProvider('provider')).to.be.true
                }
            )
        })

        describe('Templata.Compiler#removeProvider', function () {
            let compiler
            let provider = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('removeProvider should remove given provider',
                function () {
                    compiler.registerProvider('provider', provider)
                    compiler.removeProvider('provider')

                    // accessing private property (! dont do this !)
                    expect(compiler._provider).to.not.have.property('provider')
                }
            )

            it('removeProvider should not throw an exception when provider does not exist',
                function () {
                    expect(compiler.removeProvider.bind(compiler, 'provider'))
                        .to.not.throw(Error)
                }
            )
        })

        describe('Templata.Compiler#callProvider', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('callProvider should call given provider',
                function (done) {
                    let provider = () => { done() }

                    compiler.registerProvider('partial', provider)
                    compiler.callProvider('partial')
                }
            )

            it('callProvider should call given provider with given data',
                function (done) {
                    let provider = (name, templateString) => {
                        expect(templateString).to.be.an('string')
                        expect(templateString).to.equal('template-string')
                        done()
                    }

                    compiler.registerProvider('partial', provider)
                    compiler.callProvider('partial', 'template-string')
                }
            )
        })

        /* Listener */

        describe('Templata.Compiler#on', function () {
            let compiler
            let callback = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('on should add listener',
                function () {
                    compiler.on('SOME_EVENT', callback)

                    // accessing private property (! dont do this !)
                    expect(compiler._listener).to.have.property('SOME_EVENT')
                    expect(compiler._listener['SOME_EVENT']).to.include(callback)
                }
            )
        })

        describe('Templata.Compiler#off', function () {
            let compiler
            let callback = () => { }

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('off should remove listener',
                function () {
                    compiler.on('SOME_EVENT', callback)
                    compiler.off('SOME_EVENT', callback)

                    // accessing private property (! dont do this !)
                    expect(compiler._listener).to.have.property('SOME_EVENT')
                    expect(compiler._listener['SOME_EVENT']).to.not.include(callback)
                }
            )
        })

        describe('Templata.Compiler#dispatch', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('dispatch should call listener',
                function (done) {
                    let cb = () => { done() }
                    compiler.on('SOME_EVENT', cb)

                    // accessing private property (! dont do this !)
                    expect(compiler._listener).to.have.property('SOME_EVENT')
                    expect(compiler._listener['SOME_EVENT']).to.include(cb)
                    compiler.dispatch('SOME_EVENT')
                }
            )

            it('dispatch should call listener with given data',
                function (done) {
                    let data = [0, 1]

                    compiler.on('SOME_EVENT', (name, templataCompiler, ...data) => {
                        expect(data).to.equal(data)
                        done()
                    })

                    compiler.dispatch('SOME_EVENT')
                }
            )

            it('dispatch should call all listener',
                function (done) {
                    let called = 0
                    let noop = () => { ++called }

                    compiler.on('SOME_EVENT', noop)
                    compiler.on('SOME_EVENT', noop)
                    compiler.on('SOME_EVENT', noop)
                    compiler.on('SOME_EVENT', noop)
                    compiler.on('SOME_EVENT', () => {
                        ++called
                        expect(called).to.equal(5)
                        done()
                    })

                    compiler.dispatch('SOME_EVENT')
                }
            )
        })

        /* Initialize */

        describe('Templata.Compiler#initialize', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('initialize should call given function with compiler reference',
                function (done) {
                    compiler.initialize((_compiler) => {
                        expect(_compiler).to.be.an.instanceof(templata.compiler)
                        expect(_compiler).to.equal(compiler)
                        done()
                    })
                }
            )
        })

        /* Compile */

        describe('Templata.Compiler#compile', function () {
            let compiler

            beforeEach(function () {
                compiler = new templata.compiler()
            })

            it('compile should return a function',
                function () {
                    const compiledFn = compiler.compile('')

                    expect(compiledFn).to.be.a('function')
                    // function only takes 1 argument (data)
                    expect(compiledFn).to.have.lengthOf(1)
                }
            )

            it('compile should return a function which return the same string as given before to compile (no template blocks)',
                function () {
                    expect(compiler.compile('')()).to.equal('')
                }
            )

            it('compile should return a function which returns a new template string (registered helper)',
                function () {
                    compiler.registerHelper('+', () => {
                        return 'replaced by helper'
                    })

                    expect(compiler.compile('{{+ +}}')()).to.equal('replaced by helper')
                }
            )

            it('compile should return new template string (registered helper)',
                function () {
                    compiler.registerHelper('=', () => {
                        return 'replaced by helper'
                    })

                    compiler.registerFilter('filter', () => {
                        return 'replaced by filter'
                    })

                    expect(compiler.compile('{{= "hi" | filter =}}')()).to.equal('replaced by filter')
                }
            )

            it('compile should call helper with all block parameter',
                function (done) {
                    compiler.registerHelper('=',
                        (operator, parameter, selfClosingTag, closingTag, buffer, _compiler) => {
                            expect(operator).to.equal('=')
                            expect(operator).to.be.an('string')
                            expect(parameter).to.be.an('string')
                            expect(selfClosingTag).to.be.an('boolean')
                            expect(closingTag).to.be.an('boolean')
                            // accessing private property (! dont do this !)
                            expect(buffer).to.equal(compiler.buffer)
                            expect(_compiler).to.equal(compiler)
                            expect(_compiler).to.be.an.instanceof(templata.compiler)
                            done()
                        }
                    )

                    compiler.compile('{{= =}}')
                }
            )

            it('compile should call filter with all buffer parameter',
                function (done) {
                    compiler.registerHelper('=', (operator) => {
                        return operator
                    })

                    compiler.registerFilter('filter',
                        (name, input, buffer, _compiler) => {
                            expect(name).to.equal('filter')
                            expect(name).to.be.an('string')
                            expect(input).to.be.an('string')
                            // accessing private property (! dont do this !)
                            expect(buffer).to.equal(compiler.buffer)
                            expect(buffer).to.be.an('object')
                            expect(_compiler).to.equal(compiler)
                            expect(_compiler).to.be.an.instanceof(templata.compiler)
                            done()
                        }
                    )

                    compiler.compile('{{= "hi" | filter =}}')
                }
            )
        })
    })
}

module.exports = run
