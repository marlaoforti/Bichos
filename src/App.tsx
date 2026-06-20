import React, { useState, useEffect } from "react";
import { DreamAnalysis, DreamHistoryItem } from "./types";
import DreamInput from "./components/DreamInput";
import InterpretationResult from "./components/InterpretationResult";
import DreamHistory from "./components/DreamHistory";
import DreamLore from "./components/DreamLore";
import { Sparkles, Moon, Sun, Scroll, Star, Compass, AlertCircle, RefreshCw, Feather } from "lucide-react";

export default function App() {
  const [dreamText, setDreamText] = useState("");
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DreamHistoryItem[]>([]);

  // Dark mode state with safe initialization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("dream_dark_mode");
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return false;
  });

  // Apply dark class to documentElement
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("dream_dark_mode", JSON.stringify(isDarkMode));
    } catch (e) {
      console.error("Erro ao salvar modo noturno:", e);
    }
  }, [isDarkMode]);

  // Load history on mount safely from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dream_interpretation_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar histórico local:", e);
    }
  }, []);

  const handleDreamSubmit = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/interpretar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dreamText: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao decifrar seu sonho.");
      }

      setDreamText(text);
      setAnalysis(data);

      // Create new history item
      const newItem: DreamHistoryItem = {
        id: crypto.randomUUID(),
        dreamText: text,
        analysis: data,
        createdAt: new Date().toISOString(),
      };

      // Prepend to history, max 50 items
      const updatedHistory = [newItem, ...history.slice(0, 49)];
      setHistory(updatedHistory);
      localStorage.setItem("dream_interpretation_history", JSON.stringify(updatedHistory));

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById("revelation-view");
        resultsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão com o portal místico.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: DreamHistoryItem) => {
    setDreamText(item.dreamText);
    setAnalysis(item.analysis);
    
    // Scroll smoothly to results
    setTimeout(() => {
      const resultsEl = document.getElementById("revelation-view");
      resultsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("dream_interpretation_history", JSON.stringify(updated));
    
    // If the active dream is the one deleted, clear view
    if (analysis && !updated.some(item => item.dreamText === dreamText)) {
      setAnalysis(null);
      setDreamText("");
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o seu Diário Celestial de Sonhos?")) {
      setHistory([]);
      localStorage.removeItem("dream_interpretation_history");
      setAnalysis(null);
      setDreamText("");
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-prime flex flex-col relative transition-colors duration-300">
      
      {/* Decorative celestial background glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] celestial-glow pointer-events-none z-0"></div>

      {/* Main Header / Brand */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-8 pb-4">
        <div className="flex items-center justify-between border-b border-border-custom pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/5 dark:bg-indigo-400/5 flex items-center justify-center border border-indigo-150/30">
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-text-prime font-serif">
                Portal do Sonhos
              </h1>
              <p className="text-[10px] text-text-mute font-mono tracking-wider uppercase">
                Sabedoria Mística & Numerologia Popular Brasileira
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Switch Options */}
            <div className="bg-sec-bg border border-border-custom p-1 rounded-xl flex items-center gap-1 shadow-sm transition-colors duration-300">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  !isDarkMode
                    ? "bg-card-bg text-indigo-700 dark:text-indigo-400 shadow-sm border border-border-custom"
                    : "text-text-second hover:text-text-prime"
                }`}
                title="Ativar Modo Claro"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Claro</span>
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isDarkMode
                    ? "bg-card-bg text-indigo-400 shadow-sm border border-border-custom"
                    : "text-text-second hover:text-text-prime"
                }`}
                title="Ativar Modo Escuro"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Noturno</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-mono text-text-mute uppercase tracking-widest">
                Conexão Astral Fluida
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: input form and historical diário */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Welcome Card banner */}
          <div className="bg-gradient-to-r from-sec-bg to-card-bg rounded-2xl border border-border-custom p-6 space-y-2 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
              <Scroll className="w-32 h-32 text-text-prime" />
            </div>
            <div className="relative z-10 space-y-1.5">
              <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400 tracking-wider uppercase flex items-center gap-1">
                <Feather className="w-3 h-3" />
                Decifre o Invisível
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-semibold text-text-prime tracking-tight">
                O que o seu subconsciente está tentando lhe dizer?
              </h2>
              <p className="text-text-second text-xs md:text-sm leading-relaxed max-w-md">
                Digite uma palavra-chave (ex: "moedas", "dente", "cobra") ou relate em riqueza de detalhes o seu sonho. Nosso mecanismo místico avaliará o simbolismo e revelará palpites astrológicos calculados para Jogo do Bicho, Mega-Sena e Lotofácil.
              </p>
            </div>
          </div>

          {/* Form trigger layout */}
          <DreamInput onSubmit={handleDreamSubmit} isLoading={isLoading} />

          {/* Lore informational widget */}
          <DreamLore />
        </div>

        {/* Right column: results matching & history list */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Error notification pane */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-bold">Portal Temporariamente Nublado</h4>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Active Revelation Result Display */}
          <span id="revelation-view" className="scroll-mt-6 block"></span>
          {isLoading && (
            <div className="bg-card-bg rounded-2xl border border-border-custom p-8 text-center space-y-5 shadow-sm py-16 transition-colors duration-300">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-text-prime font-serif font-bold text-lg">Alinhando Vetores Celestiais</h4>
                <p className="text-xs text-text-mute max-w-xs mx-auto">
                  Consultando as dezenas de Cabala, somando as vibrações das letras e determinando as correspondências animais do seu sonho...
                </p>
              </div>
            </div>
          )}

          {/* Active Result (if available) */}
          {!isLoading && analysis && (
            <InterpretationResult analysis={analysis} dreamText={dreamText} />
          )}

          {/* History tracker widget */}
          <DreamHistory 
            history={history} 
            onSelect={handleSelectHistory} 
            onDelete={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />

          {/* Mini astrology quote card placeholder of elegance */}
          <div className="bg-sec-bg rounded-2xl border border-border-custom p-6 text-center space-y-2 transition-colors duration-300">
            <Sun className="w-5 h-5 text-text-mute mx-auto animate-spin" style={{ animationDuration: "12s" }} />
            <p className="text-[11px] font-serif text-text-second italic max-w-xs mx-auto">
              "Sonhar é o despertar da alma. Na numerologia brasileira, cada pedaço de lembrança carrega uma energia matemática destinada a guiar os passos no tabuleiro da vida."
            </p>
            <div className="text-[8px] font-mono text-text-mute uppercase tracking-widest">
              — Provérbio Popular Místico
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright informational branding */}
      <footer className="border-t border-border-custom bg-card-bg py-8 mt-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <div className="flex justify-center items-center gap-1.5 text-text-mute text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Portal do Sonhos © 2026. Criado e desenvolvido por Marlon Forti.</span>
          </div>
          <p className="text-[10px] text-text-mute max-w-lg mx-auto leading-relaxed">
            Este portal de entretenimento une o fascinante universo da psicologia onírica, folclore místico brasileiro e estatística recreativa. Lembre-se de jogar com consciência e diversão.
          </p>
        </div>
      </footer>
    </div>
  );
}
