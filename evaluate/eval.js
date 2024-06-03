//
// evaluates expressions
//

// import math.js, interpret.js //

function evaluate(expr) {
    switch (expr.type) {
        case "arithm":
            let { left, right, oper } = expr
            const methods = {
                "+":"add",
                "-":"sub",
                "*":"mult",
                "/":"div",
                "^":"exp"
            }
            return evaluate(left)[methods[oper.value]](evaluate(right))
            break
        case "number":
            return evalnum(expr.value)
            break
        case "fn":
            return Fns[expr.name](evaluate(expr.arg))
        case "const":
            return Num[expr.name]
    }
}

function evalnum(x){
    return num(Number(x))
}

const Fns = {
    sin(z) {
        return Num.i.mult(num(.5)).mult( //i/2 (
            Num.e.exp(num(0, -1).mult(z)) // e^(-iz)
            .sub(Num.e.exp(Num.i.mult(z))) // - e^iz
        ) // )
    },
    cos(z) {
        return Num.e.exp(Num.i.mult(z)) // (e^iz
            .add(Num.e.exp(Num.i.neg().mult(z))) // + e^(-iz)
            .div(num(2)) // ) /2
    },
    tan(x) {
        return Fns.sin(x).div(Fns.cos(x))
    },
    cosec: z => Fns.sin(z).inv(),
    csc: z => Fns.cosec(z),
    sec: z => Fns.cos(z).inv(),
    cot: z => Fns.tan(z).inv(),
    ln(z) {
        return num(Math.log(z.mod().real), z.arg().real)
    },
    sqrt: z => z.exp(num(.5)),
    cbrt: z => z.exp(num(1 / 3)),
    // TODO: inverse trig
}

//log(evaluate(parser(tokenize("e^(i*pi)", log), log)))