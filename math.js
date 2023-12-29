class Num{
	constructor(real, imag=0){
		this.real=real
		this.imag=imag
	}
	add(b){
		return new Num(this.real+b.real, this.imag+b.imag)
	}
	mult(x){
		let a = this.real,
		b = this.imag,
		c = x.real,
		d = x.imag;

		return new Num(a*c - b*d, a*d + b*c)
	}
	neg(){
		return new Num(-this.real, -this.imag)
	}
	div(x){
		let a = this.real,
		b = this.imag,
		c = x.real,
		d = x.imag;
		let re = (a*c + b*d)/(c*c + d*d)
		let im = (b*c - a*d)/(c*c + d*d)
		return new Num(re, im)
	}
	exp(x){
		// shoot
	}
}
let log=x=>console.log(x)