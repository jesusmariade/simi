import { Router } from "express";
import path from "path";
import { LicenciaController } from "../controllers/LicenciaController.js"

const router = Router();

//ruta principal
router.get("/", (req,res) =>{
    return res.sendFile(path.join(process.cwd(), "src", "views", "Personal_Medico", "citas-medico.html"))
});