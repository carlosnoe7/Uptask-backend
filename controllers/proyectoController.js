import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";



const obtenerProyectos=async (req, res) => {

    try {
        const proyectos=await Proyecto.find({
            '$or':[
                {'colaboradores':{$in:req.usuario}},
                {'creador':{$in:req.usuario}}
            ]
        }).select('-tareas');
        return res.json({proyectos});
        
    } catch (error) {
        return res.status(500).json({msg:'Error al listar los proyectos'});
    }


    
}
const nuevoProyecto=async (req, res) => {
    
    const proyecto=new Proyecto(req.body);
    proyecto.creador=req.usuario._id;

    try {
        const proyectoAlmacenado=await proyecto.save();
        return res.json(proyectoAlmacenado);
    } catch (error) {
        return res.status(500).json({msg:'Hubo un error, por favor intente más tarde'})
    }

}
const obtenerProyecto=async (req, res) => {

    const {id}=req.params;

    const proyecto=await Proyecto.findById(id).
    populate({
        path:"tareas",populate:{
        path:"completado",
        select:"nombre"
    }}).
    populate("colaboradores","nombre email");


    if (!proyecto) {
        const error=new Error('Proyecto no encontrado');

        return res.status(404).json({msg: error.message});
    }

    if (proyecto.creador.toString()!==req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador=>colaborador._id.toString()===req.usuario._id.toString())) {
        const error=new Error('Acción no válida');

        return res.status(401).json({msg: error.message});
    }

    //Obtener las tareas del proyecto
        const tareas=await Tarea.find().where("proyecto").equals(proyecto._id);
        const respuesta={...proyecto,...tareas}

     res.json({
        proyecto,
        tareas
     });


    
}
const editarProyecto=async (req, res) => {

    const {id}=req.params;

    const proyecto=await Proyecto.findById(id);

    if (!proyecto) {
        const error=new Error('Proyecto no encontrado');

        return res.status(404).json({msg: error.message});
    }

    if (proyecto.creador.toString()!==req.usuario._id.toString()) {
        const error=new Error('Acción no válida');

        return res.status(401).json({msg: error.message});
    }
     
    proyecto.nombre=req.body.nombre || proyecto.nombre;
    proyecto.descripcion=req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega=req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente=req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado=await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        
    }

    
}
const eliminarProyecto=async (req, res) => {
    const {id}=req.params;

    const proyecto=await Proyecto.findById(id);

    if (!proyecto) {
        const error=new Error('Proyecto no encontrado');

        return res.status(404).json({msg: error.message});
    }

    if (proyecto.creador.toString()!==req.usuario._id.toString()) {
        const error=new Error('Acción no válida');

        return res.status(401).json({msg: error.message});
    }
    try {
        await proyecto.deleteOne();
        res.json({msg: 'Proyecto eliminado'});
    } catch (error) {

        return res.status(400).json({msg: 'No se pudo eliminar correctamente'});
    }
}

const buscarColaborador=async (req,res)=>{
    const { email }=req.body;
    
    const usuario=await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if (!usuario) {
        const error=new Error("Usuario no encontrado");
        return res.status(404).json({msg:error.message});
    }

    return res.json(usuario);
}

const agregarColaborador=async (req, res) => {

    
    const proyecto=await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error=new Error('Proyecto No Encontrado');
        return res.status(404).json({msg:error.message});
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error=new Error('Acción no válida');
        return res.status(404).json({msg:error.message});
    }
    const { email }=req.body;
    
    const usuario=await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if (!usuario) {
        const error=new Error("Usuario no encontrado");
        return res.status(404).json({msg:error.message});
    }

    if(proyecto.creador.toString()===usuario._id.toString()){
        const error=new Error("El creador del proyecto no puede ser colaborador");
        return res.status(400).json({msg:error.message});
    }

    if ((proyecto).colaboradores.includes((usuario)._id)) {
        const error=new Error(
            "El Usuario ya pertenece al Proyecto"
        );
        return res.status(400).json({msg:error.message});
    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    return res.json({msg:"Colaborador Agregado"});

    
}
const eliminarColaborador=async (req, res) => {
    
    const proyecto=await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error=new Error('Proyecto No Encontrado');
        return res.status(404).json({msg:error.message});
    }

    if (proyecto.creador.toString() === req.usuario._id.toString()) {
        const error=new Error('Acción no válida');
        return res.status(404).json({msg:error.message});
    }
    
    //Esta bien se puede eliminar
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    return res.json({msg:"Colaborador Eliminado Correctamente"});

}
// const obtenerTareas=async (req, res) => {
    
//     const {id}=req.params;
//     const existeProyecto=await Proyecto.findById(id);
//     if (!existeProyecto) {
//         const error=new Error('Proyecto no encontrado');

//         return res.status(404).json({msg: error.message});
//     }
//     //Debes ser creador del proyecto o colaborador

//     const tareas=await Tarea.find().where('proyecto').equals(id);

//     res.json(tareas)

// }

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
}
