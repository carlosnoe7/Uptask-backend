import express from 'express';
import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado    
} from '../controllers/tareaController.js';
import checkAuth from '../middleware/checkAuth.js';

const TareaRoutes=express.Router();

TareaRoutes.post('/',checkAuth,agregarTarea);
TareaRoutes.route('/:id').get(checkAuth,obtenerTarea).put(checkAuth,actualizarTarea).delete(checkAuth,eliminarTarea);
TareaRoutes.post('/estado/:id',checkAuth,cambiarEstado);

export default TareaRoutes;