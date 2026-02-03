import { cn } from "@/lib/utils";

export const LucianaLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={cn("w-10 h-10", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50C20 75 40 85 50 85C60 85 80 75 80 50C80 40 70 35 50 45C30 55 20 40 20 50Z" className="fill-primary" opacity="0.9" />
        <path d="M20 50C20 65 35 75 50 75C65 75 80 65 80 50C80 55 65 65 50 65C35 65 20 55 20 50Z" className="fill-muted-foreground" opacity="0.3" />
        <circle cx="35" cy="35" r="1.5" fill="#e28a78" />
        <circle cx="42" cy="30" r="1.2" fill="#e28a78" />
        <circle cx="48" cy="28" r="1" fill="#e28a78" />
        <circle cx="30" cy="42" r="1.3" fill="#e28a78" />
        <circle cx="38" cy="38" r="0.8" fill="#e28a78" />
        <circle cx="55" cy="26" r="1.1" fill="#e28a78" />
        <circle cx="62" cy="29" r="0.9" fill="#e28a78" />
        <path d="M25 55C35 60 45 58 55 52" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.5" />
    </svg>
);