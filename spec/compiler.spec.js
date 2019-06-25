const templata = require('../index')

require('mocha')
const chai = require('chai')

const expect = chai.expect

/* eslint-disable no-underscore-dangle, no-unused-expressions */
describe('Templata.Compiler', () => {
    describe('Templata.Compiler#settings', () => {
        it('settings should be a Object', () => {
            expect(templata.Compiler.settings).to.be.an('object')
        })

        it('settings should be all Uppercase',
            () => {
                const keys = Object.keys(templata.Compiler.settings)

                keys.forEach((value) => {
                    expect(value).to.be.equal(value.toUpperCase())
                })
            }
        )

        it('settings should have non empty default values',
            () => {
                const keys = Object.keys(templata.Compiler.settings)

                keys.forEach((value) => {
                    expect(templata.Compiler.settings[value]).to.be.not.empty
                })
            }
        )
    })

    describe('Templata.Compiler#constructor', () => {
        it('constructor should return valid instance',
            () => {
                const compiler = new templata.Compiler()

                expect(compiler).to.be.an.instanceof(templata.Compiler)
            }
        )
    })

    /* Import */

    describe('Templata.Compiler#registerImport', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('registerImport should add import',
            () => {
                compiler.registerImport('test', true)

                // accessing private property (! dont do this !)
                expect(compiler._importNames).to.include('test')
                expect(compiler._importValues).to.include(true)
            }
        )

        it('registerImport should not throw an error when import already exists',
            () => {
                expect(compiler.registerImport.bind(compiler, 'test', true))
                    .to.not.throw(Error)
                expect(compiler.registerImport.bind(compiler, 'test', true))
                    .to.not.throw(Error)
            }
        )
    })

    describe('Templata.Compiler#hasImport', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('hasImport should return false if import does not exist',
            () => {
                expect(compiler.hasImport('not-existing')).to.be.false
            }
        )

        it('hasImport should return true if import does exist',
            () => {
                compiler.registerImport('existing', true)
                expect(compiler.hasImport('existing')).to.be.true
            }
        )
    })

    describe('Templata.Compiler#removeImport', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('removeImport should remove given import',
            () => {
                compiler.registerImport('test', true)
                compiler.removeImport('test')

                // accessing private property (! dont do this !)
                expect(compiler._importNames).to.not.include('test')
                expect(compiler._importValues).to.not.include(true)
            }
        )

        it('removeImport should not throw an exception when import does not exist',
            () => {
                expect(compiler.removeImport.bind(compiler, 'test'))
                    .to.not.throw(Error)
            }
        )
    })

    /* Helper */

    describe('Templata.Compiler#registerHelper', () => {
        let compiler
        const helper = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('registerHelper should throw an exception when operator starts with closing-sign',
            () => {
                expect(compiler.registerHelper.bind(compiler, '/op', helper))
                    .to.throw(Error)
            }
        )

        it('registerHelper should not throw an exception when operator already exists',
            () => {
                expect(compiler.registerHelper.bind(compiler, 'op', helper))
                    .to.not.throw(Error)
            }
        )

        it('registerHelper should add helper',
            () => {
                compiler.registerHelper('op', helper)

                // accessing private property (! dont do this !)
                expect(compiler._helper).to.have.property('op', helper)
            }
        )
    })

    describe('Templata.Compiler#hasHelper', () => {
        let compiler
        const helper = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('hasHelper should return false if helper does not exist',
            () => {
                expect(compiler.hasHelper('op')).to.be.false
            }
        )

        it('hasHelper should return true if helper does exist',
            () => {
                compiler.registerHelper('op', helper)
                expect(compiler.hasHelper('op')).to.be.true
            }
        )
    })

    describe('Templata.Compiler#removeHelper', () => {
        let compiler
        const helper = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('removeHelper should remove given helper',
            () => {
                compiler.registerHelper('op', helper)
                compiler.removeHelper('op')

                expect(compiler._helper).to.not.have.property('op')
            }
        )

        it('removeHelper should not throw an exception when helper does not exist',
            () => {
                expect(compiler.removeHelper.bind(compiler, 'op'))
                    .to.not.throw(Error)
            }
        )
    })

    /* Filter */

    describe('Templata.Compiler#registerFilter', () => {
        let compiler
        const filter = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('registerFilter should not throw an exception when filter already exists',
            () => {
                expect(compiler.registerFilter.bind(compiler, 'filter', filter))
                    .to.not.throw(Error)
            }
        )

        it('registerFilter should add filter',
            () => {
                compiler.registerFilter('filter', filter)

                // accessing private property (! dont do this !)
                expect(compiler._filter).to.have.property('filter', filter)
            }
        )
    })

    describe('Templata.Compiler#hasFilter', () => {
        let compiler
        const filter = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('hasFilter should return false if filter does not exist',
            () => {
                expect(compiler.hasFilter('filter')).to.be.false
            }
        )

        it('hasFilter should return true if filter does exist',
            () => {
                compiler.registerFilter('filter', filter)
                expect(compiler.hasFilter('filter')).to.be.true
            }
        )
    })

    describe('Templata.Compiler#removeFilter', () => {
        let compiler
        const filter = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('removeFilter should remove given filter',
            () => {
                compiler.registerFilter('filter', filter)
                compiler.removeFilter('filter')

                // accessing private property (! dont do this !)
                expect(compiler._filter).to.not.have.property('filter')
            }
        )

        it('removeFilter should not throw an exception when helper does not exist',
            () => {
                expect(compiler.removeFilter.bind(compiler, 'filter'))
                    .to.not.throw(Error)
            }
        )
    })

    /* Provider */

    describe('Templata.Compiler#registerProvider', () => {
        let compiler
        const provider = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('registerProvider should not throw an exception when provider already exists',
            () => {
                expect(compiler.registerProvider.bind(compiler, 'provider', provider))
                    .to.not.throw(Error)
            }
        )

        it('registerProvider should add provider',
            () => {
                compiler.registerProvider('provider', provider)

                // accessing private property (! dont do this !)
                expect(compiler._provider).to.have.property('provider', provider)
            }
        )
    })

    describe('Templata.Compiler#hasProvider', () => {
        let compiler
        const provider = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('hasProvider should return false if provider does not exist',
            () => {
                expect(compiler.hasProvider('provider')).to.be.false
            }
        )

        it('hasProvider should return true if provider does exist',
            () => {
                compiler.registerProvider('provider', provider)
                expect(compiler.hasProvider('provider')).to.be.true
            }
        )
    })

    describe('Templata.Compiler#removeProvider', () => {
        let compiler
        const provider = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('removeProvider should remove given provider',
            () => {
                compiler.registerProvider('provider', provider)
                compiler.removeProvider('provider')

                // accessing private property (! dont do this !)
                expect(compiler._provider).to.not.have.property('provider')
            }
        )

        it('removeProvider should not throw an exception when provider does not exist',
            () => {
                expect(compiler.removeProvider.bind(compiler, 'provider'))
                    .to.not.throw(Error)
            }
        )
    })

    describe('Templata.Compiler#callProvider', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('callProvider should call given provider',
            (done) => {
                const provider = () => { done() }

                compiler.registerProvider('partial', provider)
                compiler.callProvider('partial')
            }
        )

        it('callProvider should call given provider with given data',
            (done) => {
                const provider = (name, templateString) => {
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

    describe('Templata.Compiler#on', () => {
        let compiler
        const callback = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('on should add listener',
            () => {
                compiler.on('SOME_EVENT', callback)

                // accessing private property (! dont do this !)
                expect(compiler._listener).to.have.property('SOME_EVENT')
                expect(compiler._listener.SOME_EVENT).to.include(callback)
            }
        )
    })

    describe('Templata.Compiler#off', () => {
        let compiler
        const callback = () => { }

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('off should remove listener',
            () => {
                compiler.on('SOME_EVENT', callback)
                compiler.off('SOME_EVENT', callback)

                // accessing private property (! dont do this !)
                expect(compiler._listener).to.have.property('SOME_EVENT')
                expect(compiler._listener.SOME_EVENT).to.not.include(callback)
            }
        )
    })

    describe('Templata.Compiler#dispatch', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('dispatch should call listener',
            (done) => {
                const cb = () => { done() }
                compiler.on('SOME_EVENT', cb)

                // accessing private property (! dont do this !)
                expect(compiler._listener).to.have.property('SOME_EVENT')
                expect(compiler._listener.SOME_EVENT).to.include(cb)
                compiler.dispatch('SOME_EVENT')
            }
        )

        it('dispatch should call listener with given data',
            (done) => {
                compiler.on('SOME_EVENT', (name, templataCompiler, ...eventData) => {
                    expect(eventData).to.deep.equal([0, 1])
                    done()
                })

                compiler.dispatch('SOME_EVENT', 0, 1)
            }
        )

        it('dispatch should call all listener',
            (done) => {
                let called = 0
                const noop = () => { ++called }

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

    describe('Templata.Compiler#initialize', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('initialize should call given function with compiler reference',
            (done) => {
                compiler.initialize((_compiler) => {
                    expect(_compiler).to.be.an.instanceof(templata.Compiler)
                    expect(_compiler).to.equal(compiler)
                    done()
                })
            }
        )
    })

    /* Compile */

    describe('Templata.Compiler#compile', () => {
        let compiler

        beforeEach(() => {
            compiler = new templata.Compiler()
        })

        it('compile should throw a error when non string passed as first argument',
            () => {
                expect(compiler.compile).to.throw(Error)
            }
        )

        it('compile should return a function',
            () => {
                const compiledFn = compiler.compile('')

                expect(compiledFn).to.be.a('function')
                // function only takes 1 argument (data)
                expect(compiledFn).to.have.lengthOf(1)
            }
        )

        it('compile should return a function which return the same string as given before to compile (no template blocks)',
            () => {
                expect(compiler.compile('')()).to.equal('')
            }
        )

        it('compile should return a function which returns a new template string (registered helper)',
            () => {
                compiler.registerHelper('+', () => 'replaced by helper')

                expect(compiler.compile('{{+ +}}')()).to.equal('replaced by helper')
            }
        )

        it('compile should return new template string (registered helper)',
            () => {
                compiler.registerHelper('=', () => 'replaced by helper')

                compiler.registerFilter('filter', () => 'replaced by filter')

                expect(compiler.compile('{{= "hi" | filter =}}')()).to.equal('replaced by filter')
            }
        )

        it('compile should call helper with all block parameter',
            (done) => {
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
                        expect(_compiler).to.be.an.instanceof(templata.Compiler)
                        done()
                    }
                )

                compiler.compile('{{= =}}')
            }
        )

        it('compile should call filter with all buffer parameter',
            (done) => {
                compiler.registerHelper('=', operator => operator)

                compiler.registerFilter('filter',
                    (name, input, buffer, _compiler) => {
                        expect(name).to.equal('filter')
                        expect(name).to.be.an('string')
                        expect(input).to.be.an('string')
                        // accessing private property (! dont do this !)
                        expect(buffer).to.equal(compiler.buffer)
                        expect(buffer).to.be.an('object')
                        expect(_compiler).to.equal(compiler)
                        expect(_compiler).to.be.an.instanceof(templata.Compiler)
                        done()
                    }
                )

                compiler.compile('{{= "hi" | filter =}}')
            }
        )
    })
})
