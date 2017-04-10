/// <reference path="./typings/index.d.ts" />

import TemplateCompiler from './lib/compiler'

// helper
import helperComment from './helper/comment'
import helperCondition from './helper/condition'
import helperHTMLEscape from './helper/encode-value'
import { initialize as initializeIterate, iterate as helperIterate } from './helper/iterate'
import helperPrint from './helper/print'
import helperJavascript from './helper/pure-javascript'

// filter
import filterCurrency from './filter/currency'
import filterLowercase from './filter/lowercase'
import filterUppercase from './filter/uppercase'

const defaultHelper: Templata.IGenricIndexObject<Templata.IHelper> = {
    '!': helperHTMLEscape,
    '*': helperComment,
    '-': helperJavascript,
    '=': helperPrint,
    '?': helperCondition,
    '??': helperCondition,
    '~': helperIterate
}

const defaultFilter: Templata.IGenricIndexObject<Templata.IFilter> = {
    currency: filterCurrency,
    lowercase: filterLowercase,
    uppercase: filterUppercase
}

function template(template: string, imports: Templata.IGenricIndexObject<() => any> = {}): Templata.ICompileFunction {
    return new TemplateCompiler(imports, defaultHelper, defaultFilter).initialize(initializeIterate).compile(template)
}

export default template
