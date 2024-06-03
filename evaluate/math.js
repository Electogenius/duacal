//
// an implementation of complex arithmetic in javascript
//

class Num{
	constructor(real, imag=0){
		this.real=real
		this.imag=imag
	}
	add(b){
		return num(this.real+b.real, this.imag+b.imag)
	}
	sub(b) {
        return num(this.real - b.real, this.imag - b.imag)
    }
	mult(x){
		let a = this.real,
		b = this.imag,
		c = x.real,
		d = x.imag;

		return num(a*c - b*d, a*d + b*c)
	}
	neg(){
		return num(-this.real, -this.imag)
	}
	div(x){
		let a = this.real,
		b = this.imag,
		c = x.real,
		d = x.imag;
		let re = (a*c + b*d)/(c*c + d*d)
		let im = (b*c - a*d)/(c*c + d*d)
		return num(re, im)
	}
	inv(){
	    return num(1).div(this)
	}
	mod(){
		return num((this.real**2+this.imag**2)**.5)
	}
	arg(){
		return num(Math.atan2(this.imag, this.real))
	}
	exp(x){
		// oh god
		const c = x.real, d = x.imag, r = this.mod().real, theta = this.arg().real
		return (
			Num.e_to_the_i_times(
				num(d*Math.log(r) + c*theta)
			)
			.mult(num(r**c))
			.div(num(Math.exp(d*theta)))
		)
	}

	// displays conveniently
	str(){
		const z = num(Num.cleanInt(this.real),Num.cleanInt(this.imag))
		if(!z.imag)
			return ""+z.real
		return `${z.real} + i${z.imag}`
	}

	static e_to_the_i_times(n){ // assert n.imag == 0
		if(num.imag)
			throw "Num.e_to_the_i_times() does not accept complex values; use Num.e.exp()"

		return num(Math.cos(n.real), Math.sin(n.real))
	}
	static e = new Num(Math.E,0)
	static i = new Num(0,1)
	static pi = new Num(Math.PI,0)

	/// Gets rid of floating point errors (not recommended)
	static cleanInt(n){ // where n is a regular integer, not a Num
		return Math.round(n*1e15)/1e15
	}
}

function num(real,imag){ // because new Num is annoying to type
	return new Num(real, imag)
}
