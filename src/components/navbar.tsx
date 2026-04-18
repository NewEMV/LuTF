'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from "lucide-react";
import { LucianaLogo } from "@/components/luciana-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ContactModal } from '@/components/contact-modal';
import { getServices } from '@/lib/services';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasServices, setHasServices] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
      const checkServices = async () => {
          try {
              const services = await getServices(false);
              setHasServices(services.length > 0);
          } catch (e) {
              console.error(e);
          }
      };
      checkServices();
  }, []);

  const handleAgendarConsulta = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.status === 'pending') {
      alert('Seu cadastro está aguardando aprovação. Você receberá um email quando for aprovado.');
      return;
    }
    if (user.status === 'denied') {
      alert('Seu cadastro foi negado. Entre em contato para mais informações.');
      return;
    }
    if (user.role === 'client' && user.status === 'approved') {
      window.open('/agenda', '_blank');
    } else if (user.role === 'admin') {
      router.push('/admin');
    }
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link href={href} className={`px-4 py-2 font-medium transition-all duration-300 relative group ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
        {label}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
      </Link>
    );
  };

  const MobileNavMenu = () => (
    <div className={`absolute top-full left-0 w-full glass lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <div className="flex flex-col items-center space-y-4 py-8">
        <NavLink href="/" label="Início" />
        <NavLink href="/trajetoria" label="Trajetória" />
        <NavLink href="/videos" label="Vídeos" />
        <NavLink href="/blog" label="Blog" />
        {hasServices && (
          <NavLink href="/servicos" label="Serviços" />
        )}
        <NavLink href="/galeria" label="Galeria" />
        <div className="flex flex-col gap-3 mt-4 w-full px-8">
          <Button onClick={() => setIsContactModalOpen(true)} variant="outline" size="lg" className="w-full">Contato</Button>
          <Button onClick={() => router.push('/agendamento')} size="lg" className="w-full">Agendamento</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || pathname !== '/' ? 'bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <LucianaLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-12" />
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-allison text-foreground leading-none pt-2">luciana telles</span>
                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.15em] text-primary font-bold mt-1">Psicologia Clínica | Psico Oncologia | Cuidados Paliativos | Luto</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/" label="Início" />
              <NavLink href="/trajetoria" label="Trajetória" />
              <NavLink href="/videos" label="Vídeos" />
              <NavLink href="/blog" label="Blog" />
              {hasServices && (
                <NavLink href="/servicos" label="Serviços" />
              )}
              <NavLink href="/galeria" label="Galeria" />
              <div className="ml-4">
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button onClick={() => setIsContactModalOpen(true)} variant="outline" className="rounded-full px-5 py-3 font-bold" size="lg">Contato</Button>
                <Button onClick={() => router.push('/agendamento')} className="rounded-full px-5 py-3 font-bold" size="lg">Agendamento</Button>
              </div>
            </div>
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground p-2">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
        <MobileNavMenu />
      </nav>
      <ContactModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
