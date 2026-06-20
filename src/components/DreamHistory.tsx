import React, { useState } from "react";
import { DreamHistoryItem } from "../types";
import { BookOpen, Search, Calendar, Heart, Trash2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface DreamHistoryProps {
  history: DreamHistoryItem[];
  onSelect: (item: DreamHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function DreamHistory({ history, onSelect, onDelete, onClearAll }: DreamHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(item => 
    item.dreamText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.analysis.bicho.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.analysis.interpretacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card-bg rounded-2xl border border-border-custom p-6 shadow-sm transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-custom">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold tracking-tight text-text-prime font-serif">
            Diário Celestial de Sonhos
          </h3>
          <span className="bg-sec-bg text-text-second font-mono text-xs font-semibold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            type="button"
            className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition py-1 px-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Diário
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-text-second space-y-2">
          <BookOpen className="w-8 h-8 text-text-mute mx-auto" />
          <p className="text-sm">Seu diário astral está vazio.</p>
          <p className="text-[11px] max-w-xs mx-auto text-text-mute">Interprete seu primeiro sonho acima e ele ficará salvo aqui localmente para futuras consultas de sorte!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar termo no diário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-sec-bg border border-border-custom rounded-xl text-text-prime focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {filteredHistory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="group border border-border-custom/50 hover:border-indigo-500/50 bg-sec-bg/20 hover:bg-indigo-500/5 rounded-xl p-3 flex items-start justify-between gap-3 transition cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-text-mute" />
                    <span className="text-[10px] text-text-mute font-mono">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")} às {new Date(item.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[10px] bg-amber-500/15 text-amber-950 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded ml-auto sm:ml-0">
                      {item.analysis.bicho}
                    </span>
                  </div>

                  <p className="text-xs text-text-prime font-medium line-clamp-1">
                    {item.dreamText}
                  </p>
                  
                  <p className="text-[11px] text-text-second line-clamp-2 italic font-serif">
                    {item.analysis.interpretacao}
                  </p>

                  <div className="flex gap-2.5 pt-1.5 text-[10px] font-mono font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">Mega: {item.analysis.mega_sena.map(n => n.toString().padStart(2, "0")).join(", ")}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between h-full gap-4 opacity-50 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 text-text-mute hover:text-red-500 rounded transition"
                    title="Excluir do diário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-text-mute group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-6 text-text-mute text-xs">
                Nenhum sonho corresponde à sua busca.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
