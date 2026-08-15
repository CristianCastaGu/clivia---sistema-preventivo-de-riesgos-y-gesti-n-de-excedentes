import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Sprout, 
  ShieldAlert, 
  Users, 
  Building2, 
  Volume2, 
  RotateCcw, 
  Copy, 
  Check, 
  CornerDownLeft,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { ChatMessage, UserRole } from "../types";

interface ChatBotViewProps {
  userRole: UserRole;
}

export const ChatBotView: React.FC<ChatBotViewProps> = ({ userRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "clivia",
      text: `Hola, soy **CLIVIA AI**, tu asesor experto en prevención de riesgos agroclimáticos, desastres naturales y optimización de excedentes agrícolas.

He configurado mi base de conocimiento para tu perfil de **${userRole.toUpperCase()}**.

¿En qué puedo ayudarte hoy? Puedes preguntarme sobre medidas preventivas ante heladas, rutas de albergues, protocolos de cosecha de emergencia o cómo conectar tus excedentes con bancos de alimentos.`,
      timestamp: "Ahora",
      severityBadge: "verde",
      suggestedActions: [
        "¿Cómo proteger mi maíz de la helada pronosticada?",
        "Tengo 10 toneladas de hortalizas en riesgo, ¿cómo donarlas?",
        "¿Qué albergue temporal está habilitado en mi zona?",
        "Protocolo de drenaje para evitar inundación en parcelas"
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts per role
  const quickPromptsByRole: Record<UserRole, string[]> = {
    productor: [
      "❄️ Medidas urgentes para mitigar helada de -3°C en maíz y hortalizas",
      "🚜 Cómo registrar un lote para cosecha anticipada y transporte a banco de alimentos",
      "💧 Protocolo de riego nocturno contra estrés hídrico",
      "📄 ¿Qué requisitos necesito para el certificado deducible de donación SAT?"
    ],
    ciudadano: [
      "🏠 ¿Dónde está el albergue temporal más cercano en caso de lluvia extrema?",
      "⚠️ ¿Cómo reportar un camino rural inundado o poste caído?",
      "🎒 Mochila de emergencia familiar recomendada por Protección Civil",
      "📞 Números de emergencia directos en caso de contingencia climática"
    ],
    autoridad: [
      "🚨 Activar protocolo de alerta roja municipal por frente polar",
      "📊 Estimación de población y cultivos afectados en Valle Central",
      "🚛 Despacho de unidades y maquinaria de desazolve a zonas bajas",
      "📢 Generar boletín oficial de Protección Civil para difusión comunitaria"
    ],
    ong_banco: [
      "📦 Ver oferta de excedentes agrícolas disponibles para recepción hoy",
      "❄️ Requisitos de cadena de frío para donación de fresa y tomate",
      "🚚 Coordinar ruta logística de recolección en parcelas ejidales",
      "🍲 Plan de raciones alimentarias para comedores comunitarios prioritarios"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          role: userRole,
          context: {
            region: "Valle Central / Altiplano",
            crop: "Maíz Blanco y Tomate",
            alertLevel: "AMARILLO (Vigilancia Polar Activa)"
          }
        })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "clivia",
        text: data.reply || "He procesado tu consulta.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        severityBadge: text.toLowerCase().includes("helada") || text.toLowerCase().includes("inundac") ? "rojo" : "verde"
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "clivia",
        text: "Hubo un inconveniente al conectar con el motor de IA. He activado las guías locales de contingencia.",
        timestamp: "Ahora",
        severityBadge: "amarillo"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        sender: "clivia",
        text: `Conversación reiniciada. Estoy listo para ayudarte con tu perfil de **${userRole.toUpperCase()}**.`,
        timestamp: "Ahora"
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 animate-in fade-in">
      {/* Header card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl border border-emerald-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white">Asistente CLIVIA con Gemini 3.7 Flash</h2>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                IA Activa
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Modo adaptado para: <strong className="text-white capitalize">{userRole}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Reiniciar chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Preguntas Rápidas Recomendadas para tu Rol:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPromptsByRole[userRole].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-left text-xs bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 border border-slate-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[440px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Body */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                  isUser
                    ? "bg-slate-900 text-white rounded-tr-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 border-b border-white/10 pb-1 mb-1">
                  <span className="font-semibold">{isUser ? "Tú" : "CLIVIA Asesor"}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-emerald-400 transition"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message text with basic markdown styling */}
                <div className="whitespace-pre-line font-normal space-y-1">
                  {msg.text.split("\n\n").map((paragraph, i) => (
                    <p key={i}>
                      {paragraph.split("**").map((chunk, j) =>
                        j % 2 === 1 ? <strong key={j} className="font-bold">{chunk}</strong> : chunk
                      )}
                    </p>
                  ))}
                </div>

                {/* Suggested Follow up actions if available */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Consultas sugeridas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, k) => (
                        <button
                          key={k}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-md text-[11px] font-medium transition"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>CLIVIA y Gemini están analizando datos meteorológicos y agronómicos...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Escribe una pregunta para CLIVIA (ej: ¿Cómo proteger mi cultivo ante helada?)...`}
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
