// src/routes/authRoutes.js

import { Router } from "express";
import { AuthService } from "../services/AuthService.js";

const router = Router();

// API endpoint para iniciar sesión
router.post("/api/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ 
				success: false, 
				error: { message: "Email y contraseña son requeridos" } 
			});
		}

		console.log("🔐 Intento de login:", email);

		const result = await AuthService.iniciarSesion(email, password);

		if (result.error || !result.success) {
			return res.status(401).json({
				success: false,
				error: result.error || { message: "Credenciales inválidas" },
				usuario: null
			});
		}

		// No devolver el password_hash por seguridad
		const usuarioSeguro = { ...result.usuario };
		if (usuarioSeguro.password_hash) {
			delete usuarioSeguro.password_hash;
		}

		return res.json({
			success: true,
			error: null,
			usuario: usuarioSeguro
		});
	} catch (error) {
		console.error("❌ Error en /api/login:", error);
		return res.status(500).json({
			success: false,
			error: { message: error.message || "Error interno del servidor" },
			usuario: null
		});
	}
});

// API endpoint para registrar usuario
router.post("/api/registro", async (req, res) => {
	try {
		const { email, password, confirm_password, tipo_usuario, id_relacionado } = req.body;

		if (!email || !password || !tipo_usuario) {
			return res.status(400).json({ 
				success: false, 
				error: { message: "Email, contraseña y tipo de usuario son requeridos" },
				usuario: null
			});
		}

		if (password !== confirm_password) {
			return res.status(400).json({ 
				success: false, 
				error: { message: "Las contraseñas no coinciden" },
				usuario: null
			});
		}

		console.log("📝 Intento de registro:", email, tipo_usuario);

		const result = await AuthService.crearUsuario({
			email,
			password,
			tipo_usuario,
			id_relacionado: id_relacionado || null
		});

		if (result.error || !result.usuario) {
			return res.status(400).json({
				success: false,
				error: result.error || { message: "Error al crear la cuenta" },
				usuario: null
			});
		}

		// No devolver el password_hash por seguridad
		const usuarioSeguro = { ...result.usuario };
		if (usuarioSeguro.password_hash) {
			delete usuarioSeguro.password_hash;
		}

		return res.json({
			success: true,
			error: null,
			usuario: usuarioSeguro
		});
	} catch (error) {
		console.error("❌ Error en /api/registro:", error);
		return res.status(500).json({
			success: false,
			error: { message: error.message || "Error interno del servidor" },
			usuario: null
		});
	}
});

export default router;

