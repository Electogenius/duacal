let cursorx = 0 // position (pixels) of cursor

function pixel(x, y, erase = false) {
	const PIXELSIZE = 16
	const OFFSET = 16
	const args = [
		OFFSET + x * PIXELSIZE,
		OFFSET + y * PIXELSIZE,
		PIXELSIZE - 1,
		PIXELSIZE - 1
	]
	c.fillRect(...args)
}

let hh = 30
function debug(text){
	c.fillText(text, 5, hh)
	hh+=25
}
let data = {
	"1":"1171090191",
	"2":"1162 16111 15121110431",
	"3":" 181 13141 1211131 3331",
	"4":"1541414 4651",
	"0":"18115121 14131 13141181",
	".":"91",
	"+":"514 514 352 514 51",
	"sq":" 1135111115311",
	"^":"217 11819 118 21"
}
function expand(st){
	let res = ''
	, x = 0
	st.split``.forEach((num, ind) => {
		if(num ==' ')return

		res += (ind%2+"").repeat(num)
		x += +num
		if (x%10 == 0 && res[res.length-1] != ' '){
			res += ' '
			x =0
		}
	});
	return res[res.length-1] != ' '? res + ' ' : res
}
function drawGlyph(st){
	let x=cursorx+1,y=0
	st.split``.forEach(char => {
		if (char == ' '){
			y = 0
			x++
		}else if (char == 0){
			y ++
		}else if (char == 1){
			pixel(x, y)
			y++
		}
	})
	cursorx = x
	console.log(st+'..', cursorx)
}
drawGlyph(expand(data['3']))
drawGlyph(expand(data['0']))
drawGlyph(expand(data['^']))