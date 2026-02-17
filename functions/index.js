const { onRequest } = require("firebase-functions/v2/https");
const next = require("next");

const nextjsDistDir = "../.next";

const nextjsApp = next({
    dev: false,
    conf: {
        distDir: nextjsDistDir,
    },
});

const nextjsHandle = nextjsApp.getRequestHandler();

exports.nextServer = onRequest(
    {
        region: "southamerica-east1",
        memory: "512MiB",
        timeoutSeconds: 60,
    },
    async (req, res) => {
        await nextjsApp.prepare();
        return nextjsHandle(req, res);
    }
);
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { Resend } = require("resend");

// Configurar o Resend (A chave deve ser passada como variável de ambiente no Firebase ou fixada para teste)
// RECOMENDADO: firebase functions:secrets:set RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || 're_3g9XKbQf_GAw2HHi3cvT5eiWmtmpfTWXJ');

exports.onUserCreated = onDocumentCreated("users/{userId}", async (event) => {
    const newUser = event.data.data();

    // Só notificar se for um CLIENTE novo
    if (newUser.role !== 'client') return;

    try {
        await resend.emails.send({
            from: 'LuTF Notificações <onboarding@resend.dev>',
            to: ['escalarminhasvendas@gmail.com'], // E-mail para teste (Seu e-mail)
            subject: '🌳 Novo Cadastro de Paciente Pendente',
            html: `
                <h1>Olá Luciana!</h1>
                <p>Um novo paciente acabou de se cadastrar no site e está aguardando sua aprovação:</p>
                <ul>
                    <li><strong>Nome:</strong> ${newUser.name}</li>
                    <li><strong>E-mail:</strong> ${newUser.email}</li>
                    <li><strong>Telefone:</strong> ${newUser.phone}</li>
                </ul>
                <p>Acesse o painel administrativo para aprovar ou negar o acesso.</p>
                <a href="https://lucianatf.web.app/admin/clientes" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Ir para Gestão de Clientes</a>
            `
        });
        console.log(`Notificação de novo paciente (${newUser.name}) enviada com sucesso para: escalarminhasvendas@gmail.com`);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
});
