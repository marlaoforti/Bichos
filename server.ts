import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for dream interpretation and lucky numbers
  app.post("/api/interpretar", async (req, res) => {
    try {
      const { dreamText } = req.body;

      if (!dreamText || typeof dreamText !== "string" || dreamText.trim().length === 0) {
        return res.status(400).json({ error: "Por favor, descreva ou digite uma palavra-chave para o seu sonho." });
      }

      const currentApiKey = process.env.GEMINI_API_KEY;
      if (!currentApiKey) {
        return res.status(500).json({
          error: "A Chave de API do Gemini (GEMINI_API_KEY) não está configurada neste servidor. Por favor, adicione-a no painel 'Secrets' do AI Studio."
        });
      }

      // Initialize Gemini AI lazily inside request handler to pick up latest API key updates
      const ai = new GoogleGenAI({
        apiKey: currentApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const promptText = `
Você é o mais renomado místico, numerólogo e intérprete de sonhos da cultura popular brasileira. 
O usuário enviou o seguinte relato ou palavra-chave de sonho:
"${dreamText.trim()}"

Por favor, faça uma interpretação emocionante, profunda e acolhedora (combinando perspectivas místicas e psicológicas) sobre os símbolos deste sonho.
A interpretação deve conter de 2 a 4 parágrafos pequenos, amigáveis, repletos de sabedoria e leveza.

DETERMINE também os números da sorte do usuário para três jogos tradicionais:

1. Jogo do Bicho:
Escolha o animal que mais se conecta simbolicamente aos elementos do sonho. Você DEVE usar estritamente a tabela oficial e mapear CORRETAMENTE o animal com uma de suas dezenas oficiais:
- Avestruz (G-1): 01, 02, 03, 04
- Águia (G-2): 05, 06, 07, 08
- Burro (G-3): 09, 10, 11, 12
- Borboleta (G-4): 13, 14, 15, 16
- Cachorro (G-5): 17, 18, 19, 20
- Cabra (G-6): 21, 22, 23, 24
- Carneiro (G-7): 25, 26, 27, 28
- Camelo (G-8): 29, 30, 31, 32
- Cobra (G-9): 33, 34, 35, 36
- Coelho (G-10): 37, 38, 39, 40
- Cavalo (G-11): 41, 42, 43, 44
- Elefante (G-12): 45, 46, 47, 48
- Galo (G-13): 49, 50, 51, 52
- Gato (G-14): 53, 54, 55, 56
- Jacaré (G-15): 57, 58, 59, 60
- Leão (G-16): 61, 62, 63, 64
- Macaco (G-17): 65, 66, 67, 68
- Porco (G-18): 69, 70, 71, 72
- Pavão (G-19): 73, 74, 75, 76
- Peru (G-20): 77, 78, 79, 80
- Touro (G-21): 81, 82, 83, 84
- Tigre (G-22): 85, 86, 87, 88
- Urso (G-23): 89, 90, 91, 92
- Veado (G-24): 93, 94, 95, 96
- Vaca (G-25): 97, 98, 99, 00

Por exemplo, se o bicho escolhido for "Cachorro", a dezena fornecida DEVE ser uma destas: "17", "18", "19" ou "20". Certifique-se de que a dezena é retornada como string de exatamente 2 caracteres (e.g., "05", "42" ou "00").

2. Mega-Sena:
Gere exatamente 6 números da sorte diferentes entre 01 e 60. Eles devem ser únicos e ordenados de forma crescente.

3. Lotofácil:
Gere exatamente 15 números da sorte diferentes entre 01 e 25. Eles devem ser únicos e ordenados de forma crescente.

Gere uma combinação de números dinâmica, influenciada misticamente pelas palavras, comprimento e energia do texto do sonho. Garanta que consultas diferentes tragam combinações novas e interessantes.
`;

      let parsedData: any = null;

      // Robust fallback list of models to try in case of 503 Service Unavailable or high demand spikes
      const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
      const maxRetriesPerModel = 2; // total 3 attempts per model
      let lastApiError: any = null;

      console.log(`[Sonhos Backend] Iniciando interpretação para: "${dreamText.substring(0, 40)}..."`);

      for (const modelName of modelsToTry) {
        let attempt = 0;
        while (attempt <= maxRetriesPerModel) {
          try {
            console.log(`[Sonhos Backend] Tentando modelo ${modelName} (tentativa ${attempt + 1}/${maxRetriesPerModel + 1})...`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: promptText,
              config: {
                systemInstruction: "Você é um místico experiente especialista na interpretação de sonhos e na numerologia popular do folclore brasileiro.",
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    interpretacao: {
                      type: Type.STRING,
                      description: "Interpretação detalhada do sonho, em português, de forma amigável, acolhedora e inspiradora.",
                    },
                    bicho: {
                      type: Type.STRING,
                      description: "O nome em português do animal do Jogo do Bicho que se relaciona com o sonho (ex: 'Jacaré', 'Borboleta', 'Vaca').",
                    },
                    dezena: {
                      type: Type.STRING,
                      description: "Uma dezena correta pertencente ao grupo desse animal (string com dois dígitos, ex: '58', '03', '00').",
                    },
                    mega_sena: {
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER },
                      description: "Uma lista contendo exatamente 6 números inteiros diferentes e ordenados para a Mega-Sena (entre 01 e 60).",
                    },
                    lotofacil: {
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER },
                      description: "Uma lista contendo exatamente 15 números inteiros diferentes e ordenados para a Lotofácil (entre 01 e 25).",
                    },
                  },
                  required: ["interpretacao", "bicho", "dezena", "mega_sena", "lotofacil"]
                }
              }
            });

            const textResult = response.text;
            if (textResult && textResult.trim()) {
              parsedData = JSON.parse(textResult.trim());
              console.log(`[Sonhos Backend] Sucesso! Modelo ${modelName} respondeu corretamente.`);
              break; // break the attempt loop
            }
            throw new Error(`Resposta vazia do modelo ${modelName}`);
          } catch (err: any) {
            lastApiError = err;
            console.warn(`[Sonhos Backend] Erro no modelo ${modelName} (tentativa ${attempt + 1}):`, err.message || err);
            attempt++;
            if (attempt <= maxRetriesPerModel) {
              // Wait backoff
              await new Promise(resolve => setTimeout(resolve, 800));
            }
          }
        }
        if (parsedData) {
          break; // break the models loop
        }
      }

      // If all API calls failed due to 503 high demand or other issues, run our robust, deterministic local fallback generator!
      if (!parsedData) {
        console.warn("[Sonhos Backend] Todas as tentativas de API com Gemini falharam ou estão sob alta demanda. Ativando Gerador Místico local e determinístico para garantir robustez de 100%!");
        parsedData = localFallbackDreamInterpretation(dreamText);
      }

      // Simple validations to guarantee response robustness
      if (!parsedData.interpretacao) {
        parsedData.interpretacao = "O seu sonho carrega mistérios sutis do subconsciente que sugerem renovação e intuição.";
      }
      if (!parsedData.bicho) {
        parsedData.bicho = "Borboleta";
        parsedData.dezena = "13";
      }
      if (!Array.isArray(parsedData.mega_sena) || parsedData.mega_sena.length !== 6) {
        parsedData.mega_sena = [4, 15, 23, 38, 42, 59];
      }
      if (!Array.isArray(parsedData.lotofacil) || parsedData.lotofacil.length !== 15) {
        parsedData.lotofacil = [1, 2, 4, 5, 8, 9, 11, 13, 15, 16, 18, 20, 22, 24, 25];
      }

      return res.json(parsedData);
    } catch (error: any) {
      console.error("Erro na interpretação de sonhos:", error);
      return res.status(500).json({
        error: "Ocorreu um erro ao processar a interpretação mística do seu sonho no servidor.",
        details: error.message || error
      });
    }
  });

  // Serve static files & fallback to SPA React app
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
    console.log(`[Sonhos Backend] Servidor rodando na porta ${PORT}`);
  });
}

