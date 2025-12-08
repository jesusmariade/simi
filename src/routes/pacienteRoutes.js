// src/routes/pacienteRoutes.js

import { Router } from "express";
import path from "path";
import { PacienteController } from "../controllers/PacienteController.js";

const router = Router();

//ruta principal
router.get("/", (req,res) => {
    return res.sendFile(path.join(process.cwd(), "src", "views", "Personal_Recepcion", "pacientes.html"));
});

export default router;