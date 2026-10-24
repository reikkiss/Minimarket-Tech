import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// API Route for Gemini AI retail intelligence & restocking advisor
app.post('/api/ai-recommendations', async (req, res) => {
  try {
    const { prompt, storeContext } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY no está configurada. Por favor configure su API Key en el panel de secretos.' 
      });
    }

    const systemInstruction = `Eres un experto en arquitectura de retail autónomo (Grab & Go), visión artificial (YOLO Edge) y optimización de cadena de suministro adaptada específicamente al mercado de la República Dominicana (Santo Domingo, Santiago, zonas turísticas). Tus análisis deben considerar productos locales (Presidente, Café Santo Domingo, Salami Induveca, Plátanos, Casabe, Quesos locales, etc.), métodos de pago dominicanos (Qik, Azul, Tio Tap) y optimización de costos en hardware Edge de bajo costo (Raspberry Pi 5 / Jetson Nano).`;

    const fullPrompt = `${prompt}\n\nContexto actual de la tienda/simulación: ${JSON.stringify(storeContext || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error al procesar la solicitud con Gemini AI.' });
  }
});

// Vite middleware setup for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Grab & Go RD corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
