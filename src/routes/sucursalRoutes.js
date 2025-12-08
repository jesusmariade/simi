// src/routes/sucursalRoutes.js

import { Router } from "express";
import path from "path";

const router = Router();

// Servir la página principal de sucursales (HTML estático)
router.get("/", (req, res) => {
	return res.sendFile(path.join(process.cwd(), "src", "views", "sucursales", "sucursales.html"));
});

export default router;