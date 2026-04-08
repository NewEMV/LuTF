import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const body = await request.text();
        const { name, email, phone, subject } = JSON.parse(body);

        await resend.emails.send({
            from: 'Contato Site <contato@lucianatelles-psi.com.br>',
            to: 'luciana.tfsuporte@gmail.com',
            subject: 'Novo Contato pelo Site',
            html: `
                <h2>Novo Contato recebido pelo site</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Whatsapp:</strong> ${phone}</p>
                <p><strong>Motivo da conversa:</strong> ${subject}</p>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar email de contato:', error);
        return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
    }
}
