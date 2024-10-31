const usuariosBD = require("./conexion").usuarios;
const Usuario=require("../modelos/UsuarioModelo");
const { usuarios } = require("./conexion");
const { encriptarPassword, validarPassword, usuarioAutorizado,adminAutorizado}= require("../middlewares/funcionesPassword");
//console.log(usuariosBD);

function validarDatos(usuario){
    var valido = false;
    if(usuario.nombre!=undefined && usuario.usuario!=undefined && usuario.password!=undefined){
     valido=true;
    }
    return valido;

}

async function editarUsuario(id, data) {
    var usuarioEditado = false;
    try {
        const usuarioExistente = await buscarPorID(id); // Busca si el usuario existe

        if (usuarioExistente) {
            // Solo actualiza los campos que se han proporcionado
            const updateData = {};

            // Verifica si cada campo está presente en `data` y lo agrega a `updateData`
            if (data.nombre) {
                updateData.nombre = data.nombre;
            }

            if (data.usuario) {
                updateData.usuario = data.usuario;
            }

            if (data.password) {
                const { hash, salt } = encriptarPassword(data.password);
                updateData.password = hash;
                updateData.salt = salt;
            }

            // Muestra los datos que se van a actualizar
            console.log("Datos a actualizar:", updateData);

            // Si hay campos para actualizar, realiza la actualización
            if (Object.keys(updateData).length > 0) {
                await usuariosBD.doc(id).update(updateData);
                usuarioEditado = true;

                // Verifica el usuario actualizado
                const usuarioActualizado = await usuariosBD.doc(id).get();
                console.log("Usuario actualizado:", usuarioActualizado.data());
            }
        }
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }

    return usuarioEditado;
}


async function mostrarUsuarios(){
    const usuarios = await usuariosBD.get(); //await para cuando tarda
    //console.log(usuarios);
    usuariosValidos=[];
    usuarios.forEach(usuario => {
    const usuario1=new Usuario({id:usuario.id,...usuario.data()});   //todo esto es un objeto
    if(validarDatos (usuario1.getUsuario)){
        usuariosValidos.push(usuario1.getUsuario);
    }
    
   // listaUsuarios.push(usuario.data)
    });
    //console.log(usuariosValidos);
    return usuariosValidos;
}
//mostrarUsuarios();
async function buscarPorID(id) {
//el .doc es de documento
//console.log(usuario.data);
    const usuario= await usuariosBD.doc(id).get();
    const usuario1= new Usuario({id:usuario.id,...usuario.data()});
    var usuarioValido;
    if(validarDatos(usuario1.getUsuario)){
        usuarioValido=usuario1.getUsuario;
    }
    //console.log(usuarioValido);
    return usuarioValido;
}
//buscarPorID("UsL4kNhxAq1EPLUsW4CR");


async function nuevoUsuario(data) {
    const{salt, hash}=encriptarPassword(data.password);
    data.password=hash;
    data.salt=salt;
    data.tipoUsuario="usuario";
    const usuario1=new Usuario (data);
    //console.log(usuario1.getUsuario);
    var usuarioValido=false;
    if (validarDatos(usuario1.getUsuario)) {
        await usuariosBD.doc().set(usuario1.getUsuario);
       usuarioValido=true;
    }
    return usuarioValido;
    
}

async function borrarUsuario(id) {
   var usuarioValido=await buscarPorID(id);
   usuarioBorrado=false;
   if(usuarioValido){
     await usuariosBD.doc(id).delete();
     usuarioBorrado=true;
   }
   return usuarioBorrado;
}

module.exports={
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    editarUsuario,
    buscarPorID
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