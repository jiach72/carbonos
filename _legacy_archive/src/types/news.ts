/**
 * 新闻分类定义
 */
export interface NewsCategory {
    id: string
    name: string
    nameEn: string
    icon: string
    color: string
}

/**
 * 新闻条目
 */
export interface NewsItem {
    id: string
    title: string
    summary: string
    link: string
    pubDate: Date
    source: string
    category: string  // category id
    imageUrl?: string
}

/**
 * RSS 数据源配置
 */
export interface RSSSource {
    url: string
    category: string
    name: string
}

/**
 * 预定义的新闻分类
 */
export const NEWS_CATEGORIES: NewsCategory[] = [
    {
        id: 'new-energy',
        name: '新能源',
        nameEn: 'New Energy',
        icon: 'Zap',
        color: '#2E8B57'  // primary green
    },
    {
        id: 'ai-computing',
        name: 'AI算力',
        nameEn: 'AI Computing',
        icon: 'Cpu',
        color: '#87CEEB'  // secondary blue
    },
    {
        id: 'green-finance',
        name: '新能源金融',
        nameEn: 'Green Finance',
        icon: 'TrendingUp',
        color: '#FFD700'  // accent gold
    },
    {
        id: 'zero-carbon',
        name: '零碳园区',
        nameEn: 'Zero Carbon',
        icon: 'Leaf',
        color: '#3CB371'  // medium sea green
    }
]
