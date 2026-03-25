const fs = require('fs');
let c = fs.readFileSync('./src/app/page.tsx', 'utf8');

const oldBtn = `                          <button onClick={() => setActiveTab('contato')} className="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                            Saiba mais <ArrowRight size={18} />
                          </button>`;

const newBtn = `                          <button onClick={() => setModalContent({ title: item.title, text: item.full })} className="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                            Saiba mais <ArrowRight size={18} />
                          </button>`;

if (!c.includes(oldBtn)) { console.log('ERRO: botão não encontrado'); process.exit(1); }
c = c.replace(oldBtn, newBtn);
fs.writeFileSync('./src/app/page.tsx', c);
console.log('Passo 3 OK');
