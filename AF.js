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
        this.Estados = [];
        this.Alfabeto = [];
        this.EdosAcep = [];
        this.EdoIni = null;
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
        f.Estados.push(e1);
        f.Estados.push(e2);
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
            e.Acept = false;
        }
        for (var e of f2.EdosAcep) {
            e.transiciones.push(new Transicion('ep', e2));
            e.Acept = false;
        }
        this.EdosAcep = [];
        this.EdoIni = e1;
        this.EdosAcep.push(e2);
        this.Alfabeto = union_arrays(this.Alfabeto, f2.Alfabeto);
        this.Estados = this.Estados.concat(f2.Estados); //Agrego los nuevos estados al AFN
        this.Estados.push(e1);
        this.Estados.push(e2);
        return this;
    }
    Concatenar(f2) {
        for (var e of this.EdosAcep) {
            e.transiciones.push(new Transicion('ep', f2.EdoIni));
            e.Acept = false;
        }
        this.EdosAcep = [];
        for (var e of f2.EdosAcep) {
            this.EdosAcep.push(e);
        }
        this.Alfabeto = union_arrays(this.Alfabeto, f2.Alfabeto);
        this.Estados = this.Estados.concat(f2.Estados); //Agrego los nuevos estados al AFN
        return this;
    }
    Cerradura(tipo) { // tipo = 0 {cerradura estrella} | tipo = 1 {cerradura positiva} | tipo = 2 {A?}
        let e1 = new Estado();
        let e2 = new Estado();
        e2.Acept = true;
        //if (tipo !== 1) { //Si es A^+ no se realiza transicion desde la inicial con epsilon
        e1.transiciones.push(new Transicion('ep', this.EdoIni));
        //}
        if (tipo !== 1) { //Si es A^? se realiza transicion desde la inicial con epsilon
            e1.transiciones.push(new Transicion('ep', e2));
        }
        for (var e of this.EdosAcep) {
            if (tipo !== 2) {
                e.transiciones.push(new Transicion('ep', this.EdoIni));
            }
            e.transiciones.push(new Transicion('ep', e2));
            e.Acept = false;
        }
        this.EdosAcep = [];
        this.EdoIni = e1;
        this.EdosAcep.push(e2);
        this.Estados.push(e1);
        this.Estados.push(e2);
        return this;
    }
    Mover(conjunto_edos, simbolo) { //Funcion nueva
        var conjunto_resul = [];
        for (var e of conjunto_edos) {
            for (var t of e.transiciones) {
                if (t.simbolo === simbolo) {
                    conjunto_resul.push(t.estadod);
                }

            }
        }
        return conjunto_resul;
    }
    CerraduraEpsilon(conjunto_edos) { //Funcion nueva
        var conjunto_R = [];
        var pila = [];
        var visitados = new Set();
        for (var e of conjunto_edos) {
            pila.push(e);
        }
        while (pila.length > 0) {
            var e = pila.pop();
            var id_estado = e.num;
            if (!visitados.has(id_estado)) {
                visitados.add(id_estado);
                conjunto_R.push(e);
                for (var t of e.transiciones) {
                    if (t.simbolo === 'ep') {
                        pila.push(t.estadod);
                    }
                }
            }

        }

        return conjunto_R;
    }
    Ir_a(conjunto_edos, simbolo) { //funcion nueva
            var conjunto_R = [];
            conjunto_R = this.CerraduraEpsilon(this.Mover(conjunto_edos, simbolo));
            return conjunto_R;
        }
        /*convierte_AFD() { //funcion nueva
            let C_AFD = new AFN();
            C_AFD.Alfabeto = this.Alfabeto;
            
            var So = [];
            var E = [];

            So = this.CerraduraEpsilon(this.EdoIni);
            if(So === []){
                C_AFD.EdoIni = this.EdoIni;
            }
            E.push(So);


            return C_AFD;
        }*/
}
let a = new AFN();
a = a.creaBasico('a');
let b = new AFN();
b = b.creaBasico('b');
a = a.Unir(b);
b = b.creaBasico('c');
b = b.Cerradura(0);
a = a.Concatenar(b);
for (var e of a.Estados) {
    console.log('\n\n');
    console.log(a.CerraduraEpsilon([e]));
}
//console.log(a);
//console.log('\n\na\n');
//console.log(a.EdoIni.transiciones);
//console.log(a.CerraduraEpsilon([a.EdoIni]));
//console.log(a.EdoIni.transiciones[0]);