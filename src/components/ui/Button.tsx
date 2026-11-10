import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-out active:scale-[0.98] disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#050814] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const sizeClasses = {
    sm: 'px-3 py-1.5 min-h-[36px] text-xs',
    md: 'px-4 py-2 min-h-[40px] text-sm',
    lg: 'px-5 py-2.5 min-h-[44px] text-sm sm:text-base',
  }[size]

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-500/20',
    secondary: 'bg-slate-100 dark:bg-[#11182D] text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800',
    outline: 'border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0B1020] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#11182D] hover:border-slate-300 dark:hover:border-cyan-500/40 shadow-2xs',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white',
  }[variant]

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
