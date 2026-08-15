import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      name: "CLIVIA API",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Chat endpoint with Gemini
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, role = "agricultor", context = {} } = req.body;

      if (!message) {
        return res.status(400).json({ error: "El mensaje es requerido" });
      }

      const ai = getGeminiClient();

      const systemInstruction = `Eres CLIVIA AI, el asistente inteligente y experto en prevención de riesgos climáticos, desastres naturales y optimización de excedentes agrícolas.
Tu objetivo es brindar respuestas precisas, estructuradas y empáticas para mitigar riesgos ante heladas, inundaciones, sequías, vendavales y plagas, así como orientar la cosecha anticipada y redistribución de excedentes agrícolas a bancos de alimentos y comunidades vulnerables.

El usuario actual tiene el rol: ${role.toUpperCase()}.
Contexto actual del usuario:
- Ubicación / Región: ${context.region || "Zona Centro-Occidente"}
- Tipo de cultivo / bien: ${context.crop || "Cultivos Mixtos"}
- Nivel de alerta en su zona: ${context.alertLevel || "AMARILLO (Preventivo)"}

Pautas para responder:
1. Sé conciso, claro, estructurado (con viñetas o pasos numerados si amerita) y usa tono profesional pero accesible y empático.
2. Si se trata de un productor agrícola: da medidas preventivas agronómicas inmediatas (drenajes, cobertores térmicos, riego preventivo antiheladas, cosecha anticipada, contacto con banco de alimentos para excedentes).
3. Si se trata de un ciudadano / comunidad: indica rutas seguras, albergues oficiales, medidas de protección civil y cómo reportar incidencias.
4. Si se trata de una autoridad / entidad: sugiere asignación logística de recursos, activación de protocolos de contingencia y semáforo de riesgo.
5. Siempre incluye una sección destacada con "Acción Inmediata Sugerida" y "Semáforo de Riesgo Estimado" (Verde / Amarillo / Rojo).`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        return res.json({
          reply: response.text || "No se pudo generar respuesta.",
          source: "gemini-3.7-flash",
        });
      } else {
        // Fallback intelligent simulation if no API key is present
        const fallbackReply = generateIntelligentFallback(message, role, context);
        return res.json({
          reply: fallbackReply,
          source: "clivia-offline-engine",
        });
      }
    } catch (error: any) {
      console.error("Error in /api/gemini/chat:", error);
      res.status(500).json({
        error: "Error procesando solicitud con Gemini",
        details: error.message,
      });
    }
  });

  // Risk assessment endpoint
  app.post("/api/gemini/analyze-risk", async (req, res) => {
    try {
      const { cropType, hectares, region, forecastEvent } = req.body;
      const ai = getGeminiClient();

      if (ai) {
        const prompt = `Analiza el riesgo agroclimático para:
- Cultivo: ${cropType}
- Superficie: ${hectares} hectáreas
- Región: ${region}
- Amenaza climática pronosticada: ${forecastEvent}

Devuelve un análisis estructurado en formato JSON con las claves:
- "riskScore": número del 0 al 100
- "alertLevel": "VERDE" | "AMARILLO" | "ROJO"
- "estimatedLossWithoutAction": número porcentual (ej. 75)
- "harvestRescuePotential": número porcentual que puede cosecharse anticipadamente (ej. 80)
- "suggestedSurplusAction": texto breve de recomendación (ej. "Cosecha anticipada de 14 toneladas y redistribución a Banco de Alimentos Regional")
- "preventiveSteps": lista de 3 a 4 acciones recomendadas con plazos
- "economicImpactAssessment": breve resumen financiero y humanitario`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        try {
          const parsed = JSON.parse(response.text || "{}");
          return res.json(parsed);
        } catch {
          return res.json({ raw: response.text });
        }
      } else {
        // Deterministic simulation
        return res.json({
          riskScore: 78,
          alertLevel: "ROJO",
          estimatedLossWithoutAction: 65,
          harvestRescuePotential: 85,
          suggestedSurplusAction: `Cosecha anticipada preventiva de ${cropType} en ${region} y derivación de excedente a la Red de Bancos de Alimentos.`,
          preventiveSteps: [
            "Activar cuadrilla de cosecha prioritaria en las próximas 36 horas",
            "Aplicar riego ligero para aumentar inercia térmica en suelo",
            "Notificar a centro de acopio comunal para enlace logístico de camión refrigerado",
            "Monitorear alertas del radar meteorológico en tiempo real"
          ],
          economicImpactAssessment: "El rescate oportuno evitaría pérdidas por más de $120,000 MXN y aportaría 4,200 raciones alimentarias a comedores comunitarios.",
          source: "clivia-offline-engine"
        });
      }
    } catch (error: any) {
      console.error("Error in /api/gemini/analyze-risk:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Surplus matching endpoint — implements the reasoning core of the surplus engine:
  // does the alert really force an early harvest, and if so, who should receive it.
  app.post("/api/gemini/surplus-match", async (req, res) => {
    try {
      const { cropType, quantityDescription, region, signal, urgencyHours = 48 } = req.body;

      if (!cropType || !signal) {
        return res.status(400).json({ error: "cropType y signal son requeridos" });
      }

      const ai = getGeminiClient();

      if (ai) {
        const prompt = `Eres el motor de razonamiento de excedentes de CLIVIA. Un productor reportó esta señal:
"${signal}"

Datos conocidos:
- Cultivo: ${cropType}
- Cantidad aproximada: ${quantityDescription || "no especificada, estímala de forma conservadora"}
- Región: ${region || "no especificada"}
- Ventana de tiempo antes de que se dañe: ${urgencyHours} horas

Tarea (en este orden):
1. Razona si la señal realmente implica que el productor debe cosechar antes de tiempo. No toda alerta climática obliga a cosechar antes — evalúa con criterio agronómico real, no una regla fija.
2. Si aplica, estima la cantidad de excedente (en toneladas o unidades razonables) y la ventana de tiempo antes de que se dañe.
3. Recomienda 1 o 2 destinos concretos (comprador cercano, transformación, o donación a banco de alimentos) — nunca más de 2. Cada uno con una razón breve y con un mensaje ya redactado en primera persona, listo para que el productor lo envíe.

Devuelve SOLO JSON con esta forma exacta:
{
  "requiresForcedHarvest": boolean,
  "reasoning": "una frase explicando el porqué de la decisión",
  "estimatedTons": number,
  "windowHours": number,
  "options": [
    {
      "id": "opt-1",
      "kind": "comprador" | "transformacion" | "donacion",
      "name": "nombre del destino",
      "distanceKm": number,
      "reason": "razón breve, una frase",
      "tag": "etiqueta corta, ej. 'Recibe hoy'",
      "message": "mensaje en primera persona listo para enviar al destino"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        try {
          const parsed = JSON.parse(response.text || "{}");
          return res.json(parsed);
        } catch {
          return res.json({ raw: response.text });
        }
      } else {
        return res.json(generateSurplusMatchFallback(cropType, quantityDescription, signal, urgencyHours));
      }
    } catch (error: any) {
      console.error("Error in /api/gemini/surplus-match:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Crop photo analysis — multimodal (Gemini vision) when a key is available.
  app.post("/api/gemini/analyze-crop-photo", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", cropType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "imageBase64 es requerido" });
      }

      const ai = getGeminiClient();

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Eres un agrónomo experto de CLIVIA. Analiza esta foto de un cultivo de ${cropType || "identifica el cultivo en la imagen"}. Evalúa estado fitosanitario, señales de estrés hídrico, plagas o daño por clima. Devuelve SOLO JSON: {"status": "saludable"|"atencion"|"critico", "summary": "una frase", "findings": ["hallazgo 1", "hallazgo 2"], "recommendedActions": ["acción 1", "acción 2"]}`,
                },
                { inlineData: { mimeType, data: imageBase64 } },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        try {
          const parsed = JSON.parse(response.text || "{}");
          return res.json(parsed);
        } catch {
          return res.json({ raw: response.text });
        }
      } else {
        return res.json({
          status: "atencion",
          summary: `Análisis simulado para ${cropType || "el cultivo"}: se detectan señales leves de estrés que ameritan seguimiento.`,
          findings: [
            "Coloración foliar ligeramente irregular en el tercio inferior de la planta.",
            "No se observan signos evidentes de plaga activa en esta imagen.",
          ],
          recommendedActions: [
            "Revisar humedad del suelo en las próximas 24 horas.",
            "Tomar una segunda foto en 3-4 días para comparar evolución.",
            "Si el moteado se extiende, consultar a CLIVIA por el protocolo específico del cultivo.",
          ],
          source: "clivia-offline-engine",
        });
      }
    } catch (error: any) {
      console.error("Error in /api/gemini/analyze-crop-photo:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CLIVIA Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateSurplusMatchFallback(cropType: string, quantityDescription: string, signal: string, urgencyHours: number) {
  const signalLower = (signal || "").toLowerCase();
  // Simple heuristic standing in for the LLM's reasoning step: only escalate to
  // forced harvest when the signal names an acute threat, not a routine mention.
  const acuteKeywords = ["helada", "granizo", "inundac", "creciente", "lluvia fuerte", "vendaval", "tormenta"];
  const requiresForcedHarvest = acuteKeywords.some((k) => signalLower.includes(k));

  if (!requiresForcedHarvest) {
    return {
      requiresForcedHarvest: false,
      reasoning: "La señal reportada no describe una amenaza aguda inminente sobre el cultivo — se recomienda monitoreo, no cosecha forzada todavía.",
      estimatedTons: 0,
      windowHours: 0,
      options: [],
      source: "clivia-offline-engine",
    };
  }

  const tons = quantityDescription?.match(/[\d.]+/)?.[0] ? Number(quantityDescription.match(/[\d.]+/)[0]) : 2.5;

  return {
    requiresForcedHarvest: true,
    reasoning: `La señal describe una amenaza aguda (${signal}) que puede dañar ${cropType} antes de la cosecha planeada — se recomienda adelantar la cosecha dentro de las próximas ${urgencyHours} horas.`,
    estimatedTons: tons,
    windowHours: Number(urgencyHours) || 48,
    options: [
      {
        id: "opt-1",
        kind: "comprador",
        name: "Mercado local más cercano",
        distanceKm: 5,
        reason: "A 5 km, compra hoy mismo al precio de plaza.",
        tag: "Recibe hoy",
        message: `Hola, tengo ${quantityDescription || `${tons} toneladas`} de ${cropType} que se están madurando rápido por ${signal}. ¿Pueden recibirlas hoy al precio de plaza?`,
      },
      {
        id: "opt-2",
        kind: "donacion",
        name: "Banco de alimentos regional",
        distanceKm: 12,
        reason: "A 12 km, recibe con certificado de donación deducible.",
        tag: "Beneficio fiscal",
        message: `Hola, tengo ${quantityDescription || `${tons} toneladas`} de ${cropType} en buen estado que necesito despachar antes de que se dañen por ${signal}. Quisiera donarlas hoy, ¿me confirman ventana de recepción?`,
      },
    ],
    source: "clivia-offline-engine",
  };
}

function generateIntelligentFallback(message: string, role: string, context: any): string {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes("helada") || msgLower.includes("frio") || msgLower.includes("temperatura")) {
    return `❄️ **Protocolo de Protección ante Heladas (CLIVIA Alerta Preventiva)**

1. **Riego de Inercia Térmica:** Riega el suelo antes del anochecer; el suelo húmedo retiene más calor que el seco.
2. **Coberturas y Mantas Térmicas:** Si tienes cultivos hortícolas, cubre con malla antihelada o rastrojo orgánico.
3. **Cosecha Anticipada:** Si tu cultivo de ${context.crop || "maíz/hortalizas"} está en etapa madura, activa la cosecha de emergencia para evitar pérdida total.
4. **Enlace de Excedentes:** Nuestro motor ha identificado 3 centros de acopio y 2 bancos de alimentos listos para recibir lotes en 24h.

**Semáforo de Riesgo:** 🟡 AMARILLO - ALTO IMPACTO
*Acción sugerida:* Registrar lote para transporte coordinado antes de las 18:00 hrs.`;
  }

  if (msgLower.includes("lluvia") || msgLower.includes("inundac") || msgLower.includes("tormenta") || msgLower.includes("agua")) {
    return `🌧️ **Plan de Contingencia por Lluvias Torrenciales e Inundación**

1. **Drenajes y Zanjas:** Despeja canales de escorrentía perimetrales para evitar encharcamiento prolongado.
2. **Resguardo de Maquinaria e Insumos:** Eleva costales de fertilizantes y semillas al menos 1 metro sobre el nivel del suelo.
3. **Puntos Seguros:** Si estás en zona ribereña, ubica el albergue municipal más cercano en la pestaña **Mapa de Riesgo**.
4. **Cosecha Preventiva:** Para frutos perecederos (tomate, fresa, hortalizas), recolecta lo que esté a 80%+ de madurez de inmediato.

**Semáforo de Riesgo:** 🔴 ROJO - CRÍTICO
*Acción sugerida:* Reporta el estado de tus caminos de acceso en el módulo de Incidentes.`;
  }

  if (msgLower.includes("excedente") || msgLower.includes("banco") || msgLower.includes("donar") || msgLower.includes("vender") || msgLower.includes("cosecha")) {
    return `🚜 **Motor de Decisión y Redistribución de Excedentes Agrícolas**

Has activado el asistente de excedentes de CLIVIA:
- **Capacidad de rescate:** El algoritmo estima que hasta el 85% de tu lote amenazado puede ser canalizado exitosamente.
- **Destinos recomendados:**
  1. *Banco de Alimentos Regional*: Capacidad de recepción 8.5 Toneladas (Ruta: 22 km - 35 min).
  2. *Red de Comedores Comunitarios*: Demanda urgente de productos frescos.
- **Beneficios:** Certificado fiscal de donación, mitigación de merma y reducción de 3.2 ton de emisiones de CO2 por descomposición evitada.

**Semáforo:** 🟢 VERDE - LISTO PARA DESPACHO
*Acción sugerida:* Pulsa en 'Generar Manifiesto de Despacho' en el módulo de Excedentes.`;
  }

  return `🌿 **Asistente Preventivo CLIVIA**

He evaluado tu consulta para el rol de **${role.toUpperCase()}** en la región **${context.region || "Zona Centro"}**.

- **Estado agroclimático actual:** Monitoreo activo de frentes climáticos y variables de suelo.
- **Recomendación prioritaria:** Mantén actualizados los registros de tus parcelas y revisa el semáforo de alertas en el panel superior.
- **Herramientas a tu disposición:**
  1. Consulta el **Mapa de Riesgos** para ver polígonos de vulnerabilidad y refugios.
  2. Utiliza el **Simulador de Excedentes** si tienes alerta de fenómeno meteorológico inminente.
  3. Reporta incidentes en tiempo real para ayudar a la comunidad y autoridades.

¿Deseas que analice un cultivo o zona específica con el modelo predictivo?`;
}

startServer();
