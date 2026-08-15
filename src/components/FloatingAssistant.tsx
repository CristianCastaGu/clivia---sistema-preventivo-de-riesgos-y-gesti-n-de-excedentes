import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, X, Lightbulb, Minus } from "lucide-react";
import { ChatMessage, UserRole } from "../types";

interface FloatingAssistantProps {
  userRole: UserRole;
}

const quickPromptsByRole: Record<UserRole, string[]> = {
  productor: ["❄️ ¿Cómo protejo mi cultivo de la helada de hoy?", "🚜 Tengo un lote maduro y viene lluvia fuerte, ¿cosecho antes?"],
  ciudadano: ["🏠 ¿Dónde está el albergue más cercano?", "📞 Números de emergencia de mi zona"],
  autoridad: ["🚨 Protocolo de alerta roja municipal", "📊 Parcelas y población en riesgo"],
  ong_banco: ["📦 ¿Qué excedentes hay disponibles hoy?", "🚚 Coordinar ruta de recolección"],
};

const initialMessage = (role: UserRole): ChatMessage => ({
  id: "msg-welcome",
  sender: "clivia",
  text: `Hola, soy **CLIVIA**. Cuéntame tu cultivo o repórtame un riesgo — estoy aquí para ayudarte a analizar datos o registrar un excedente.`,
  timestamp: "Ahora",
});

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage(userRole)]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: "user", text, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, role: userRole, context: { region: "Tocancipá, Cundinamarca" } }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: "clivia", text: data.reply || "He procesado tu consulta.", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `bot-err-${Date.now()}`, sender: "clivia", text: "No pude conectar con el motor de IA. Activé las guías locales.", timestamp: "Ahora" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed z-50 bottom-24 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[560px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4"
          role="dialog"
          aria-label="Asistente CLIVIA"
        >
          <div className="bg-primary text-on-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">Asistente CLIVIA</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10" title="Minimizar">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-inverse-surface text-inverse-on-surface" : "bg-primary text-on-primary"}`}>
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${isUser ? "bg-inverse-surface text-inverse-on-surface" : "bg-surface-container-low text-on-surface"}`}>
                    {msg.text.split("\n\n").map((p, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                        {p.split("**").map((chunk, j) => (j % 2 === 1 ? <strong key={j}>{chunk}</strong> : chunk))}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                CLIVIA está pensando…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {quickPromptsByRole[userRole].map((q) => (
                <button key={q} onClick={() => handleSend(q)} className="text-[11px] bg-surface-container-low hover:bg-primary-fixed text-on-surface-variant hover:text-on-primary-fixed border border-outline-variant px-2.5 py-1 rounded-full transition">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-outline-variant p-2.5 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Escribe tu mensaje…"
              disabled={isLoading}
              className="flex-1 text-xs px-3 py-2 bg-surface border border-outline-variant rounded-full focus:ring-1 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-primary-container hover:text-on-primary-container transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed z-50 bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition active:scale-95"
        aria-label={isOpen ? "Cerrar asistente CLIVIA" : "Abrir asistente CLIVIA"}
        title="Asistente CLIVIA"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </>
  );
};
