//prueba para revisar error
import { Router } from "express";

const router = Router();

// Endpoint que devuelve config de Supabase (seguro desde servidor)
router.get("/supabase-config", (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL || 'https://augycbgsquurallcmzir.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Z3ljYmdzcXV1cmFsbGNtemlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjIzMzYsImV4cCI6MjA3ODUzODMzNn0.yNce0WIZiV3HWUUTxLxWSDSTVao-yTwCuoIbSjZc3a4'
  });
});

export default router;