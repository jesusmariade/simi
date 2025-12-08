// src/routes/farmaciaRoutes.js

import { Router } from "express";
import path from "path";
import { FarmaciaController } from "../controllers/FarmaciaController.js";
import { FarmaciaService } from "../services/FarmaciaService.js";
import { VentaMedicamentoService } from "../services/VentaMedicamentoService.js";

const router = Router();

// Servir la página principal de la farmacia (HTML estático)
router.get("/", (req, res) => {
	return res.sendFile(path.join(process.cwd(), "src", "views", "Personal_Farmacia", "farmacia.html"));
});

// API: recetas
router.get("/recetas", async (req, res) => {
	try {
		const idFarmacia = parseInt(req.query.idFarmacia) || 1;
		const { data, error } = await FarmaciaService.obtenerRecetas(idFarmacia);
		
		if (error) {
			return res.status(500).json({ error });
		}
		
		res.json({ recetas: data || [] });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

router.post("/surtir-receta", async (req, res) => {
	try {
		const { idReceta } = req.body;
		if (!idReceta) {
			return res.status(400).json({ error: { message: "idReceta es requerido" } });
		}
		
		const { success, error } = await FarmaciaController.surtirReceta(idReceta);
		
		if (error || !success) {
			return res.status(500).json({ error });
		}
		
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

// API: ventas
router.get("/ventas", async (req, res) => {
	try {
		const idFarmacia = parseInt(req.query.idFarmacia) || 1;
		const { data, error } = await FarmaciaService.obtenerVentas(idFarmacia);
		
		if (error) {
			return res.status(500).json({ error });
		}
		
		res.json({ ventas: data || [] });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

router.post("/ventas", async (req, res) => {
	try {
		const { medicamentos, idFarmacia = 1, vendedor = 'Farmacéutico' } = req.body;
		
		if (!medicamentos || !Array.isArray(medicamentos) || medicamentos.length === 0) {
			return res.status(400).json({ error: { message: "Debe agregar al menos un medicamento" } });
		}
		
		// Agrupar medicamentos duplicados por id_medicamento y sumar cantidades
		const medicamentosAgrupados = {};
		medicamentos.forEach(med => {
			const idMed = med.id_medicamento;
			if (medicamentosAgrupados[idMed]) {
				medicamentosAgrupados[idMed].cantidad += med.cantidad;
				medicamentosAgrupados[idMed].subtotal = medicamentosAgrupados[idMed].cantidad * medicamentosAgrupados[idMed].precio;
			} else {
				medicamentosAgrupados[idMed] = {
					id_medicamento: med.id_medicamento,
					nombre: med.nombre,
					precio: med.precio,
					cantidad: med.cantidad,
					subtotal: med.subtotal
				};
			}
		});
		
		const medicamentosUnicos = Object.values(medicamentosAgrupados);
		const totalVenta = medicamentosUnicos.reduce((sum, med) => sum + med.subtotal, 0);
		
		// Crear la venta
		const venta = {
			id_farmacia: parseInt(idFarmacia),
			id_medicamento: null,
			fecha_venta: new Date().toISOString().split('T')[0],
			hora_venta: new Date().toTimeString().split(' ')[0],
			total: totalVenta,
			tipo: 'venta',
			vendedor: vendedor
		};
		
		// Crear la venta en la base de datos
		const { data: ventaCreada, error: errorVenta } = await FarmaciaService.crearVenta(venta);
		
		if (errorVenta || !ventaCreada) {
			return res.status(500).json({ error: errorVenta || { message: 'Error al crear la venta' } });
		}
		
		// Agregar cada medicamento único a la venta
		let medicamentosAgregados = 0;
		
		for (const medicamento of medicamentosUnicos) {
			const { data, error: errorMed } = await VentaMedicamentoService.agregarMedicamentoAVenta(
				ventaCreada.id_venta,
				medicamento.id_medicamento,
				medicamento.cantidad,
				medicamento.precio,
				medicamento.subtotal
			);
			
			if (data && !errorMed) {
				medicamentosAgregados++;
			}
		}
		
		if (medicamentosAgregados === 0) {
			await FarmaciaService.eliminarVenta(ventaCreada.id_venta);
			return res.status(500).json({ error: { message: 'Error al agregar medicamentos a la venta' } });
		}
		
		res.status(201).json({ venta: ventaCreada });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

router.put("/ventas/:id", async (req, res) => {
	try {
		const idVenta = parseInt(req.params.id);
		const { venta, error } = await FarmaciaController.actualizarVenta(idVenta, req.body);
		
		if (error || !venta) {
			return res.status(500).json({ error });
		}
		
		res.json({ venta });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

router.delete("/ventas/:id", async (req, res) => {
	try {
		const idVenta = parseInt(req.params.id);
		const { success, error } = await FarmaciaController.eliminarVenta(idVenta);
		
		if (error || !success) {
			return res.status(500).json({ error });
		}
		
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: { message: error.message } });
	}
});

export default router;