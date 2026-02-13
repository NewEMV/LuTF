"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Componente da luz que percorre o perímetro (agora com DUAS luzes opostas)
const MovingBorder = ({
  duration = 6000,  // Aumentei um pouco para o movimento ficar mais suave com dois
  rx,
  ry,
  isHovered,
}: {
  duration?: number;
  rx?: string;
  ry?: string;
  isHovered: boolean;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (!isHovered) return;

    const length = pathRef.current?.getTotalLength() || 0;
    if (length) {
      const pxPerMillisecond = length / duration;
      const val = (time * pxPerMillisecond) % length;
      progress.set(val);
    }
  });

  // Posição da primeira luz (progresso normal)
  const x1 = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0
  );
  const y1 = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0
  );

  // Posição da segunda luz (offset de metade do comprimento para ficar oposta)
  const x2 = useTransform(
    progress,
    (val) => {
      const length = pathRef.current?.getTotalLength() || 0;
      const offsetVal = (val + length / 2) % length;
      return pathRef.current?.getPointAtLength(offsetVal)?.x ?? 0;
    }
  );
  const y2 = useTransform(
    progress,
    (val) => {
      const length = pathRef.current?.getTotalLength() || 0;
      const offsetVal = (val + length / 2) % length;
      return pathRef.current?.getPointAtLength(offsetVal)?.y ?? 0;
    }
  );

  const transform1 = useMotionTemplate`translateX(${x1}px) translateY(${y1}px) translateX(-50%) translateY(-50%)`;
  const transform2 = useMotionTemplate`translateX(${x2}px) translateY(${y2}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full pointer-events-none"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
          stroke="transparent"
          strokeWidth="2"
        />
      </svg>

      {/* Primeira luz */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform: transform1,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="h-10 w-10 opacity-90 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))_0%,hsl(var(--accent))_50%,transparent_80%)] blur-[6px]" />
      </motion.div>

      {/* Segunda luz (oposta) */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform: transform2,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="h-10 w-10 opacity-90 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))_0%,hsl(var(--primary))_50%,transparent_80%)] blur-[6px]" />
      </motion.div>
    </>
  );
};

// Componente principal (mantido igual, só atualize o MovingBorder acima)
interface CardMovingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  duration?: number;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: any;
}

export function CardMovingBorder({
  children,
  className,
  borderRadius = "2.5rem",
  duration = 6000,
  borderClassName,
  as: Component = "div",
  ...otherProps
}: CardMovingBorderProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Component
      className={cn("relative p-[4px] overflow-hidden", className)}  // Aumentei para 4px dar mais espaço aos dois glows
      style={{ borderRadius }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.98)` }}
      >
        <MovingBorder
          duration={duration}
          rx={borderRadius}
          ry={borderRadius}
          isHovered={isHovered}
        />
      </div>

      <div
        className={cn(
          "relative bg-card border border-border w-full h-full",
          borderClassName
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}