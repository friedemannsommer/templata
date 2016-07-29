import './typings/index.d.ts'

import TemplateCompiler from './lib/compiler'

// helper
import {iterate as helperIterate, initialize as initializeIterate} from './helper/iterate'
import helperJavascript from './helper/pure-javascript'
import helperHTMLEscape from './helper/encode-value'
import helperCondition from './helper/condition'
import helperComment from './helper/comment'
import helperPrint from './helper/print'

// filter
import filterLowercase from './filter/lowercase'
import filterUppercase from './filter/uppercase'
import filterCurrency from './filter/currency'

const defaultHelper: Object = {
    '??': helperCondition,
    '-': helperJavascript,
    '!': helperHTMLEscape,
    '?': helperCondition,
    '~': helperIterate,
    '*': helperComment,
    '=': helperPrint
}

const defaultFilter: Object = {
    'lowercase': filterLowercase,
    'uppercase': filterUppercase,
    'currency': filterCurrency
}

function template(template: string, imports: Object = {}): Templata.Interface.CompileFunction {
    return new TemplateCompiler(imports, defaultHelper, defaultFilter).initialize(initializeIterate).compile(template)
}

export default template
