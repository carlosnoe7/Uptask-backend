import express from 'express';
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'

const ProyectoRoutes=express.Router();


ProyectoRoutes.route("/").get(checkAuth,obtenerProyectos).post(checkAuth,nuevoProyecto);

ProyectoRoutes.route("/:id").get(checkAuth,obtenerProyecto).put(checkAuth,editarProyecto).delete(checkAuth,eliminarProyecto);

ProyectoRoutes.post('/colaboradores',checkAuth,buscarColaborador)
ProyectoRoutes.post("/colaboradores/:id",checkAuth,agregarColaborador);
ProyectoRoutes.post("/eliminar-colaboradores/:id",checkAuth,eliminarColaborador);


export default ProyectoRoutes;