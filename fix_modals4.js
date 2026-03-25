const fs = require('fs');
let c = fs.readFileSync('./src/app/page.tsx', 'utf8');

const oldEnd = `      {/* <FloatingChat /> */}
      <BackToTop />`;

const newEnd = `      {modalContent && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalContent(null)}>
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-headline font-bold text-primary">{modalContent.title}</h3>
              <button onClick={() => setModalContent(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6 space-y-3">
              {modalContent.text.split('\\n').map((line, i) => (
                <p key={i} className={line === '' ? 'h-2' : 'text-foreground leading-relaxed'}>{line}</p>
              ))}
            </div>
            <div className="px-8 py-6 border-t border-border">
              <button onClick={() => { setModalContent(null); setActiveTab('contato'); }} className="w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold hover:bg-primary/90 transition-colors">
                Contato | Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <FloatingChat /> */}
      <BackToTop />`;

if (!c.includes(oldEnd)) { console.log('ERRO: trecho não encontrado'); process.exit(1); }
c = c.replace(oldEnd, newEnd);
fs.writeFileSync('./src/app/page.tsx', c);
console.log('Passo 4 OK');
