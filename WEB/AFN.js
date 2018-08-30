$(document).ready(function(){
	var n = 0;
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
		verAFN(){
			var txt=""
			var pila = [];
			var pila2 = [];
			var visitados = new Set();
			for (var e of this.Estados) {
				pila.push(e);
			}
			for (var e of this.Estados) {
				pila2.push(pila.pop());
			}
			while (pila2.length > 0) {
				var e = pila2.pop();
				var id_estado = e.num;
				if (!visitados.has(id_estado)) {
					visitados.add(id_estado);
					for (var t of e.transiciones){
						if(t.estadod.Acept==false){
							txt=txt+id_estado+"--"+t.simbolo+"-->"+t.estadod.num+"<br>"
						}else{
							txt=txt+id_estado+"--"+t.simbolo+"-->|"+t.estadod.num+"|<br>"
						}
					}
				}
			}
			return txt;
		}
	}
	let AFNS=[]
	let nAFNS=new Set()
	$("#B1").click(function(){
		var nAFN=obtenertexto("Escriba el nombre del AFN")
		if(nAFN!==null && nAFN.length>0){
			if(!nAFNS.has(nAFN)){
				nAFNS.add(nAFN)
				var txt=obtenertexto("Escriba el simbolo")
				if(txt!==null && txt.length>0){
					let z = new AFN()
					z=z.creaBasico(txt)
					AFNS.push({Nombre: nAFN,AFN:z})
					llenartabla()
				}
			}else{
				alert("Nombre ya existe")
			}
		}
	})
	function llenartabla(){
		$("#t1").find("tr:gt(0)").remove();
		AFNS.forEach(function(x){
			var txt=x.AFN.verAFN()
			$('#t1').append('<tr><td>'+x.Nombre+'</td><td class="ac">'+txt+'</td></tr>');
		})
    }
	function obtenertexto(mensaje){
		var retVal = prompt(mensaje,);
		return retVal
    }
	function listaAFNS(nombre){
		var lista=""
		AFNS.forEach(function(x){
			if(!(x.Nombre===nombre)){
				lista=lista+x.Nombre+"\n"
			}
		})
		return lista
    }
    $("#t1").on("click","tr", function(e) {
		var tr= e.currentTarget;
        var td1=tr.getElementsByTagName("td")
        var td2=td1[0]
        var $ks = $(td2);
		if($ks.html()!=="AFN"){
			if(AFNS.length>1){
			var op = obtenertexto("Elige una opcion: \n 1.-Unir \n 2.-Concatenar \n 3.-Cerradura")
			if(op!==null){
					switch(parseInt(op)) {
						case 1:{
								var ac = obtenertexto("Elige un AFN: \n"+listaAFNS($ks.html()))
								if(ac!==null && nAFNS.has(ac)){
									let AFN1a
									let AFN2a
									AFNS.forEach(function(x){
										if(x.Nombre===$ks.html()){
											AFN1a=x.AFN
										}
									})
									AFNS.forEach(function(x){
										if(x.Nombre===ac){
											AFN2a=x.AFN
										}
									})
									AFN1a=AFN1a.Unir(AFN2a)
									llenartabla()
								}
							}
							break;
						case 2:{
								var ac = obtenertexto("Elige un AFN: \n"+listaAFNS($ks.html()))
								if(ac!==null && nAFNS.has(ac)){
									let AFN1a
									let AFN2a
									AFNS.forEach(function(x){
										if(x.Nombre===$ks.html()){
											AFN1a=x.AFN
										}
									})
									AFNS.forEach(function(x){
										if(x.Nombre===ac){
											AFN2a=x.AFN
										}
									})
									AFN1a=AFN1a.Concatenar(AFN2a)
									llenartabla()
								}
							}
							break;
						case 3:{
								var ac = obtenertexto("Elige un el tipo de cerradura: \n1.-Estrella\n2.-Positiva\n3.-A? \n")
								switch(parseInt(ac)){
									case 1:{
											let AFN1a
											AFNS.forEach(function(x){
												if(x.Nombre===$ks.html()){
													AFN1a=x.AFN
												}
											})
											AFN1a.Cerradura(0)
										}
									break;
									case 2:{
											let AFN1a
											AFNS.forEach(function(x){
												if(x.Nombre===$ks.html()){
													AFN1a=x.AFN
												}
											})
											AFN1a.Cerradura(1)
										}
									break;
									case 3:{
										
											let AFN1a
											AFNS.forEach(function(x){
												if(x.Nombre===$ks.html()){
													AFN1a=x.AFN
												}
											})
											AFN1a.Cerradura(2)
										}
									break;
								}
								llenartabla()
							}
							break;
						default:{
							alert("Opcion invalida")
						}
					}
				}
			}else{
				alert("Crea otro AFN.")
			}
		}
    });
})
