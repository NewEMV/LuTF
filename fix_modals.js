const fs = require('fs');
let c = fs.readFileSync('./src/app/page.tsx', 'utf8');

c = c.replace(
  "  const [futureEvents, setFutureEvents] = useState<any[]>([]);",
  `  const [futureEvents, setFutureEvents] = useState<any[]>([]);
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);`
);

fs.writeFileSync('./src/app/page.tsx', c);
console.log('Passo 1 OK');
