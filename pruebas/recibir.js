var a= require("./variable");

var objeto= require("./variable2");
var{b,c}= require("./variable2")
var be= require("./variable2").b;
var m= require("./variable3").m;
console.log(a);
console.log(objeto.b);  //imprimri la variable objeto.nombre de la variable
console.log(c);
console.log(be);
console.log(m);