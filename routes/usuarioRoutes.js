import express from 'express';
import {  autenticar, comprobarToken, confirmar, forgotPassword, nuevoPassword, perfil, registrar } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';


const UsuarioRoutes=express.Router();

//Aautenticacion, registro y confirmacion de usuarios


UsuarioRoutes.post('/',registrar);
UsuarioRoutes.post('/login', autenticar);
UsuarioRoutes.get('/confirmar/:token',confirmar);
UsuarioRoutes.post('/forgot-password',forgotPassword);


UsuarioRoutes.route("/forgot-password/:token").get(comprobarToken).post(nuevoPassword);

UsuarioRoutes.get('/perfil',checkAuth,perfil)


export default UsuarioRoutes;