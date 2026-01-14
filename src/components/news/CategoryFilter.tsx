import { NEWS_CATEGORIES } from '../../types/news'
import { Zap, Cpu, TrendingUp, Leaf, Newspaper } from 'lucide-react'

// 图标映射
const iconMap: Record<string, React.FC<{ className?: string }>> = {
    'Zap': Zap,
    'Cpu': Cpu,
    'TrendingUp': TrendingUp,
    'Leaf': Leaf,
}

interface CategoryFilterProps {
    activeCategory: string | null
    onCategoryChange: (categoryId: string | null) => void
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="relative">
            {/* 移动端横向滚动容器 */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible scrollbar-hide">
                {/* 全部按钮 */}
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${activeCategory === null
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                >
                    <Newspaper className="w-4 h-4" />
                    全部
                </button>

                {/* 分类按钮 */}
                {NEWS_CATEGORIES.map((category) => {
                    const IconComponent = iconMap[category.icon] || Zap
                    const isActive = activeCategory === category.id

                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${isActive
                                ? 'text-white shadow-lg'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            style={isActive ? {
                                backgroundColor: category.color,
                                boxShadow: `0 10px 25px -5px ${category.color}40`
                            } : undefined}
                        >
                            <IconComponent className="w-4 h-4" />
                            {category.name}
                        </button>
                    )
                })}
            </div>
            {/* 右侧渐变提示（移动端） */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-dark-500 to-transparent pointer-events-none sm:hidden" />
        </div>
    )
}
