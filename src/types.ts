export interface DreamAnalysis {
  interpretacao: string;
  bicho: string;
  dezena: string;
  mega_sena: number[];
  lotofacil: number[];
}

export interface DreamHistoryItem {
  id: string;
  dreamText: string;
  analysis: DreamAnalysis;
  createdAt: string;
}
