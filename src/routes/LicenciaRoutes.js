// src/routes/LicenciaRoutes.js

import { Router } from "express";
import path from "path";
import { LicenciaController } from "../controllers/LicenciaController.js";

const router = Router();

//ruta principal
router.get("/", (req,res) => {
    return res.sendFile(path.join(process.cwd(), "src", "views", "Personal_Medico", "Licencias_Medico", "licenciasmedico.html"));
});

export default router;