const fs = require('fs');
let c = fs.readFileSync('./src/app/page.tsx', 'utf8');

const oldExp = `                  <div className="p-8 bg-secondary border-l-8 border-primary rounded-3xl hover-lift">
                    <h3 className="text-2xl font-bold text-muted-foreground mb-4">Experiência</h3>
                    <p className="mb-4"><strong>Psicóloga Clínica na Abrale:</strong> Foco em onco-hematologia.</p>
                    <p className="mb-4"><strong>Instituto de Imunologia e Oncologia:</strong> Psico-oncologista.</p>
                    <p><strong>Rede Nacional de Tanatologia:</strong> Docente.</p>
                  </div>`;

const newExp = `                  <div className="p-8 bg-secondary border-l-8 border-primary rounded-3xl hover-lift">
                    <h3 className="text-2xl font-bold text-muted-foreground mb-4">Experiência</h3>
                    <p className="mb-2 font-bold">Psicóloga Clínica:</p>
                    <p className="mb-2"><strong>Abrale:</strong> Foco em onco-hematologia e Cuidados Paliativos</p>
                    <p className="mb-2"><strong>Residencial Sênior Leger:</strong> Foco na saúde do idoso em Instituições.</p>
                    <p className="mb-4"><strong>Consultório Particular:</strong> Cuidado em saúde mental em fases de transição.</p>
                    <p className="mb-2 font-bold">Docente/Tutora/Palestrante:</p>
                    <p>Foco em tutoria e docência em psico-oncologia; mercado de trabalho & adoecimento; luto; comunicação em saúde e inteligência emocional.</p>
                  </div>`;

if (!c.includes(oldExp)) { console.log('ERRO: trecho não encontrado'); process.exit(1); }
c = c.replace(oldExp, newExp);
fs.writeFileSync('./src/app/page.tsx', c);
console.log('OK');
