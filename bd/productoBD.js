const productoBD = require("./conexion").productos;
const Producto=require("../modelos/ProductoModelo");
const { productos } = require("./conexion");
//const { encriptarPassword, validarPassword, usuarioAutorizado,adminAutorizado}= require("../middlewares/funcionesPassword");
//console.log(usuariosBD);

function validarDatos(producto){
    var valido = false;
    if(producto.cantidad!=undefined && producto.nombre!=undefined && producto.precio!=undefined){
     valido=true;
    }
    return valido;

}

async function editarProducto(id, data) {
    let productoEditado = false;
    try {
        const productoExistente = await localizado(id); // Busca si el producto existe

        if (productoExistente) {
            // Solo actualiza los campos que se han proporcionado
            const updateData = {};

            // Verifica si cada campo está presente en `data` y lo agrega a `updateData`
            if (data.nombre) {
                updateData.nombre = data.nombre;
            }
            if (data.cantidad) {
                updateData.cantidad = data.cantidad;
            }
            if (data.precio) {
                updateData.precio = data.precio;
            }
            // Muestra los datos que se van a actualizar
            console.log("Datos a actualizar:", updateData);

            // Si hay campos para actualizar, realiza la actualización
            if (Object.keys(updateData).length > 0) {
                await productoBD.doc(id).update(updateData);
                productoEditado = true;

                // Verifica el producto actualizado
                const productoActualizado = await productoBD.doc(id).get();
                console.log("Producto actualizado:", productoActualizado.data());
            }
        }
    } catch (error) {
        console.error("Error al editar producto:", error);
    }

    return productoEditado;
}


async function mostrarProductos(){
    const productos = await productoBD.get(); //await para cuando tarda
    //console.log(usuarios);
    productosValidos=[];
    productos.forEach(producto => {
    const producto1=new Producto({id:producto.id,...producto.data()});   //todo esto es un objeto
    if(validarDatos (producto1.getProducto)){
        productosValidos.push(producto1.getProducto);
    }
    
  
    });
    //console.log(usuariosValidos);
    return productosValidos;
}
//mostrarUsuarios();
async function localizado(id) {
//el .doc es de documento
//console.log(usuario.data);
    const producto= await productoBD.doc(id).get();
    const producto1= new Producto({id:producto.id,...producto.data()});
    var productoValido;
    if(validarDatos(producto1.getProducto)){
        productoValido=producto1.getProducto;
    }
    //console.log(usuarioValido);
    return productoValido;
}
//buscarPorID("UsL4kNhxAq1EPLUsW4CR");


async function nuevoProducto(data) {
   /* const{salt, hash}=encriptarPassword(data.password);
    data.password=hash;
    data.salt=salt;*/
    data.tipoProducto="producto";
    const producto1=new Producto (data);
    //console.log(usuario1.getUsuario);
    var productoValido=false;
    if(validarDatos(producto1.getProducto)){
       await productoBD.doc().set(producto1.getProducto); 
       productoValido=true;
    }
    return productoValido;
    
}

async function borrarProducto(id) {
   var productoValido=await localizado(id);
   productoBorrado=false;
   if(productoValido){
     await productoBD.doc(id).delete();
     productoBorrado=true;
   }
   return productoBorrado;
}

module.exports={
    mostrarProductos,
    nuevoProducto,
    editarProducto,
    borrarProducto,
    localizado
}
//Tarea
//REvisar cuando si existe el usuario, pero el usuario es incorrecto
//borrarUsuario("2D2JjGiQyJcZuse8zxQi");
/*data={
    nombre:"Moreno",
    usuario:"dos",
    password:"dm"
}
//console.log (nuevoUsuario);
async function prueba() {
    console.log(await nuevoUsuario(data));
    
}
prueba();*/