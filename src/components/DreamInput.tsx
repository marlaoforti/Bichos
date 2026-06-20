import React, { useState } from "react";
import { Sparkles, Compass, Lightbulb, Dice5 } from "lucide-react";

interface DreamInputProps {
  onSubmit: (dreamText: string) => void;
  isLoading: boolean;
}

const SEED_PRESETS = [
  { label: "🐍 Sonhar com Cobra", text: "Sonhei que uma cobra preta e dourada subia em uma árvore de frutos maduros e olhava para mim com calma, sem atacar." },
  { label: "💧 Água Cristalina", text: "Estava flutuando em um lago enorme e cristalino de águas mornas, e no fundo dava para ver pedras azuis e peixes amarelos nadando." },
  { label: "🦷 Dente caindo", text: "Sonhei que estava conversando com um amigo querido e de repente meu dente da frente caía inteiro na minha mão, sem que dolesse." },
  { label: "🪙 Chuva de Moedas", text: "Sonhei que andava na rua da minha infância e começavam a cair moedas brilhantes de ouro e prata do céu. Eu enchia meus bolsos rindo." },
  { label: "🎈 Voando livre", text: "Eu conseguia dar saltos gigantescos e flutuar acima dos prédios e das nuvens, sentindo uma sensação indescritível de vento e liberdade no rosto." },
  { label: "🍀 Casamento Alegre", text: "Estava em uma festa de casamento rústica no campo, todos dançavam descalços na grama sob luzes brilhantes e havia muita fartura." }
];

export default function DreamInput({ onSubmit, isLoading }: DreamInputProps) {
  const [text, setText] = useState("");

  const handlePresetClick = (presetText: string) => {
    setText(presetText);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * SEED_PRESETS.length);
    setText(SEED_PRESETS[randomIndex].text);
  };

  return (
    <div className="bg-card-bg rounded-2xl border border-border-custom p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <h3 className="text-lg font-bold tracking-tight text-text-prime font-serif">
            Descreva seu Sonho ou Símbolo
          </h3>
        </div>
        <button
          onClick={handleRandomize}
          disabled={isLoading}
          type="button"
          className="text-xs flex items-center gap-1 text-text-second hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition py-1 px-2.5 rounded-lg border border-border-custom hover:border-indigo-150 disabled:opacity-50"
          title="Preencher com um sonho vindo do cosmos"
        >
          <Dice5 className="w-3.5 h-3.5" />
          Inspirar Sonho Aleatório
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Exemplo: Fale sobre o bicho, a cobra, água limpa, o dente caindo ou relate o sonho completo de forma livre..."
            rows={4}
            maxLength={1000}
            className="w-full text-text-prime bg-sec-bg/50 focus:bg-card-bg border border-border-custom focus:border-indigo-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-75 resize-none placeholder:text-text-mute"
          />
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-text-mute">
            {text.length}/1000 caracteres
          </div>
        </div>

        {/* Example triggers seeds */}
        <div className="space-y-2">
          <p className="text-xs text-text-second font-medium flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
            Ideias de temas populares ou escolha um exemplo abaixo:
          </p>
          <div className="flex flex-wrap gap-2">
            {SEED_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset.text)}
                disabled={isLoading}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition font-medium ${
                  text === preset.text
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200"
                    : "bg-card-bg text-text-second border-border-custom hover:bg-sec-bg hover:text-text-prime"
                } disabled:opacity-50`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm md:text-base py-3 px-6 rounded-xl transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Decifrando Mistérios do Subconsciente...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Interpretar Sonho & Revelar Números</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
