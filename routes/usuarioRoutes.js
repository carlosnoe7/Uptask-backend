import express from "express";
import {
  autenticar,
  comprobarToken,
  confirmar,
  forgotPassword,
  nuevoPassword,
  perfil,
  registrar,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const usuarioRoutes = express.Router();

//Aautenticacion, registro y confirmacion de usuarios

usuarioRoutes.post("/", registrar);
usuarioRoutes.post("/login", autenticar);
usuarioRoutes.get("/confirmar/:token", confirmar);
usuarioRoutes.post("/forgot-password", forgotPassword);

usuarioRoutes.route("/forgot-password/:token")
  .get(comprobarToken)
  .post(nuevoPassword);

  usuarioRoutes.get("/perfil", checkAuth, perfil);

export default usuarioRoutes;
