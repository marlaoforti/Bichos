import React, { useState } from "react";
import { Info, HelpCircle, Award, Compass, Search } from "lucide-react";

interface BichoGroup {
  grupo: number;
  nome: string;
  dezenas: string[];
}

export default function DreamLore() {
  const [bichoSearch, setBichoSearch] = useState("");

  const bichoGroups: BichoGroup[] = [
    { grupo: 1, nome: "Avestruz", dezenas: ["01", "02", "03", "04"] },
    { grupo: 2, nome: "Águia", dezenas: ["05", "06", "07", "08"] },
    { grupo: 3, nome: "Burro", dezenas: ["09", "10", "11", "12"] },
    { grupo: 4, nome: "Borboleta", dezenas: ["13", "14", "15", "16"] },
    { grupo: 5, nome: "Cachorro", dezenas: ["17", "18", "19", "20"] },
    { grupo: 6, nome: "Cabra", dezenas: ["21", "22", "23", "24"] },
    { grupo: 7, nome: "Carneiro", dezenas: ["25", "26", "27", "28"] },
    { grupo: 8, nome: "Camelo", dezenas: ["29", "30", "31", "32"] },
    { grupo: 9, nome: "Cobra", dezenas: ["33", "34", "35", "36"] },
    { grupo: 10, nome: "Coelho", dezenas: ["37", "38", "39", "40"] },
    { grupo: 11, nome: "Cavalo", dezenas: ["41", "42", "43", "44"] },
    { grupo: 12, nome: "Elefante", dezenas: ["45", "46", "47", "48"] },
    { grupo: 13, nome: "Galo", dezenas: ["49", "50", "51", "52"] },
    { grupo: 14, nome: "Gato", dezenas: ["53", "54", "55", "56"] },
    { grupo: 15, nome: "Jacaré", dezenas: ["57", "58", "59", "60"] },
    { grupo: 16, nome: "Leão", dezenas: ["61", "62", "63", "64"] },
    { grupo: 17, nome: "Macaco", dezenas: ["65", "66", "67", "68"] },
    { grupo: 18, nome: "Porco", dezenas: ["69", "70", "71", "72"] },
    { grupo: 19, nome: "Pavão", dezenas: ["73", "74", "75", "76"] },
    { grupo: 20, nome: "Peru", dezenas: ["77", "78", "79", "80"] },
    { grupo: 21, nome: "Touro", dezenas: ["81", "82", "83", "84"] },
    { grupo: 22, nome: "Tigre", dezenas: ["85", "86", "87", "88"] },
    { grupo: 23, nome: "Urso", dezenas: ["89", "90", "91", "92"] },
    { grupo: 24, nome: "Veado", dezenas: ["93", "94", "95", "96"] },
    { grupo: 25, nome: "Vaca", dezenas: ["97", "98", "99", "00"] },
  ];

  const filteredGroups = bichoGroups.filter(b => 
    b.nome.toLowerCase().includes(bichoSearch.toLowerCase()) ||
    b.dezenas.some(d => d.includes(bichoSearch)) ||
    b.grupo.toString() === bichoSearch
  );

  return (
    <div id="dream-lore" className="bg-card-bg rounded-2xl border border-border-custom p-6 md:p-8 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6 md:border-b md:border-border-custom md:pb-4">
        <Compass className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold tracking-tight text-text-prime font-serif">
          Sonhos e Palpites: A Tradição Brasileira
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lore Introduction */}
        <div className="space-y-4 text-text-second leading-relaxed text-sm md:text-base">
          <p>
            No folclore brasileiro, os sonhos sempre foram portais de insights místicos. Desde o fim do século XIX, com o surgimento do <strong>Jogo do Bicho</strong>, as famílias começaram a correlacionar episódios oníricos cotidianos a animais e dezenas numéricas.
          </p>
          <p>
            Esta tradição baseia-se na <strong>lei das correspondências simpáticas</strong>: se você sonha com algo que voa (pássaros, céus, vento), costuma-se buscar animais como a <em>Águia</em> ou a <em>Borboleta</em>. Se sonhar com águas turbulentas, perigo ou traição, a astúcia da <em>Cobra</em> ou o poder do <em>Jacaré</em> são evocados.
          </p>
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100/40 dark:border-indigo-900/30 text-text-second space-y-3">
            <div className="flex items-start gap-2.5">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-xs md:text-sm text-indigo-950 dark:text-indigo-200">Como usar os palpites?</h4>
                <p className="text-xs text-text-second mt-1">
                  Os números místicos revelados pelo oráculo de inteligência artificial são calculados com base no peso vibratório dos elementos do seu relato. Use-os de forma divertida para se inspirar na Mega-Sena, na Lotofácil ou no Jogo do Bicho!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Table Checker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-text-prime text-sm md:text-base font-serif flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600" />
              Tabela Oficial do Jogo do Bicho
            </h3>
            
            {/* Real Search Input in Group */}
            <div className="relative max-w-44">
              <Search className="w-3.5 h-3.5 text-text-mute absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar bicho..." 
                value={bichoSearch}
                onChange={(e) => setBichoSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-2 py-1 bg-sec-bg border border-border-custom rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-text-prime"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 text-xs">
            {filteredGroups.map(bg => (
              <div 
                key={bg.grupo}
                className="bg-sec-bg hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 border border-border-custom rounded-xl p-2.5 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-medium">
                  <span className="text-text-prime">{bg.nome}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">G-{bg.grupo}</span>
                </div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {bg.dezenas.map(d => (
                    <span 
                      key={d} 
                      className="bg-card-bg border border-border-custom rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold text-text-mute"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {filteredGroups.length === 0 && (
              <div className="col-span-full py-6 text-center text-text-mute">
                Nenhum animal ou dezena corresponde à busca.
              </div>
            )}
          </div>
          <div className="text-[11px] text-text-mute font-mono text-center">
            * A tabela é dividida tradicionalmente em 25 grupos de 4 dezenas consecutivas cada.
          </div>
        </div>
      </div>
    </div>
  );
}
