const fs = require('fs');
let c = fs.readFileSync('./src/app/page.tsx', 'utf8');

const oldThemes = `                  {[
                    { title: "Psico-Oncologia", icon: "speech", color: "bg-purple-500", desc: "Acolhimento e intervenção a pessoas com câncer e familiares desde o diagnóstico, no tratamento, reabilitação e luto." },
                    { title: "Cuidados Paliativos", icon: "butterfly", color: "bg-purple-400", desc: "Qualidade de vida e manejo emocional de doenças graves." },
                    { title: "Clínica do Luto", icon: "handheart", color: "bg-purple-600", desc: "Acolhimento aos processos de perdas. Suporte a dor da ausência." }
                  ].map((item, idx) => (`;

if (!c.includes(oldThemes)) {
  console.log('ERRO: trecho não encontrado');
  process.exit(1);
}

const newThemes = `                  {[
                    {
                      title: "Psico-Oncologia",
                      icon: "speech",
                      color: "bg-purple-500",
                      desc: "Acolhimento e intervenção a pessoas com câncer e familiares desde o diagnóstico, no tratamento, reabilitação e luto.",
                      full: "A Psico-oncologia é o cuidado que olha para além do diagnóstico.\\nÉ a escuta que acolhe o medo após a notícia difícil.\\nÉ o espaço onde a dor pode ser nomeada.\\nÉ o apoio nas decisões complexas, nas mudanças do corpo, nas incertezas do tratamento.\\n\\nA Psico-oncologia cuida do paciente, da família e também da equipe de saúde, integrando o olhar técnico à dimensão humana do adoecer.\\n\\nDo diagnóstico aos cuidados paliativos, da esperança à elaboração do luto, seu papel é sustentar sentido, dignidade e qualidade de vida — mesmo em meio à vulnerabilidade.\\n\\nPorque onde há vida, há subjetividade.\\nE onde há subjetividade, há cuidado possível."
                    },
                    {
                      title: "Cuidados Paliativos",
                      icon: "butterfly",
                      color: "bg-purple-400",
                      desc: "Qualidade de vida e manejo emocional de doenças graves.",
                      full: "Ainda os cuidados paliativos vem acompanhado da frase não há mais nada a fazer. E com isso a sensação de abandono e a proximidade da morte.\\n\\nAqui eu apresento que cuidados paliativos é sobre Há o que fazer e desde o diagnóstico de uma doença grave.\\n\\nÉ oferecer, junto a sua equipe médica, uma jornada de cuidado mais próximo do que é importante para você, respeitando sua dignidade.\\n\\nDoenças graves atravessam o corpo — mas também atravessam a identidade, os vínculos, os projetos e o sentido da existência.\\n\\nOs cuidados paliativos atuam justamente nesse território sensível:\\n✔️ Acolhendo o sofrimento emocional\\n✔️ Favorecendo comunicação clara e ética\\n✔️ Sustentando decisões difíceis\\n✔️ Cuidando da família e da rede de apoio\\n✔️ Promovendo qualidade de vida e alívio possível do sofrimento\\n\\nO manejo emocional não é um detalhe do tratamento — ele é parte essencial do cuidado. Há sempre alguém ali, com história, valores, medos e desejos. Cuidar é também sustentar o que é humano quando a vida se torna frágil."
                    },
                    {
                      title: "Clínica do Luto",
                      icon: "handheart",
                      color: "bg-purple-600",
                      desc: "Acolhimento aos processos de perdas. Suporte a dor da ausência.",
                      full: "O luto é um processo natural diante de uma perda significativa. Cada pessoa vivencia a perda de maneira singular, conforme sua história, vínculo estabelecido e contexto da morte.\\n\\nA Clínica do Luto oferece atendimento psicológico fundamentado em referenciais técnicos sobre processos de perda, luto antecipatório e luto complicado/prolongado.\\n\\nO acompanhamento é indicado para pessoas que apresentam:\\n• Sofrimento intenso e persistente após uma perda\\n• Dificuldade de retomar atividades e vínculos\\n• Sentimentos recorrentes de culpa, ambivalência ou revolta\\n• Impacto significativo no sono, apetite e funcionamento diário\\n• Lutos traumáticos ou inesperados\\n• Perdas gestacionais e neonatais\\n• Vivência de luto antecipatório diante de doenças graves\\n\\nO objetivo do atendimento é:\\n✔️ Favorecer a elaboração psíquica da perda\\n✔️ Auxiliar na integração da ausência à história de vida\\n✔️ Prevenir complicações emocionais associadas ao luto\\n✔️ Promover reorganização interna e adaptação à nova realidade\\n✔️ Ressignificar a história preservando o vínculo\\n\\nVocê não precisa atravessar o luto sozinho(a)."
                    },
                  ].map((item, idx) => (`;

c = c.replace(oldThemes, newThemes);
fs.writeFileSync('./src/app/page.tsx', c);
console.log('Passo 2 OK');
