import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const { name, email } = JSON.parse(body);

        await resend.emails.send({
            from: 'Contato <contato@lucianatelles-psi.com.br>',
            to: email,
            subject: 'Seu acesso foi aprovado',
            html: `
                <h2>Olá, ${name}!</h2>
                <p>Sua solicitação de acesso foi aprovada.</p>
                <p>Você já pode fazer login e agendar sua consulta.</p>
                <br/>
                <a href="https://lucianatelles-psi.com.br/login"
                   style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
                    Fazer login
                </a>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
    }
}