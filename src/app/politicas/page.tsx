'use client';
import Link from 'next/link';
import { LucianaLogo } from '@/components/luciana-logo';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function PoliticasPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <nav className="fixed w-full z-50 bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <LucianaLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-allison pt-1">luciana telles</span>
                    </Link>
                    <Button variant="outline" size="sm" asChild className="rounded-full">
                        <Link href="/">Voltar ao Início</Link>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 px-4 max-w-4xl mx-auto">
                <ScrollReveal direction="up">
                    <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Políticas Literárias e Comerciais</h1>
                    
                    <div className="prose prose-purple dark:prose-invert max-w-none space-y-10 text-muted-foreground">
                        
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. Apresentação</h2>
                            <p>Este site tem como objetivo oferecer conteúdos, cursos, supervisões e materiais relacionados à Psicologia, desenvolvimento humano e áreas correlatas, sob responsabilidade de Luciana Telles, psicóloga.</p>
                            <p>Ao acessar este site e adquirir quaisquer produtos ou serviços, você concorda com os termos descritos neste documento.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Produtos e Serviços</h2>
                            <p>Os serviços oferecidos incluem, mas não se limitam a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cursos online e presenciais</li>
                                <li>Supervisões clínicas</li>
                                <li>Materiais educativos e informativos</li>
                                <li>Eventos, fóruns e workshops</li>
                            </ul>
                            <p className="italic bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                                Todos os conteúdos possuem caráter educativo e não substituem atendimento psicológico e/ou suporte de outros especialistas em saúde.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Cadastro e Responsabilidade do Usuário</h2>
                            <p>Para acesso a determinados conteúdos, o usuário poderá precisar realizar cadastro, sendo responsável por:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Fornecer informações verídicas</li>
                                <li>Manter seus dados atualizados</li>
                                <li>Garantir a confidencialidade de login e senha</li>
                            </ul>
                            <p>O uso indevido da conta é de responsabilidade do próprio usuário.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Pagamentos</h2>
                            <p>Os pagamentos são realizados por meio de plataformas seguras integradas ao site.</p>
                            <p><strong>Formas de pagamento aceitas:</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cartão de crédito</li>
                                <li>Pix</li>
                                <li>Outros meios disponibilizados no momento da compra</li>
                            </ul>
                            <p>A confirmação do acesso ao produto ou serviço ocorrerá após a confirmação do pagamento.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">5. Política de Cancelamento e Reembolso</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-foreground/80">Para cursos online:</h3>
                                <p>Em caso de cancelamento de pedidos, o reembolso do valor do curso, descontada eventuais taxas de serviço, o cliente poderá solicitar reembolso em até 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor, e desde que realize o pedido de devolução com no mínimo 72 horas antes do início do evento. Essa solicitação deve ser feita através do email <span className="text-primary font-bold">contato@lucianatelles-psi.com.br</span></p>
                                <p>Em todos os casos, a restituição do valor será feita em até 30 dias. Indique os dados bancários no corpo do e-mail.</p>
                                <p><strong>Após este prazo:</strong> Não haverá reembolso, considerando o acesso imediato ao conteúdo.</p>
                            </div>
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xl font-bold text-foreground/80">Para supervisões e atendimentos:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Cancelamentos devem ser realizados com no mínimo 24 horas de antecedência.</li>
                                    <li>Em caso de não comparecimento sem aviso prévio, o valor não será reembolsado.</li>
                                    <li>Não há reembolso após a realização da sessão e supervisão.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">6. Política de Troca</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-foreground/80">Para cursos:</h3>
                                <p>A aquisição de ingressos para cursos e eventos seguirão a política específica do prazo de trocas e devoluções de cada curso ou evento. Fique atento a essas informações na página de compra do seu ingresso.</p>
                            </div>
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xl font-bold text-foreground/80">Para produtos (livros e itens físicos):</h3>
                                <p>Caso você deseje trocar um produto, você tem o direito de fazer isso até 30 dias depois do recebimento. Solicite a sua troca pelo e-mail <span className="text-primary font-bold">contato@lucianatelles-psi.com.br</span>. Para que isso aconteça, o item não pode ter sido usado ou, nos caso dos livros, ter sido autografado.</p>
                                <p>Se o produto vendido chegar com algum defeito, por favor, envie fotos do ocorrido para o e-mail oficial. Você tem o direito de realizar essa troca até 30 dias após o recebimento!</p>
                                <p>Trocaremos o item por um semelhante ou você poderá escolher entre um voucher, troca por outro produto de valor equivalente ou reembolso.</p>
                                <p>O reembolso será feito via PIX em até 30 dias úteis após o produto chegar à Luciana Telles.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">7. Acesso aos Conteúdos e Certificados</h2>
                            <p>O acesso aos cursos é pessoal e intransferível.</p>
                            <p><strong>É proibido:</strong> Compartilhar login e senha; Reproduzir, distribuir ou comercializar o conteúdo sem autorização.</p>
                            <p>Nos casos de gravação do evento, será encaminhado o link no email de cada participante. O link permanecerá ativo pelo prazo de 30 dias improrrogáveis.</p>
                            <p><strong>Certificação:</strong> Os participantes receberão um certificado digital após a conclusão do evento, em até 30 dias úteis, se cumprida a exigência específica de cada curso.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">8. Propriedade Intelectual</h2>
                            <p>Todo o conteúdo disponível no site (textos, vídeos, materiais, identidade visual) é de propriedade de Luciana Telles. É proibida a utilização sem autorização prévia e expressa.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">9. Ética e Responsabilidade Profissional</h2>
                            <p>Os conteúdos seguem princípios éticos da Psicologia. Não são realizados atendimentos terapêuticos por meio dos cursos ou supervisões. Em casos de sofrimento psíquico, recomenda-se a busca por atendimento profissional individualizado.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">10. Privacidade e Proteção de Dados</h2>
                            <p>Os dados pessoais fornecidos serão utilizados exclusivamente para: Processamento de compras, Comunicação com o usuário e Envio de conteúdos e informações relevantes.</p>
                            <p>Os dados não serão vendidos ou compartilhados com terceiros, exceto quando necessário para funcionamento da plataforma.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">11. Direitos do Usuário</h2>
                            <p>O usuário pode, a qualquer momento: Solicitar acesso aos dados, Corrigir informações ou Solicitar exclusão de dados através do canal de contato.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">12. Uso de Imagem e Depoimentos</h2>
                            <p>Ao participar de eventos ao vivo, o usuário declara ciência de que pode haver gravação para fins educacionais. Depoimentos poderão ser utilizados de forma ética e não identificável, com autorização expressa.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">13. Modificações nas Políticas</h2>
                            <p>Estas políticas podem ser atualizadas a qualquer momento, sendo responsabilidade do usuário revisá-las periodicamente.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">14. Contato</h2>
                            <p>Em caso de dúvidas, entre em contato:</p>
                            <ul className="list-none space-y-2">
                                <li><strong>E-mail:</strong> contato@lucianatelles-psi.com.br</li>
                                <li><strong>Instagram:</strong> @lucianatelles.psi</li>
                            </ul>
                        </section>
                        
                        <p className="pt-8 text-xs italic">Última atualização: 29 de março de 2026.</p>
                    </div>
                </ScrollReveal>
            </main>
        </div>
    );
}
