import express from 'express';
import {  autenticar, comprobarToken, confirmar, forgotPassword, nuevoPassword, perfil, registrar } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';


const router=express.Router();

//Aautenticacion, registro y confirmacion de usuarios


router.post('/',registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token',confirmar);
router.post('/forgot-password',forgotPassword);


router.route("/forgot-password/:token").get(comprobarToken).post(nuevoPassword);

router.get('/perfil',checkAuth,perfil)


export default router;