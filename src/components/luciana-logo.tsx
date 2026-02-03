import Image from "next/image";
import { cn } from "@/lib/utils";

export const LucianaLogo = ({ className }: { className?: string }) => (
    <Image 
        src="/images/Logo_LuTF.jpeg" 
        alt="Luciana Telles Ferri Logo" 
        width={48} 
        height={48} 
        className={cn("rounded-full object-cover", className)}
    />
);
