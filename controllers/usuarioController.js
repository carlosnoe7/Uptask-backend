import { emailRecuperarPassword, emailRegistro } from "../helpers/email.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js"



const registrar = async(req, res) => {

    //Evitar registros duplicados
    const {email}=req.body;
    const existeUsuario=await Usuario.findOne({email});

    if (existeUsuario) {
        const error=new Error('Usuario ya registrado');

        return res.status(400).json({msg: error.message});
    }

    try {

        const usuario=new Usuario(req.body);
        usuario.token =generarId();
        await usuario.save();

        //Enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.status(200).json({msg:"Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta"});

    } catch (error) {

        res.status(500).json({msg:'Internal server error'})
        
    }
}
const autenticar=async (req, res) => {

    const {email,password}=req.body;
    
    //Comprobar si el usuario existe

    const usuario=await Usuario.findOne({email});
    if (!usuario) {
        const error=new Error('El usuario no existe');

        return res.status(404).json({msg: error.message});
    }

    //Comprobar si el usuario está confirmado

    if (!usuario.confirmado) {
        const error=new Error('El usuario no esta confirmado');

        return res.status(403).json({msg: error.message});
    }
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id:usuario._id,
            nombre:usuario.nombre,
            email:usuario.email,
            token:generarJWT(usuario._id)
        })
    }
    else{
        const error=new Error('El password es incorrecto');
        return res.status(404).json({msg: error.message});
    }


    //Comprobar su password
}

const confirmar=async (req,res)=>{
    const {token}=req.params;

    const usuarioConfirmar=await Usuario.findOne({token});
    if (!usuarioConfirmar) {
        const error=new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
    try {
        usuarioConfirmar.confirmado=true;
        usuarioConfirmar.token="";
        await usuarioConfirmar.save();
        res.json({msg:'Usuario confirmado Correctamente'})
    } catch (error) {

    }
}

const forgotPassword=async(req, res) => {
    const {email}=req.body;
    const usuario=await Usuario.findOne({email})
    if (!usuario) {
        const error=new Error('El usuario no existe');

        return res.status(404).json({msg: error.message});
    }
    try {
        usuario.token=generarId();
        await usuario.save();

        //Enviar el email
        emailRecuperarPassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'Email con instrucciones enviado'})
    } catch (error) {

    }

}

const comprobarToken=async (req, res)=>{

    const {token} = req.params;

    const tokenValido=await Usuario.findOne({token});

    if (tokenValido) {
        res.json({msg:'Token valido'})
    }
    else{
        const error=new Error('El token no es valido');

        return res.status(403).json({msg: error.message});
    }
}

const nuevoPassword=async (req, res)=>{

    const {token}=req.params;
    const {password}=req.body;

    
    const usuario=await Usuario.findOne({token});

    if (usuario) {
        usuario.password=password;
        usuario.token='';
        try {
            await usuario.save();
            res.json({msg:'Password modificado correctamente'})
        } catch (error) {
            res.json({msg:'No se pudo modificar el password'})
        }
    }
    else{
        const error=new Error('El token no es valido');

        return res.status(403).json({msg: error.message});
    }

}

const perfil=async(req,res)=>{

    const {usuario}=req;
    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    forgotPassword,
    comprobarToken,
    nuevoPassword,
    perfil
}