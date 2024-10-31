var rutas=require("express").Router();
//var {Router}= require("express");

var {mostrarProductos,nuevoProducto,borrarProducto,localizado,editarProducto}=require("../bd/productoBD");


 rutas.get("/mostrarProductos",async(req,res)=>{
   var productosValidos = await mostrarProductos(req.params.id);  
   res.json(productosValidos);
  });

rutas.get("/localizado/:id",async(req,res)=>{
   var productoValido=await localizado (req.params.id); //llega atravez de la ruta la variabke despues del params
   res.json(productoValido);
});
rutas.delete("/borrarProducto/:id",async (req,res)=>{
   var productoBorrado= await borrarProducto(req.params.id);
   res.json(productoBorrado);
});

rutas.post("/nuevoProducto",async (req,res)=>{
   var productoValido= await nuevoProducto(req.body);
   res.json(productoValido);
});

rutas.put("/editarProducto/:id", async (req, res) => {
   try {
       // Verifica si el producto existe llamando a la función `localizado`
       const productoValido = await localizado(req.params.id); 
       if (!productoValido) {
           // Si no se encuentra el producto, envía un 404
           return res.status(404).json({ mensaje: "Producto no encontrado." });
       }

       // Llama a la función `editarProducto` pasando el id y los datos del cuerpo de la solicitud
       const productoEditado = await editarProducto(req.params.id, req.body);
       if (productoEditado) {
           // Si el producto fue editado correctamente
           return res.status(200).json({ mensaje: "Producto editado con éxito." });
       } else {
           // Si no se realizaron cambios
           return res.status(400).json({ mensaje: "No se realizaron cambios en el producto." });
       }
   } catch (error) {
       console.error("Error al editar producto:", error);
       // Maneja el error y envía una respuesta 500
       return res.status(500).json({ mensaje: "Error al editar producto." });
   }
});

module.exports=rutas;