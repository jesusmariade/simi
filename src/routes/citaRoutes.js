// src/routes/citaRoutes.js

import { Router } from "express";
import path from "path";
import { CitaController } from "../controllers/CitaController.js";

const router = Router();

//ruta principal
router.get("/", (req,res) => {
    return res.sendFile(path.join(process.cwd(), "src", "views", "Personal_Recepcion", "cita-paciente.html"));
});

export default router;