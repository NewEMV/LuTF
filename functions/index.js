const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const next = require("next");
const { Resend } = require("resend");

const nextjsDistDir = "./.next";

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

exports.notifyNewUser = onDocumentCreated(
    {
        document: "users/{userId}",
        region: "southamerica-east1",
    },
    async (event) => {
        const data = event.data.data();
        if (data.role !== "client") return;

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "Contato <contato@lucianatelles-psi.com.br>",
            to: "luciana.tfsuporte@gmail.com",
            subject: "Nova solicitação de acesso",
            html: `
                <h2>Nova solicitação de acesso</h2>
                <p><strong>Nome:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefone:</strong> ${data.phone || "Não informado"}</p>
                <br/>
                <a href="https://lucianatelles-psi.com.br/admin/clientes"
                   style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
                    Aprovar no painel
                </a>
            `,
        });
    }
);

exports.notifyApprovedUser = onDocumentUpdated(
    {
        document: "users/{userId}",
        region: "southamerica-east1",
    },
    async (event) => {
        const before = event.data.before.data();
        const after = event.data.after.data();

        if (before.status === after.status) return;
        if (after.status !== "approved") return;

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "Contato <contato@lucianatelles-psi.com.br>",
            to: after.email,
            subject: "Seu acesso foi aprovado",
            html: `
                <h2>Olá, ${after.name}!</h2>
                <p>Sua solicitação de acesso foi aprovada.</p>
                <p>Você já pode fazer login e agendar sua consulta.</p>
                <br/>
                <a href="https://lucianatelles-psi.com.br/login"
                   style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
                    Fazer login
                </a>
            `,
        });
    }
);