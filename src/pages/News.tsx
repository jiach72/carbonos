import { useState, useEffect, useMemo } from 'react'
import { Newspaper, RefreshCw, AlertCircle } from 'lucide-react'
import { NewsItem } from '../types/news'
import { fetchAllNews, getMockNews } from '../services/rssService'
import NewsCard from '../components/news/NewsCard'
import CategoryFilter from '../components/news/CategoryFilter'

export default function News() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [isUsingMock, setIsUsingMock] = useState(false)

    // 加载新闻数据
    const loadNews = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchAllNews()
            // 检查是否使用了 Mock 数据（通过检查链接是否为 example.com）
            const isMock = data.some(item => item.link.includes('example.com'))
            setIsUsingMock(isMock)
            setNews(data)
        } catch (err) {
            console.error('Failed to fetch news:', err)
            setError('获取新闻数据失败，已显示示例内容')
            setNews(getMockNews())
            setIsUsingMock(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNews()
    }, [])

    // 按分类过滤新闻
    const filteredNews = useMemo(() => {
        if (!activeCategory) return news
        return news.filter(item => item.category === activeCategory)
    }, [news, activeCategory])

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/5" />

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Newspaper className="w-4 h-4" />
                            行业动态
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            洞察行业趋势
                            <span className="text-gradient"> 把握发展机遇</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            聚焦新能源、AI算力、绿色金融、零碳园区四大领域，
                            为您实时呈现行业最新资讯与深度洞察
                        </p>
                    </div>
                </div>
            </section>

            {/* 分类筛选 */}
            <section className="py-8 sticky top-20 z-40 bg-dark-500/90 backdrop-blur-lg border-b border-white/5">
                <div className="container-custom">
                    <CategoryFilter
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>
            </section>

            {/* 新闻列表 */}
            <section className="section-padding bg-dark-400/30">
                <div className="container-custom">
                    {/* 提示信息 */}
                    {isUsingMock && !loading && (
                        <div className="flex items-center justify-center gap-2 mb-8 text-amber-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>当前显示示例内容，RSS 源数据获取中...</span>
                            <button
                                onClick={loadNews}
                                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
                            >
                                <RefreshCw className="w-3 h-3" />
                                重试
                            </button>
                        </div>
                    )}

                    {/* 加载状态 */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card p-6 animate-pulse">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 w-20 bg-white/10 rounded-full" />
                                        <div className="h-4 w-16 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-6 bg-white/10 rounded mb-2" />
                                    <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-white/10 rounded" />
                                        <div className="h-4 bg-white/10 rounded" />
                                        <div className="h-4 bg-white/10 rounded w-1/2" />
                                    </div>
                                    <div className="flex justify-between pt-4 border-t border-white/10">
                                        <div className="h-3 w-24 bg-white/10 rounded" />
                                        <div className="h-3 w-16 bg-white/10 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error && filteredNews.length === 0 ? (
                        /* 错误状态 */
                        <div className="text-center py-16">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">{error}</p>
                            <button
                                onClick={loadNews}
                                className="btn-primary"
                            >
                                <RefreshCw className="w-4 h-4" />
                                重新加载
                            </button>
                        </div>
                    ) : filteredNews.length === 0 ? (
                        /* 空状态 */
                        <div className="text-center py-16">
                            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">暂无该分类的新闻</p>
                        </div>
                    ) : (
                        /* 新闻卡片网格 */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((item) => (
                                <NewsCard key={item.id} news={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
