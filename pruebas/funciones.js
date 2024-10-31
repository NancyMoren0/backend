function saludar(){
    console.log("Hola");
}
saludar();

function saludar2(nombre="anónimo"){
    console.log("Hola "+nombre);
}
saludar2("Juan Perez");

function saludar3(nombre="anónimo"){
    var s=("Hola "+nombre);  //la funcion no la ejecuta hasta la linea en la que lo manda llamar 
    return s;
}
console.log(saludar3("Juancho"));

//funcion de frlecha se ejecuta en ese momento ()=>{}

    var saludo=(nombre)=>{
        //funcion realiza un accion,
        console.log("Hola "+nombre); 
    }
    saludo("Menganito");

    var saludo2=nombre=>{
        //esta funcion de flecha funciona igual que sin los parentesis, cuando solo se recibe u
        //funcion no necesita parentesis
        console.log("Hola "+nombre); 
    }
    saludo2("Perenganito");

    var saludo3=nombre=>{
           return "Hola "+nombre; ;
    }
    console.log(saludo3("Tenganito"));

    var saludo4=nombre=>"Hola "+nombre;
    console.log(saludo4("Nancy")); //si solo tiene un retur no necesita llaves
 

    //FUNCIO ANONIMA
    var saludo5=function(){
       console.log("hola");
    }
    saludo5();

    var saludo6=()=>{
        console.log("saludo6");
     }
     

     var saludo7=(nombre,s)=>{
        console.log("saludo7"+nombre);
        s();
     }
     saludo7("Bethoven",saludo6); //par allamar finciones
