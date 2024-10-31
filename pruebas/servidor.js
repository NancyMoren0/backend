//lineas minimas para arreancar el servidor
const express = require("express");
require("dotenv").config();
const app=express();

//middleware

var saludo = (req,res,next)=>{  
    console.log("Hola");
    next();
}

//esta funcion sirve para ver si pasa a la siguienete oagina
app.get("/",saludo,(req,res)=>{
    res.send("Hola estas en raíz");

});
app.get("/home",saludo,(req,res)=>{
    res.send("Hola estas en home");

});

const port=process.env.PORT || 3000 //si no esta disponoble ala otra variaboe ociúpa esa
//lisen puede recibir dos variables 

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});