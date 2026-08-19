import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      onClick={onClick}
      className={cn(
        'bg-white/60 backdrop-blur-md border border-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden',
        hover && 'cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-slate-300/50',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
