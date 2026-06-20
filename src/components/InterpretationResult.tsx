import React, { useState } from "react";
import { DreamAnalysis } from "../types";
import { Copy, Check, Info, Award, Share2, Clipboard, Ticket, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InterpretationResultProps {
  analysis: DreamAnalysis;
  dreamText: string;
}

export default function InterpretationResult({ analysis, dreamText }: InterpretationResultProps) {
  const [copiedText, setCopiedText] = useState("");
  const [showSimulateTicket, setShowSimulateTicket] = useState(false);

  // Group Info dictionary matching group to bicho list
  const groupsAndBichos = [
    { name: "Avestruz", num: 1, range: "01-04" },
    { name: "Águia", num: 2, range: "05-08" },
    { name: "Burro", num: 3, range: "09-12" },
    { name: "Borboleta", num: 4, range: "13-16" },
    { name: "Cachorro", num: 5, range: "17-20" },
    { name: "Cabra", num: 6, range: "21-24" },
    { name: "Carneiro", num: 7, range: "25-28" },
    { name: "Camelo", num: 8, range: "29-32" },
    { name: "Cobra", num: 9, range: "33-36" },
    { name: "Coelho", num: 10, range: "37-40" },
    { name: "Cavalo", num: 11, range: "41-44" },
    { name: "Elefante", num: 12, range: "45-48" },
    { name: "Galo", num: 13, range: "49-52" },
    { name: "Gato", num: 14, range: "53-56" },
    { name: "Jacaré", num: 15, range: "57-60" },
    { name: "Leão", num: 16, range: "61-64" },
    { name: "Macaco", num: 17, range: "65-68" },
    { name: "Porco", num: 18, range: "69-72" },
    { name: "Pavão", num: 19, range: "73-76" },
    { name: "Peru", num: 20, range: "77-80" },
    { name: "Touro", num: 21, range: "81-84" },
    { name: "Tigre", num: 22, range: "85-88" },
    { name: "Urso", num: 23, range: "89-92" },
    { name: "Veado", num: 24, range: "93-96" },
    { name: "Vaca", num: 25, range: "97-00" }
  ];

  const matchedGroup = groupsAndBichos.find(
    g => g.name.toLowerCase() === analysis.bicho.trim().toLowerCase()
  );

  const handleCopy = (numbers: number[] | string, type: string) => {
    let textToCopy = "";
    if (Array.isArray(numbers)) {
      textToCopy = numbers.map(n => n.toString().padStart(2, "0")).join(", ");
    } else {
      textToCopy = numbers;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleCopyAll = () => {
    const maxChars = 220;
    // Remove extra formatting lines for a clean inline copy
    const cleanInterpretacao = analysis.interpretacao.replace(/\n+/g, " ").trim();
    const resumida = cleanInterpretacao.length > maxChars 
      ? cleanInterpretacao.substring(0, maxChars) + "..." 
      : cleanInterpretacao;

    const fullSummary = `🔮 *PORTAL DO SONHOS & SORTE* 🔮

📝 *Meu Sonho:* "${dreamText.trim().length > 90 ? dreamText.trim().substring(0, 90) + "..." : dreamText.trim()}"

✨ *O que significa:* 
"${resumida}"

🍀 *Meus Palpites Místicos:*
• 🐾 Jogo do Bicho: ${analysis.bicho} (Dezena: ${analysis.dezena})
• 🟢 Mega-Sena: ${analysis.mega_sena.map(n => n.toString().padStart(2, "0")).join(" - ")}
• 🔵 Lotofácil: ${analysis.lotofacil.map(n => n.toString().padStart(2, "0")).join(" - ")}

Descubra o significado do seu sonho também! ✨`;

    navigator.clipboard.writeText(fullSummary);
    setCopiedText("all");
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Interpretation Section */}
      <div className="bg-card-bg rounded-2xl border border-border-custom p-6 md:p-8 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Star className="w-48 h-48 text-indigo-600 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-custom">
            <div>
              <span className="text-xs font-bold font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                Revelação Onírica
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-text-prime mt-2">
                Significado do seu Sonho
              </h3>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 text-xs text-text-second hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition py-1.5 px-3 rounded-lg border border-border-custom hover:border-indigo-100 bg-sec-bg"
              >
                {copiedText === "all" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartilhar Palpites</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4 text-text-prime leading-relaxed text-sm md:text-base whitespace-pre-line font-serif italic text-justify bg-amber-500/5 p-5 rounded-xl border border-amber-500/10 dark:border-amber-500/20">
            {analysis.interpretacao}
          </div>
        </div>
      </div>

      {/* Lucky Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Jogo do Bicho Result */}
        <div className="bg-card-bg rounded-2xl border border-border-custom p-6 shadow-sm md:col-span-4 flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                Jogo do Bicho
              </span>
              <button
                onClick={() => handleCopy(`${analysis.bicho} - Dezena ${analysis.dezena}`, "bicho")}
                className="text-text-mute hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                title="Copiar palpite bicho"
              >
                {copiedText === "bicho" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-center py-6 bg-sec-bg rounded-2xl border border-border-custom mb-4">
              <div 
                className="text-4xl md:text-5xl font-bold tracking-tight text-text-prime font-serif leading-none"
                style={{ textShadow: "0px 1px 1px rgba(0,0,0,0.02)" }}
              >
                {analysis.bicho}
              </div>
              <div className="text-xs text-text-mute font-mono mt-3 uppercase tracking-wider">
                Grupo {matchedGroup ? matchedGroup.num.toString().padStart(2, "0") : "?"} • Dezenas: {matchedGroup ? matchedGroup.range : "??-??"}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-t border-border-custom pt-4">
              <span className="text-xs text-text-second font-medium font-mono uppercase">Dezena Indicada</span>
              <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-lg border border-indigo-500/20">
                {analysis.dezena}
              </span>
            </div>
          </div>
        </div>

        {/* Mega Sena Balls Result */}
        <div className="bg-card-bg rounded-2xl border border-border-custom p-6 shadow-sm md:col-span-8 flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                Mega-Sena
              </span>
              <button
                onClick={() => handleCopy(analysis.mega_sena, "mega")}
                className="text-text-mute hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                title="Copiar números da Mega-Sena"
              >
                {copiedText === "mega" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-text-second mb-6">
              Exatamente 6 dezenas da sorte ordenadas pelo peso astrológico das letras do seu sonho.
            </p>

            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3.5 py-4">
              {analysis.mega_sena.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-mono font-bold text-lg md:text-xl shadow-md border-2 border-white/90 relative"
                >
                  <span className="z-10">{num.toString().padStart(2, "0")}</span>
                  <div className="absolute top-1 left-2.5 w-3 h-1.5 bg-white/20 rounded-full blur-[0.5px]"></div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-custom pt-4 flex items-center justify-between text-xs text-text-second">
            <span>Probabilidade equilibrada</span>
            <span>Unicidade garantida</span>
          </div>
        </div>
      </div>

      {/* Lotofacil Coupon styled component */}
      <div className="bg-card-bg rounded-2xl border border-border-custom p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold font-mono text-purple-700 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md">
              Lotofácil
            </span>
            <span className="text-xs text-text-second ml-3">
              15 marcadores do destino selecionados do bilhete celestial
            </span>
          </div>
          <button
            onClick={() => handleCopy(analysis.lotofacil, "loto")}
            className="text-text-mute hover:text-purple-600 dark:hover:text-purple-400 transition"
            title="Copiar números da Lotofácil"
          >
            {copiedText === "loto" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* 25 block grids */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-13 lg:grid-cols-25 gap-2 py-4">
          {Array.from({ length: 25 }, (_, i) => i + 1).map(num => {
            const isSelected = analysis.lotofacil.includes(num);

            return (
              <div
                key={num}
                className={`aspect-square sm:aspect-auto sm:h-11 rounded-lg flex flex-col items-center justify-center border font-mono font-bold text-xs sm:text-sm transition relative ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                    : "bg-sec-bg text-text-mute border-border-custom/40"
                }`}
              >
                <span>{num.toString().padStart(2, "0")}</span>
                {isSelected && (
                  <div className="absolute w-1 h-1 rounded-full bg-white/70 bottom-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Bill Maker Panel */}
      <div className="bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Ticket className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-text-prime text-sm md:text-base">Guarde seus Palpites ou Simule seu Bilhete</h4>
            <p className="text-xs text-text-second mt-1">
              Visualize seus palpites num bilhete místico personalizado e comemore sua sorte.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSimulateTicket(!showSimulateTicket)}
          className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition py-2 px-4 rounded-xl shadow-sm hover:shadow"
        >
          <Ticket className="w-4 h-4" />
          {showSimulateTicket ? "Ocultar Bilhete" : "Ver Bilhete da Sorte"}
        </button>
      </div>

      {/* Custom Simulated Celestial Ticket Card */}
      <AnimatePresence>
        {showSimulateTicket && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-card-bg rounded-2xl border border-border-custom p-6 flex justify-center"
          >
            <div className="w-full max-w-sm bg-sec-bg rounded-xl border border-dashed border-border-custom p-5 font-mono text-[11px] text-text-second shadow-inner relative space-y-4">
              
              {/* Ticket Edge punch holes */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card-bg border border-border-custom z-10"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card-bg border border-border-custom z-10"></div>

              <div className="text-center space-y-1 border-b border-dashed border-border-custom pb-3">
                <div className="font-bold text-text-prime tracking-wider text-xs">★ ORÁCULO DOS SONHOS ★</div>
                <div className="text-[9px] text-text-mute">BILHETE DA SORTE ONÍRICA</div>
                <div className="text-[8px] text-text-mute font-mono">DATA: {new Date().toLocaleDateString("pt-BR")}</div>
              </div>

              <div>
                <div className="font-bold text-text-mute text-[10px] mb-1">RELAÇÃO DE SONHO:</div>
                <div className="italic text-text-prime bg-card-bg p-2 rounded text-[10px] line-clamp-2 border border-border-custom">
                  "{dreamText}"
                </div>
              </div>

              <div className="space-y-3 py-2 border-b border-dashed border-border-custom">
                <div className="flex justify-between items-center text-text-prime">
                  <span className="font-bold">🐾 BICHO SELECIONADO:</span>
                  <span className="font-bold bg-amber-500/20 text-amber-950 dark:text-amber-200 px-1.5 py-0.5 rounded">{analysis.bicho} ({analysis.dezena})</span>
                </div>
                
                <div className="space-y-1">
                  <div className="font-bold">🟢 DEZENAS MEGA-SENA:</div>
                  <div className="font-bold text-emerald-950 dark:text-emerald-200 text-xs tracking-wider bg-emerald-500/15 p-1.5 rounded text-center">
                    {analysis.mega_sena.map(n => n.toString().padStart(2, "0")).join("  ")}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold">🔵 FILTRO LOTOFÁCIL (15 DEZENAS):</div>
                  <div className="font-bold text-purple-950 dark:text-purple-200 text-xs tracking-wider bg-purple-500/15 p-1.5 rounded text-center">
                    {analysis.lotofacil.map(n => n.toString().padStart(2, "0")).join(" ")}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 text-[9px] text-text-mute space-y-1">
                <div>Boa sorte! Vá em frente com fé e intuição.</div>
                <div className="text-[8px] tracking-tight text-text-mute/80">#PORTAL-MISTICO-SONHOS-2026</div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
