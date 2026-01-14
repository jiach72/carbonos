import { NewsItem, RSSSource, NEWS_CATEGORIES } from '../types/news'

/**
 * RSS 数据源配置
 * 注意：部分 RSS 源可能需要根据实际可用性替换
 */
const RSS_SOURCES: RSSSource[] = [
    // 新能源
    { url: 'https://www.bjx.com.cn/rss/news.xml', category: 'new-energy', name: '北极星电力网' },
    // AI 算力
    { url: 'https://www.jiqizhixin.com/rss', category: 'ai-computing', name: '机器之心' },
    // 新能源金融
    { url: 'https://www.tanpaifang.com/feed/', category: 'green-finance', name: '碳排放交易网' },
    // 零碳园区
    { url: 'https://www.cecol.com.cn/rss/news.xml', category: 'zero-carbon', name: '中国节能在线' },
]

/**
 * CORS 代理列表（降级使用）
 */
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
]

/**
 * 生成唯一 ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 15)
}

/**
 * 解析 RSS XML 数据
 */
function parseRSSXml(xmlText: string, source: RSSSource): NewsItem[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    const items = doc.querySelectorAll('item')
    const newsItems: NewsItem[] = []

    items.forEach((item, index) => {
        if (index >= 10) return // 每个源最多取 10 条

        const title = item.querySelector('title')?.textContent?.trim() || ''
        const description = item.querySelector('description')?.textContent?.trim() || ''
        const link = item.querySelector('link')?.textContent?.trim() || ''
        const pubDate = item.querySelector('pubDate')?.textContent?.trim()

        // 提取图片 URL（从 description 或 enclosure）
        let imageUrl: string | undefined
        const enclosure = item.querySelector('enclosure')
        if (enclosure?.getAttribute('type')?.startsWith('image')) {
            imageUrl = enclosure.getAttribute('url') || undefined
        }

        // 清理 HTML 标签
        const cleanSummary = description.replace(/<[^>]*>/g, '').substring(0, 200)

        newsItems.push({
            id: generateId(),
            title,
            summary: cleanSummary,
            link,
            pubDate: pubDate ? new Date(pubDate) : new Date(),
            source: source.name,
            category: source.category,
            imageUrl
        })
    })

    return newsItems
}

/**
 * 通过 CORS 代理获取 RSS 数据
 */
async function fetchRSSWithProxy(source: RSSSource): Promise<NewsItem[]> {
    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetch(`${proxy}${encodeURIComponent(source.url)}`, {
                signal: AbortSignal.timeout(10000)
            })
            if (response.ok) {
                const text = await response.text()
                return parseRSSXml(text, source)
            }
        } catch (error) {
            console.warn(`Proxy ${proxy} failed for ${source.name}:`, error)
            continue
        }
    }
    return []
}

/**
 * 获取所有 RSS 源的新闻数据
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
    const allPromises = RSS_SOURCES.map(source => fetchRSSWithProxy(source))
    const results = await Promise.allSettled(allPromises)

    const allNews: NewsItem[] = []
    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            allNews.push(...result.value)
        }
    })

    // 按发布时间排序（最新优先）
    allNews.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

    // 如果没有获取到任何数据，返回 Mock 数据
    if (allNews.length === 0) {
        return getMockNews()
    }

    return allNews
}

/**
 * 按分类获取新闻
 */
export async function fetchNewsByCategory(categoryId: string): Promise<NewsItem[]> {
    const allNews = await fetchAllNews()
    return allNews.filter(item => item.category === categoryId)
}

/**
 * Mock 新闻数据（RSS 获取失败时的降级方案）
 */
export function getMockNews(): NewsItem[] {
    const now = new Date()

    return [
        {
            id: generateId(),
            title: '全球储能市场迎来爆发式增长，中国企业占据领先地位',
            summary: '据最新报告显示，2024年全球储能装机量同比增长超过80%，中国储能企业凭借技术优势和成本优势，在国际市场份额持续扩大...',
            link: 'https://example.com/news/1',
            pubDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            source: '北极星电力网',
            category: 'new-energy'
        },
        {
            id: generateId(),
            title: 'AI大模型训练能耗优化新突破，算力效率提升40%',
            summary: '清华大学研究团队发布最新研究成果，通过创新的模型压缩和分布式训练技术，大幅降低了AI大模型的训练能耗...',
            link: 'https://example.com/news/2',
            pubDate: new Date(now.getTime() - 4 * 60 * 60 * 1000),
            source: '机器之心',
            category: 'ai-computing'
        },
        {
            id: generateId(),
            title: '绿色债券发行规模创新高，新能源项目融资渠道拓宽',
            summary: '2024年上半年，中国绿色债券发行总额突破5000亿元，其中新能源项目占比超过35%，为行业发展提供强劲资金支持...',
            link: 'https://example.com/news/3',
            pubDate: new Date(now.getTime() - 6 * 60 * 60 * 1000),
            source: '碳排放交易网',
            category: 'green-finance'
        },
        {
            id: generateId(),
            title: '首批国家级零碳园区示范项目名单公布',
            summary: '国家发改委公布首批20个国家级零碳园区示范项目，涵盖工业、商业、综合类园区，将为全国零碳转型提供可复制经验...',
            link: 'https://example.com/news/4',
            pubDate: new Date(now.getTime() - 8 * 60 * 60 * 1000),
            source: '中国节能在线',
            category: 'zero-carbon'
        },
        {
            id: generateId(),
            title: '工商业储能电站峰谷价差套利模式深度解析',
            summary: '随着电力市场化改革深入推进，工商业储能电站通过峰谷价差套利实现盈利的模式日趋成熟，投资回报周期持续缩短...',
            link: 'https://example.com/news/5',
            pubDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
            source: '北极星电力网',
            category: 'new-energy'
        },
        {
            id: generateId(),
            title: 'GPU算力成本持续下降，AI推理服务进入普惠时代',
            summary: '随着国产AI芯片量产和云计算竞争加剧，AI推理服务的单价大幅下降，为中小企业提供了更多发展机遇...',
            link: 'https://example.com/news/6',
            pubDate: new Date(now.getTime() - 18 * 60 * 60 * 1000),
            source: '机器之心',
            category: 'ai-computing'
        },
        {
            id: generateId(),
            title: '碳交易市场扩容在即，更多行业将纳入碳市场管理',
            summary: '生态环境部正在研究将钢铁、水泥等高排放行业纳入全国碳市场，预计碳配额总量和市场规模将大幅增长...',
            link: 'https://example.com/news/7',
            pubDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            source: '碳排放交易网',
            category: 'green-finance'
        },
        {
            id: generateId(),
            title: '苏州工业园区打造零碳智慧园区标杆',
            summary: '苏州工业园区通过光储充一体化、智能能源管理等技术，实现园区碳排放同比下降30%，成为长三角零碳转型典范...',
            link: 'https://example.com/news/8',
            pubDate: new Date(now.getTime() - 36 * 60 * 60 * 1000),
            source: '中国节能在线',
            category: 'zero-carbon'
        },
    ]
}

/**
 * 获取分类信息
 */
export function getCategoryInfo(categoryId: string) {
    return NEWS_CATEGORIES.find(cat => cat.id === categoryId)
}

/**
 * 格式化发布时间为相对时间
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
        return `${diffMins} 分钟前`
    } else if (diffHours < 24) {
        return `${diffHours} 小时前`
    } else if (diffDays < 7) {
        return `${diffDays} 天前`
    } else {
        return date.toLocaleDateString('zh-CN')
    }
}
