import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, phone } = await request.json();

        await resend.emails.send({
            from: 'Contato <contato@lucianatelles-psi.com.br>',
            to: 'luciana.tfsuporte@gmail.com',
            subject: 'Nova solicitação de acesso',
            html: `
                <h2>Nova solicitação de acesso</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <br/>
                <a href="https://lucianatf-8395f.web.app/admin/clientes" 
                   style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
                    Aprovar no painel
                </a>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
    }
}