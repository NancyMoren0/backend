const ventasBD = require("./conexion").ventas;
const Ventas=require("../modelos/VentasModelo");
const { ventas } = require("./conexion");
const { buscarPorID } = require('./usuariosBD');
const { localizado } = require('./productoBD');

function validarDatos(venta){
    var valido = false;
    if(venta.cantidad!=undefined && venta.idprod!=undefined  && venta.idusu!=undefined){
   valido=true;
    }
    return valido;

}

async function mostrarVentas() {
    const ventas = await ventasBD.get();
    const ventasValidas = [];

    for (const venta of ventas.docs) {
        const ventaData = venta.data();
        const venta1 = new Ventas({ id: venta.id, ...ventaData });
        //console.log(venta1);
        
        // Validar los datos de la venta antes de continuar
        if (!validarDatos(venta1.getVentas)) {
            continue;
        }

        // Inicializar valores por defecto para el nombre del usuario y el producto
        let nombreUsuario = "Usuario no encontrado";
        let nombreProducto = "Producto no encontrado";

        // Obtener el nombre del usuario a partir del ID
        if (ventaData.idusu) {
            const usuarios = await buscarPorID(ventaData.idusu);
            if (usuarios) {
                nombreUsuario = usuarios.nombre; // Asignar el nombre del usuario
            } else {
                console.log(`Usuario con ID ${ventaData.idusu} no encontrado.`);
            }
        }

        // Obtener el nombre del producto a partir del ID
        if (ventaData.idprod) {
            const producto = await localizado(ventaData.idprod);
            if (producto) {
                nombreProducto = producto.nombre; // Asignar el nombre del producto
            } else {
                console.log(`Producto con ID ${ventaData.idprod} no encontrado.`);
            }
        }

        // Crear el objeto de la venta con los nombres en lugar de los IDs
        const ventaConNombres = {
            ...venta1.getVentas,   // Incluye todos los datos originales de la venta
            nombreUsuario,         // Agrega el nombre del usuario
            nombreProducto         // Agrega el nombre del producto
        };

        // Elimina los campos de idusu e idprod si ya no son necesarios
        delete ventaConNombres.idusu;
        delete ventaConNombres.idprod;

        // Agregar la venta válida con los nombres al array de ventas válidas
        ventasValidas.push(ventaConNombres);
    }

    // Retornar el array de ventas válidas con los nombres de usuario y producto
    return ventasValidas;
}

async function encontrado(id) {
    const doc = await ventasBD.doc(id).get();
    if (!doc.exists) return null;

    const venta1 = new Ventas({ id: doc.id, ...doc.data() });
    if (validarDatos(venta1.getVentas)) {
        return venta1.getVentas;  // Acceder a getVentas como una propiedad, no como una función
    }

    return null;
}



async function nuevoVentas(data) {
    // Agrega el tipo de venta y el estado al objeto de datos
    data.tipoVenta = "venta";
    data.estado = "entregado"; // Establece el estado como "entregado"

    // Obtén la fecha y hora actuales
    const fechaActual = new Date();

    // Formato de fecha (dd-mm-yyyy)
    const fecha = fechaActual.toLocaleDateString('es-ES'); // Ej: "02/10/2024"

    // Formato de hora (hh:mm:ss)
    const hora = fechaActual.toLocaleTimeString('es-ES'); // Ej: "15:35:21"

    // Añadir fecha y hora separadas al objeto data
    data.fecha = fecha;
    data.hora = hora;

    // Crea una nueva instancia de la venta
    const venta1 = new Ventas(data);

    // Inicializa la variable para validar las ventas
    let ventasValidas = false;

    // Valida los datos de la venta antes de guardarla
    if (validarDatos(venta1.getVentas)) {
        // Asegúrate de que la fecha y la hora estén en los datos que se guardarán
        const datosVenta = {
            // Asegúrate de que los valores se asignen correctamente
            
            cantidad: venta1.getVentas.cantidad,
            estado: venta1.getVentas.estado,
            fecha: data.fecha, // Agrega la fecha
            hora: data.hora,    // Agrega la hora
            idprod: venta1.getVentas.idprod, // Asegúrate de que esto sea correcto
            idusu: venta1.getVentas.idusu   // Asegúrate de que esto sea correcto
        };

        // Guarda la nueva venta en la base de datos
        await ventasBD.doc().set(datosVenta);
        ventasValidas = true;
    }

    return ventasValidas;
}


async function borrarVenta(id) {
    const ventasValidas = await encontrado(id);
    if (!ventasValidas) return false;

    await ventasBD.doc(id).delete();
    return true;
}

async function cancelarVenta(id) {
    var ventasValidas = await encontrado(id);
    let ventaBorrada = false;
 
    if (ventasValidas) {
      
      await ventasBD.doc(id).update({
         "estado": "cancelado" 
      });
      ventaBorrada = true;
    }
 
    return ventaBorrada;
 }

 async function editarVenta(id, data) {
    try {
        // Verifica si la venta existe en la base de datos
        const venta = await ventasBD.doc(id).get();
        if (!venta.exists) {
            return { success: false, message: "Venta no encontrada" };
        }

        // Define los datos que se van a actualizar
        const updateData = {};
        if (data.cantidad) updateData.cantidad = data.cantidad; // Solo actualiza la cantidad

        // Actualiza la venta en la base de datos con los datos especificados
        await ventasBD.doc(id).update(updateData);

        // Retorna un mensaje de éxito si la actualización fue exitosa
        return { success: true, message: "Venta actualizada exitosamente" };
    } catch (error) {
        // Captura cualquier error y lo retorna con un mensaje de error
        console.error("Error al editar la venta:", error.message);
        return { success: false, message: "Error al editar la venta", error: error.message };
    }
}


module.exports={
    mostrarVentas,
    editarVenta,
    nuevoVentas,
    borrarVenta,
    cancelarVenta,
    encontrado
}
