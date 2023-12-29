const REPLACE = {
	'²': "^2",
	'π': "pi"
}
const CONSTANTS = ['pi','e']

const test = "ln 2"

function tokenize(exp, syntaxerr) {
	const alpha = /^[a-zA-Z]+$/
	let tokens = []
	let chars = exp.split``
	while (chars.length) {
		let char = () => chars[0]
		let rem = () => chars.shift()
		if (char() == ' ') {
			rem()
		} else if (/[0-9\.]/.test(char())) {
			let t = { value: '', type: 'number' }
			while (chars.length && /^\d*(\.\d*)?$/.test(t.value + char())) {
				t.value += rem()
			}
			tokens.push(t)
		} else if (/[\+\^\/\*\-]/.test(char())) {
			tokens.push({
				value: rem(),
				type: 'operator'
			})
		} else if (char() == '(') {
			tokens.push({
				value: rem(),
				type: 'lparen'
			})
		} else if (char() == ')') {
			tokens.push({
				value: rem(),
				type: 'rparen'
			})
		} else if (alpha.test(char())) {
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
	let last = () => tok[0] || { value: '', type: '' }
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
		let left = elementary()

		while (last().value == '*' || last().value == '/') {
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
				if (CONSTANTS.includes(word.value)){
					//TODO: fix
					parseErr("No implicit multiplication")
				}else{
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
		}
		else return rem()
	}
	return additive()
}

const log = x => console.log(x)
try {
	console.log(parser(tokenize(test, log), log))
} catch (e) { log(e) }