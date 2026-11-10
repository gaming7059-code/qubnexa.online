import React from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'cyan' | 'purple'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-[#11182D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    info: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-[#00DFFF] border-cyan-200 dark:border-cyan-500/30',
    purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles} ${className}`}
    >
      {children}
    </span>
  )
}
