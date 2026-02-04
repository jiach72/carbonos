import { NewsItem } from '../../types/news'
import { getCategoryInfo, formatRelativeTime } from '../../services/rssService'
import { ExternalLink, Zap, Cpu, TrendingUp, Leaf } from 'lucide-react'

// 图标映射
const iconMap: Record<string, React.FC<{ className?: string }>> = {
    'Zap': Zap,
    'Cpu': Cpu,
    'TrendingUp': TrendingUp,
    'Leaf': Leaf,
}

interface NewsCardProps {
    news: NewsItem
}

export default function NewsCard({ news }: NewsCardProps) {
    const category = getCategoryInfo(news.category)
    const IconComponent = category ? iconMap[category.icon] : Zap

    return (
        <article className="glass-card-hover p-6 flex flex-col h-full group">
            {/* 分类标签 */}
            <div className="flex items-center justify-between mb-4">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: `${category?.color}20`,
                        color: category?.color || '#2E8B57'
                    }}
                >
                    {IconComponent && <IconComponent className="w-3 h-3" />}
                    {category?.name || '资讯'}
                </div>
                <span className="text-xs text-gray-500">
                    {formatRelativeTime(news.pubDate)}
                </span>
            </div>

            {/* 标题 */}
            <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                {news.title}
            </h3>

            {/* 摘要 */}
            <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                {news.summary || '暂无摘要内容...'}
            </p>

            {/* 底部信息 */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-gray-500">
                    来源：{news.source}
                </span>
                <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-500 text-sm hover:text-primary-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    阅读原文
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </article>
    )
}
