const SQUARED = '²'

const test = "sin 1"

function tokenize(exp) {
	const alpha = /\p{Ll}/
	let tokens = []
	let chars = exp.split``
	while (chars.length) {
		let char = ()=>chars[0]
		let rem = ()=>chars.shift()
		if (char()==' '){
			rem()
		}else if (/[0-9\.]/.test(char())){
			let t = {value: '', type: 'number'}
			while (chars.length && /^\d*(\.\d*)?$/.test(t.value+char())){
				t.value+=rem()
			}
			tokens.push(t)
		}else if (/[\+\^\/\*\-]/.test(char())){
			tokens.push({
				value: rem(),
				type: 'operator'
			})
		}else if (char() == '('){
			tokens.push({
				value: rem(),
				type: 'lparen'
			})
		}else if (char() == ')'){
			tokens.push({
				value: rem(),
				type: 'rparen'
			})
		}else if (alpha.test(char())) {
			let t = {value: '', type: 'ident'}
			while (chars.length && alpha.test(t.value+char())){
				t.value+=rem()
			}
			tokens.push(t)
		}
	}
	return tokens
}
console.log(tokenize(test))