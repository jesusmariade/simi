// src/app.js

import express from "express";
import path from "path";
import os from "os";
import farmaciaRoutes from "./routes/farmaciaRoutes.js";
import sucursalRoutes from "./routes/sucursalRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import citaRoutes from "./routes/citaRoutes.js";
import licenciaRoutes from "./routes/LicenciaRoutes.js";
//import para probar
import configRoutes from './routes/configRoutes.js';



const app = express();
//alo puso
// Permitir servir header.html, footer.html, index.html (desde la raíz del proyecto)
app.use(express.static(process.cwd()));

//yo puse
app.use("/src", express.static(path.join(process.cwd(), "src")));



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//nueva linea para probar
app.use("/api", configRoutes);

// CORS básico y manejo de preflight (útil si expones con ngrok/localtunnel)
app.use((req, res, next) => {
	// permitir todos los orígenes temporalmente
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

// Archivos estáticos
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/views", express.static(path.join(process.cwd(), "src", "views")));

// Rutas
app.use("/farmacia", farmaciaRoutes);
app.use("/sucursales", sucursalRoutes);
app.use("/medico", medicoRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/citas", citaRoutes);
app.use("/licencias", licenciaRoutes);

app.get("/", (req, res) => {
	// redirige al archivo mostrado en tu proyecto
	res.redirect("/views/Personal_Farmacia/farmacia.html");
});

// 404
app.use((req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send("Internal Server Error");
});

// Puerto y host (0.0.0.0 para LAN)
const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

function startServer(port, attempt = 0, maxAttempts = 10) {
	const server = app.listen(port, HOST, () => {
		// obtener IP local para compartir en LAN
		const nets = os.networkInterfaces();
		let localIp = "localhost";
		for (const name of Object.keys(nets)) {
			for (const net of nets[name]) {
				if (net.family === "IPv4" && !net.internal) {
					localIp = net.address;
					break;
				}
			}
			if (localIp !== "localhost") break;
		}
		console.log('Servidor corriendo en:');
		console.log(`- Local: http://localhost:${port}`);
		console.log(`- LAN   : http://${localIp}:${port}  (comparte esto si tu firewall lo permite)`);
	});

	server.on("error", (err) => {
		if (err && err.code === "EADDRINUSE") {
			console.warn(`Puerto ${port} en uso.`);
			if (attempt < maxAttempts) {
				const nextPort = port + 1;
				console.log(`Intentando puerto ${nextPort}...`);
				setTimeout(() => startServer(nextPort, attempt + 1, maxAttempts), 200);
			} else {
				console.error(`No se pudo iniciar el servidor: puertos ${port} - ${port + maxAttempts} ocupados.`);
				console.error(`Si quieres liberar el puerto 3000 ejecuta: netstat -ano | findstr :3000  (Windows) o sudo lsof -i :3000 (macOS/Linux) y luego mata el PID.`);
				process.exit(1);
			}
		} else {
			console.error("Error del servidor:", err);
			process.exit(1);
		}
	});
}

// Inicia con DEFAULT_PORT (si está ocupado intentará puertos siguientes)
startServer(DEFAULT_PORT);