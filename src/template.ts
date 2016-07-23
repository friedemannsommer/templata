import TemplateCompiler from './lib/compiler'

// helper
import helperJavascript from './helper/pure-javascript'
import helperHTMLEscape from './helper/encode-value'
import helperCondition from './helper/condition'
import helperIterate from './helper/iterate'
import helperComment from './helper/comment'
import helperPrint from './helper/print'

// filter
import filterLowercase from './filter/lowercase'
import filterUppercase from './filter/uppercase'
import filterCurrency from './filter/currency'

function template(template: string, imports: Object = {}): Templata.Interface.CompileFunction {
    let Compiler = new TemplateCompiler(imports)

    // register helper
    Compiler.registerHelper('??', helperCondition)
    Compiler.registerHelper('-', helperJavascript)
    Compiler.registerHelper('!', helperHTMLEscape)
    Compiler.registerHelper('?', helperCondition)
    Compiler.registerHelper('~', helperIterate)
    Compiler.registerHelper('*', helperComment)
    Compiler.registerHelper('=', helperPrint)

    // register filter
    Compiler.registerFilter('lowercase', filterLowercase)
    Compiler.registerFilter('uppercase', filterUppercase)
    Compiler.registerFilter('currency', filterCurrency)

    return Compiler.compile(template)
}

export default template