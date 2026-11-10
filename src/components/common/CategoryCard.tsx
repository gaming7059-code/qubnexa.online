import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../../types/tools'
import { CategoryIcon } from './CategoryIcon'

interface CategoryCardProps {
  category: Category
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const targetPath = category.path || `/tools?category=${category.id}`
  const countLabel = category.itemLabel || `${category.toolCount} Tools`

  return (
    <Link
      to={targetPath}
      className="card-lift group relative flex h-full flex-col justify-between xw-surface p-5 shadow-xs hover:border-blue-500/70 dark:hover:border-[#00DFFF]/60 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-[0_12px_30px_rgba(0,223,255,0.08)] will-change-transform cursor-pointer overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* Custom Vector Category Icon Container */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200/80 dark:border-slate-800 p-2.5 shadow-2xs transition-colors duration-200 group-hover:bg-blue-50 dark:group-hover:bg-[#16203B] group-hover:border-blue-300 dark:group-hover:border-[#00DFFF]/50">
            <CategoryIcon categoryId={category.id} size="lg" className="w-full h-full" />
          </div>

          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-[#11182D] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-800 transition-colors">
            {countLabel}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-colors">
          {category.name}
        </h3>
        
        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {category.tagline}
        </p>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-600 dark:text-[#00DFFF] group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors">
          Explore {category.name}
        </span>
        <ArrowRight className="h-4 w-4 text-blue-600 dark:text-[#00DFFF] transition-transform duration-200 ease-out group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