startServer();

function localFallbackDreamInterpretation(dreamText: string) {
  const normalized = dreamText.toLowerCase().trim();
  
  // Predictable seed based on string checksum
  let checksum = 0;
  for (let i = 0; i < normalized.length; i++) {
    checksum += normalized.charCodeAt(i) * (i + 1);
  }

  // Pre-determined responses based on category matching
  let interpretacao = "";
  let bichoCandidate = "";
  let dezenaCandidate = "";

  const bichoGroups = [
    { name: "Avestruz", num: 1, range: ["01", "02", "03", "04"] },
    { name: "Águia", num: 2, range: ["05", "06", "07", "08"] },
    { name: "Burro", num: 3, range: ["09", "10", "11", "12"] },
    { name: "Borboleta", num: 4, range: ["13", "14", "15", "16"] },
    { name: "Cachorro", num: 5, range: ["17", "18", "19", "20"] },
    { name: "Cabra", num: 6, range: ["21", "22", "23", "24"] },
    { name: "Carneiro", num: 7, range: ["25", "26", "27", "28"] },
    { name: "Camelo", num: 8, range: ["29", "30", "31", "32"] },
    { name: "Cobra", num: 9, range: ["33", "34", "35", "36"] },
    { name: "Coelho", num: 10, range: ["37", "38", "39", "40"] },
    { name: "Cavalo", num: 11, range: ["41", "42", "43", "44"] },
    { name: "Elefante", num: 12, range: ["45", "46", "47", "48"] },
    { name: "Galo", num: 13, range: ["49", "50", "51", "52"] },
    { name: "Gato", num: 14, range: ["53", "54", "55", "56"] },
    { name: "Jacaré", num: 15, range: ["57", "58", "59", "60"] },
    { name: "Leão", num: 16, range: ["61", "62", "63", "64"] },
    { name: "Macaco", num: 17, range: ["65", "66", "67", "68"] },
    { name: "Porco", num: 18, range: ["69", "70", "71", "72"] },
    { name: "Pavão", num: 19, range: ["73", "74", "75", "76"] },
    { name: "Peru", num: 20, range: ["77", "78", "79", "80"] },
    { name: "Touro", num: 21, range: ["81", "82", "83", "84"] },
    { name: "Tigre", num: 22, range: ["85", "86", "87", "88"] },
    { name: "Urso", num: 23, range: ["89", "90", "91", "92"] },
    { name: "Veado", num: 24, range: ["93", "94", "95", "96"] },
    { name: "Vaca", num: 25, range: ["97", "98", "99", "00"] }
  ];

  // Pick animal based on content match or checksum
  if (normalized.includes("cobra") || normalized.includes("serpente")) {
    const bg = bichoGroups[8]; // Cobra
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "O seu sonho com cobra evoca profundas transformações e intuições aguçadas. No plano místico, a serpente troca sua pele velha para dar boas-vindas a um renascimento espiritual sútil e de grande magnetismo pessoal.\n\nNo campo da sorte, suas vibrações indicam astúcia, agilidade de ação e um sexto sentido favorável para desviar de ciladas e encontrar caminhos alternativos prósperos nos próximos dias.";
  } else if (normalized.includes("peixe") || normalized.includes("água") || normalized.includes("mar") || normalized.includes("rio") || normalized.includes("lago")) {
    const bg = bichoGroups[14]; // Jacaré
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "Sonhar com elementos aquáticos remete diretamente às suas profundezas emocionais e segredos guardados. Se as águas eram místicas ou limpas, indica serenidade e purificação; se estavam turvas, prenuncia a superação pacífica de obstáculos.\n\nA emanação de sorte flui vigorosa pelas correntes, despertando a adaptabilidade e o magnetismo do Jacaré, indicando foco pleno e determinação em suas escolhas diárias.";
  } else if (normalized.includes("dente") || normalized.includes("cair") || normalized.includes("morte") || normalized.includes("morrer")) {
    const bg = bichoGroups[3]; // Borboleta
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "Sua visão onírica de desprendimento ou queda prenuncia uma metamorfose inescapável da alma. O dente que se vai ou a sensação de perda representam, no folclore popular, o encerramento necessário de velhos ciclos estagnados.\n\nComo a Borboleta que deixa o casulo, uma nova fase, leve, graciosa e abençoada com sorte genuína, está se estruturando para cercar sua rotina de novidades felizes.";
  } else if (normalized.includes("ouro") || normalized.includes("dinheiro") || normalized.includes("moeda") || normalized.includes("riqueza")) {
    const bg = bichoGroups[20]; // Touro
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "Você sintonizou com um farto magnetismo de abundância e estabilidade terrena. Este sonho indica merecimento de crescimento material tangível, mas também nos lembra que o maior patrimônio é a firmeza do caráter e das intenções.\n\nA força inabalável do Touro sustenta essa farta energia duradoura, sinalizando números repletos de robustez, solidez financeira e conquistas seguras.";
  } else if (normalized.includes("voar") || normalized.includes("pássaro") || normalized.includes("céu") || normalized.includes("vento")) {
    const bg = bichoGroups[1]; // Águia
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "Sua alma alçou voo livre e desimpedido sobre as amarras do cotidiano terreno. Sonhar que voa indica clareza mental superior, a ânsia lúcida pela expansão de horizontes e a certeza absoluta de sua liberdade individual.\n\nCom a visão estendida da Águia, você enxergará as oportunidades de êxito e ganhos que antes passavam despercebidos. Deixe-se guiar pela sua intuição afiada nos próximos dias.";
  } else {
    // General beautiful cosmic response based on checksum index
    const bg = bichoGroups[checksum % 25];
    bichoCandidate = bg.name;
    dezenaCandidate = bg.range[checksum % 4];
    interpretacao = "Os astros e os fluxos de energia cósmica apontam que seu sonho é uma manifestação direta de sua mentoria espiritual interna. Este relato expressa um desejo legítimo de segurança, bem-estar e equilíbrio no plano terreno.\n\nSua mente está em perfeita sintonia com a evolução sutil. Concentre seus pensamentos nas dezenas sugeridas e caminhe com integridade, sabedoria e plena confiança rumo às suas metas diárias.";
  }

  // Generate 6 unique random numbers between 1 and 60 based on seed
  const mega_sena_set = new Set<number>();
  let count = 0;
  while (mega_sena_set.size < 6) {
    const val = ((checksum + count * 17) % 60) + 1;
    mega_sena_set.add(val);
    count++;
  }
  const mega_sena = Array.from(mega_sena_set).sort((a, b) => a - b);

  // Generate 15 unique random numbers between 1 and 25 based on seed
  const lotofacil_set = new Set<number>();
  count = 0;
  while (lotofacil_set.size < 15) {
    const val = ((checksum + count * 13) % 25) + 1;
    lotofacil_set.add(val);
    count++;
  }
  const lotofacil = Array.from(lotofacil_set).sort((a, b) => a - b);

  return {
    interpretacao,
    bicho: bichoCandidate,
    dezena: dezenaCandidate,
    mega_sena,
    lotofacil
  };
}
