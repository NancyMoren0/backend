var rutas=require("express").Router();
//var {Router}= require("express");

var {mostrarUsuarios,nuevoUsuario,borrarUsuario,buscarPorID, editarUsuario}=require("../bd/usuariosBD");

rutas.get("/",async(req,res)=>{
 //res.send("Hola estas en raíz");

 var usuariosValidos = await mostrarUsuarios();  
 //console.log("jhfhjf");
 res.json(usuariosValidos);
});

rutas.get("/buscarPorId/:id",async(req,res)=>{
   var usuarioValido=await buscarPorID(req.params.id); //llega atravez de la ruta la variabke despues del params
   res.json(usuarioValido);
});
rutas.delete("/borrarUsuario/:id",async (req,res)=>{
   var usuarioBorrado= await borrarUsuario(req.params.id);
   res.json(usuarioBorrado);
});

rutas.post("/nuevoUsuario",async (req,res)=>{
   var usuarioValido= await nuevoUsuario(req.body);
   res.json(usuarioValido);
});
rutas.put("/editarUsuario/:id",async (req, res) => {
   try {
       const usuarioValido = await buscarPorID(req.params.id); // Verifica si el usuario existe
       if (!usuarioValido) {
           // Si no se encuentra el usuario, envía un 404
           return res.status(404).json({ mensaje: "Usuario no encontrado." });
       }
       // Llama a la función editarUsuario pasando el id y los datos del cuerpo de la solicitud
       const usuarioEditado = await editarUsuario(req.params.id, req.body);
       if (usuarioEditado) {
           // Si el usuario fue editado correctamente
           return res.status(200).json({ mensaje: "Usuario editado con éxito." });
       } else {
           // Si no se realizaron cambios
           return res.status(400).json({ mensaje: "No se realizaron cambios en el usuario." });
       }
   } catch (error) {
       console.error("Error al editar usuario:", error);
       // Maneja el error y envía una respuesta 500
       return res.status(500).json({ mensaje: "Error al editar usuario." });
   }
});


module.exports=rutas;