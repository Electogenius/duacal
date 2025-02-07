//
// a simple parser and tokenizer
//

const REPLACE = {
    '²': "^2 ",
    'π': "pi "
}
const CONSTANTS = ['pi', 'e', 'i', 'deg', 'rad', 'Ans']

const test = "2pi + 2*pi"

function tokenize(exp, syntaxerr) {
    const alpha = /^[a-zA-Z]+$/
    const number = /^\d*(\.\d*)?(e(\+|\-)?\d*)?$/

    let tokens = []
    let chars = exp.split``

    while (chars.length) {
        let char = () => chars[0]
        let rem = () => chars.shift()
        if (char() == ' ') {
            rem()
        } else if (/[0-9\.]/.test(char())) { //num
            let t = { value: '', type: 'number' }
            while (chars.length && number.test(t.value + char())) {
                t.value += rem()
            }
            tokens.push(t)
        } else if (/[\+\^\/\*\-]/.test(char())) { // operator
            tokens.push({
                value: rem(),
                type: 'operator'
            })
        } else if (char() == '(') { // lparen
            tokens.push({
                value: rem(),
                type: 'lparen'
            })
        } else if (char() == ')') { // rparen
            tokens.push({
                value: rem(),
                type: 'rparen'
            })
        } else if (alpha.test(char())) { //ident

            let t = { value: '', type: 'ident' }
            while (chars.length && alpha.test(t.value + char())) {
                t.value += rem()
            }
            tokens.push(t)
        } else if (char() in REPLACE) {
            const to = REPLACE[rem()].split``
            chars.unshift(...to)
        } else {
            syntaxerr("invalid char " + rem())
            return
        }
    }
    return tokens
}

function parser(tok, parseErr) {
    let last = (x = 0) => tok[x] || { value: '', type: '' }
    let rem = () => tok.shift()

    function additive() {
        let left = multiplicative()

        while (last().value == '+' || last().value == '-') {
            const oper = rem()
            left = {
                left,
                oper,
                right: multiplicative(),
                type: 'arithm'
            }
        }
        return left
    }

    function multiplicative() {
        let left = exponential()

        while (last().value == '*' || last().value == '/') {
            const oper = rem()
            left = {
                left,
                oper,
                right: exponential(),
                type: 'arithm'
            }
        }
        return left
    }

    function exponential() {
        let left = elementary()

        while (last().value == '^') {
            const oper = rem()
            left = {
                left,
                oper,
                right: elementary(),
                type: 'arithm'
            }
        }
        return left
    }

    function elementary() {
        if (last().type == 'ident') {
            let word = rem()
            if (last().type == 'lparen') {
                if (CONSTANTS.includes(word.value)) {
                    rem()
                    const expr = additive()
                    rem()
                    return {
                        left: word,
                        oper: { value: "*", type: "operator" },
                        right: expr,
                        type: "arithm"
                    }
                } else {
                    return {
                        type: 'fn',
                        name: word.value,
                        arg: elementary()
                    }
                }
            } else if (!CONSTANTS.includes(word.value)) {
                // function call without brackets
                return {
                    type: 'fn',
                    name: word.value,
                    arg: elementary()
                }
            } else {
                // plain ol' constant
                if (last().type == 'number') {
                    // bracketless implicit multiplication (eg 2pi)
                    word.type='const'
                    word.name=word.value
                    const v = {
                        left: rem(),
                        oper: { value: "*", type: "operator" },
                        right: word,
                        type: "arithm"
                    }
                    log(v)
                    rem()
                    return v
                }
                return {
                    type: 'const',
                    name: word.value
                }
            }
        } else if (last().type == 'lparen') {
            rem()
            const expr = additive()
            rem()
            return (expr)
        } else if (last().value == '+' || last().value == '-') {
            log(33)
            return {
                left: {
                    type: 'number',
                    value: "0"
                },
                oper: rem(),
                right: elementary(),
                type: "arithm"
            }
        } else {
            if (last(1).type == 'ident' && CONSTANTS.includes(last(1).value)) {
                // bracketless implicit multiplication (eg 2pi)
                let z = rem()
                let w = last()
                w.type='const'
                w.name=w.value
                const v = {
                    left: z,
                    oper: { value: "*", type: "operator" },
                    right: w,
                    type: "arithm"
                }
                log(v)
                rem()
                return v
            }
            return rem()
        }
    }
    return additive()
}

//// tests ////

const log = x => console.log(x)
try {
    console.log(parser(tokenize(test, log), log))
} catch (e) { log(e) }