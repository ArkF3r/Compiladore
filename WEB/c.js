global.n = 0;

function union_arrays(x, y) {
    var obj = {};
    for (var i = x.length - 1; i >= 0; --i)
        obj[x[i]] = x[i];
    for (var i = y.length - 1; i >= 0; --i)
        obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) // <-- optional
            res.push(obj[k]);
    }
    return res;
}

class Transicion {
    constructor(simbolo, estadod) {
        this.estadod = estadod
        this.simbolo = simbolo
    }
}
class Estado {
    constructor() {
        this.num = n++;
        this.Acept = false;
        this.transiciones = []
    }
}
class AFN {
    constructor() {
        //this.Estados = [];
        this.Alfabeto = [];
        this.EdosAcep = [];
        this.EdoIni = null;
    }
    
    display(){
        console.log("Estado inicial")
        console.log(this.EdoIni.num)
        console.log("Trancisiones estado inicial")
        this.EdoIni.transiciones.forEach(function(e){
            console.log("-->"+e.estadod.num)
        })
        console.log("Alfabeto")
        this.Alfabeto.forEach(function(e){
            console.log(e)
        })
        console.log("Estados de aceptacion")
        this.EdosAcep.forEach(function(e){
            console.log(e.num)
            console.log("Trancisiones estados de aceptacion")
            e.transiciones.forEach(function(a){
                console.log("-->"+a)
            })
        })
    }
    creaBasico(simbolo) {
        let f = new AFN();
        let e1 = new Estado();
        let e2 = new Estado();
        let t = new Transicion(simbolo, e2);
        e1.transiciones.push(t);
        e2.Acept = true;
        f.EdoIni = e1;
        f.Alfabeto.push(simbolo);
        f.EdosAcep.push(e2);
        return f;
    }
    Unir(f2) {
        let e1 = new Estado();
        let e2 = new Estado();
        e2.Acept = true;
        e1.transiciones.push(new Transicion('ep', this.EdoIni));
        e1.transiciones.push(new Transicion('ep', f2.EdoIni));
        for (var e of this.EdosAcep) {
            e.transiciones.push(new Transicion('ep', e2));
            e.EdosAcep = false;
        }
        for (var e of f2.EdosAcep) {
            e.transiciones.push(new Transicion('ep', e2));
            e.EdosAcep = false;
        }
        this.EdosAcep = [];
        this.EdoIni = e1;
        this.EdosAcep.push(e2);
        this.Alfabeto = union_arrays(this.Alfabeto, f2.Alfabeto);
        return this;
    }
    Concatenar(f2) {
        for (var e of this.EdosAcep) {
            e.transiciones.push(new Transicion('ep', f2.EdoIni));
            e.EdosAcep = false;
        }
        this.EdosAcep = [];
        for (var e of f2.EdosAcep) {
            this.EdosAcep.push(e);
        }
        this.Alfabeto = union_arrays(this.Alfabeto, f2.Alfabeto);
        return this;
    }
    Cerradura(tipo) { // tipo = 0 {cerradura estrella} | tipo = 1 {cerradura positiva} | tipo = 2 {A?}
        let e1 = new Estado();
        let e2 = new Estado();
        e2.Acept = true;
        if (tipo !== 1) { //Si es A^+ no se realiza transicion desde la inicial con epsilon
            e1.transiciones.push(new Transicion('ep', this.EdoIni));
        }
        if (tipo !== 2) { //Si es A^? se realiza transicion desde la inicial con epsilon
            e1.transiciones.push(new Transicion('ep', e2));
        }
        for (var e of this.EdosAcep) {
            e.transiciones.push(new Transicion('ep', e2));
            e.EdosAcep = false;
        }
        this.EdosAcep = [];
        this.EdoIni = e1;
        this.EdosAcep.push(e2);
        return this;
    }
    CerraduraPositiva() {
        let e1 = new Estado();
        let e2 = new Estado();
        e2.Acept = true;
        e1.transiciones.push(new Transicion('ep', this.EdoIni));
        for (var e of this.EdosAcep) {
            e.transiciones.push(new Transicion('ep', e2));
            e.EdosAcep = false;
        }
        this.EdosAcep = [];
        this.EdoIni = e1;
        this.EdosAcep.push(e2);
        return this;
    }
}
let a = new AFN();
a = a.creaBasico('d');
let b = new AFN();
b = b.creaBasico('e');
let c = new AFN();
c = c.creaBasico('s');
console.log('\nBasico1\n');
//console.log(a);
console.log('\nBasico2\n');
//console.log(b);
console.log('\nBasico3\n');
//console.log(c);
a = a.Cerradura(0);
console.log('\nCerraduraE\n');
//console.log(a);
a = a.Unir(c);
console.log('\nUnir\n');
//console.log(a);
a = a.Concatenar(b);
console.log('\nConcatenar\n');
//console.log(a);
a = a.Cerradura(1);
console.log('\nCerraduraP\n');
console.log(a);
a.display()
//console.log(a.EdoIni.transiciones[0]);