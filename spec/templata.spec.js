const templata = require('../index')

require('mocha')
const chai = require('chai')

const expect = chai.expect

function run() {
    describe('Templata.Template', () => {
        describe('Templata.Template#Interpolation',
            () => {
                it('Interpolation should insert the given value to output buffer (external source)',
                    () => {
                        const template = '{{= local.value =}}'

                        expect(templata.template(template)({ value: 'example' })).to.equal('example')
                    }
                )

                it('Interpolation should insert the given value to output buffer (hard coded)',
                    () => {
                        const template = '{{= "example" =}}'

                        expect(templata.template(template)()).to.equal('example')
                    }
                )

                it('Interpolation should insert the given value to output buffer (internal source)',
                    () => {
                        const template = '{{= example =}}'

                        expect(templata.template(template, { example: 'example' })()).to.equal('example')
                    }
                )

                it('Interpolation should insert the given value to output buffer with given filter (lowercase)',
                    () => {
                        const template = '{{= "ExAmPle" | lowercase =}}'

                        expect(templata.template(template)()).to.equal('example')
                    }
                )

                it('Interpolation should insert the given value to output buffer with given filter (uppercase)',
                    () => {
                        const template = '{{= "ExAmPle" | uppercase =}}'

                        expect(templata.template(template)()).to.equal('EXAMPLE')
                    }
                )

                it('Interpolation should insert the given value to output buffer with given filter (currency using comma)',
                    () => {
                        const template = '{{= "00,99000" | currency =}}'

                        expect(templata.template(template)()).to.equal('0.99')
                    }
                )

                it('Interpolation should insert the given value to output buffer with given filter (currency using dot)',
                    () => {
                        const template = '{{= "00.99000" | currency =}}'

                        expect(templata.template(template)()).to.equal('0.99')
                    }
                )
            }
        )

        describe('Templata.Template#Conditional',
            () => {
                it('Conditional "if" should return given value',
                    () => {
                        const template = '{{? true ?}}if{{/?}}'

                        expect(templata.template(template)()).to.equal('if')
                    }
                )

                it('Conditional "if"-"else" should return given value',
                    () => {
                        const template = '{{? false ?}}if{{? ?}}else{{/?}}'

                        expect(templata.template(template)()).to.equal('else')
                    }
                )

                it('Conditional "elseif" should return given value',
                    () => {
                        const template = '{{? false ?}}if{{?? true ??}}elseif{{? ?}}else{{/?}}'

                        expect(templata.template(template)()).to.equal('elseif')
                    }
                )
            }
        )

        describe('Templata.Template#Iteration',
            () => {
                it('Iteration should iterate trough given array (print value)',
                    () => {
                        const template = '{{~ local.arr :value: ~}}{{= value =}}{{/~}}'

                        expect(templata.template(template)({ arr: [1, 2, 3, 4] })).to.equal('1234')
                    }
                )

                it('Iteration should iterate trough given array (print index)',
                    () => {
                        const template = '{{~ local.arr :value,key: ~}}{{= key =}}{{/~}}'

                        expect(templata.template(template)({ arr: [1, 2, 3, 4] })).to.equal('0123')
                    }
                )

                it('Iteration should iterate trough given object (print value)',
                    () => {
                        const template = '{{~ local.obj :value: ~}}{{= value =}}{{/~}}'

                        expect(templata.template(template)({ obj: { item_1: '#1', item_2: '#2', item_3: '#3' } }))
                            .to.equal('#1#2#3')
                    }
                )

                it('Iteration should iterate trough given object (print key)',
                    () => {
                        const template = '{{~ local.obj :value,key: ~}}{{= key =}}{{/~}}'

                        expect(templata.template(template)({ obj: { item_1: '#1', item_2: '#2', item_3: '#3' } }))
                            .to.equal('item_1item_2item_3')
                    }
                )
            }
        )

        describe('Templata.Template#JavaScript',
            () => {
                it('JavaScript should work with pure JavaScript (varible definition)',
                    () => {
                        const template = '{{- var varible = "var"; -}}{{= varible =}}'

                        expect(templata.template(template)())
                            .to.equal('var')
                    }
                )

                it('JavaScript should work with pure JavaScript (function definition)',
                    () => {
                        const template = '{{- function print(){ return "var"; } -}}{{= print() =}}'

                        expect(templata.template(template)())
                            .to.equal('var')
                    }
                )
            }
        )

        describe('Templata.Template#Comment',
            () => {
                it('Comment should not print value inside block (but everything around it)',
                    () => {
                        const template = 'outside{{* should not render *}}block'

                        expect(templata.template(template)())
                            .to.equal('outsideblock')
                    }
                )
            }
        )

        describe('Templata.Template#HTMLEncode',
            () => {
                it('Should encode HTML String',
                    () => {
                        const template = '{{! "<span class=\'name\'>John White</span>" !}}'

                        expect(templata.template(template)())
                            .to.equal('&lt;span class&#61;&#39;name&#39;&gt;John White&lt;/span&gt;')
                    }
                )
            }
        )
    })
}

module.exports = run
