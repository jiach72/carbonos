"use client";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Newspaper, RefreshCw, AlertCircle, Zap, Cpu, TrendingUp, Leaf, Search } from 'lucide-react';
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock Data from original service
const MOCK_NEWS = [
    {
        id: '1',
        title: '全球储能市场迎来爆发式增长，中国企业占据领先地位',
        summary: '据最新报告显示，2024年全球储能装机量同比增长超过80%，中国储能企业凭借技术优势和成本优势，在国际市场份额持续扩大...',
        pubDate: '2026-02-04',
        source: '北极星电力网',
        category: 'new-energy',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '2',
        title: 'AI大模型训练能耗优化新突破，算力效率提升40%',
        summary: '清华大学研究团队发布最新研究成果，通过创新的模型压缩和分布式训练技术，大幅降低了AI大模型的训练能耗...',
        pubDate: '2026-02-04',
        source: '机器之心',
        category: 'ai-computing',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '3',
        title: '绿色债券发行规模创新高，新能源项目融资渠道拓宽',
        summary: '2024年上半年，中国绿色债券发行总额突破5000亿元，其中新能源项目占比超过35%，为行业发展提供强劲资金支持...',
        pubDate: '2026-02-03',
        source: '碳排放交易网',
        category: 'green-finance',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '4',
        title: '首批国家级零碳园区示范项目名单公布',
        summary: '国家发改委公布首批20个国家级零碳园区示范项目，涵盖工业、商业、综合类园区，将为全国零碳转型提供可复制经验...',
        pubDate: '2026-02-02',
        source: '中国节能在线',
        category: 'zero-carbon',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '5',
        title: '工商业储能电站峰谷价差套利模式深度解析',
        summary: '随着电力市场化改革深入推进，工商业储能电站通过峰谷价差套利实现盈利的模式日趋成熟，投资回报周期持续缩短...',
        pubDate: '2026-02-01',
        source: '北极星电力网',
        category: 'new-energy',
        imageUrl: null
    },
    {
        id: '6',
        title: 'GPU算力成本持续下降，AI推理服务进入普惠时代',
        summary: '随着国产AI芯片量产和云计算竞争加剧，AI推理服务的单价大幅下降，为中小企业提供了更多发展机遇...',
        pubDate: '2026-01-31',
        source: '机器之心',
        category: 'ai-computing',
        imageUrl: null
    },
    {
        id: '7',
        title: '碳交易市场扩容在即，更多行业将纳入碳市场管理',
        summary: '生态环境部正在研究将钢铁、水泥等高排放行业纳入全国碳市场，预计碳配额总量和市场规模将大幅增长...',
        pubDate: '2026-01-30',
        source: '碳排放交易网',
        category: 'green-finance',
        imageUrl: null
    },
    {
        id: '8',
        title: '苏州工业园区打造零碳智慧园区标杆',
        summary: '苏州工业园区通过光储充一体化、智能能源管理等技术，实现园区碳排放同比下降30%，成为长三角零碳转型典范...',
        pubDate: '2026-01-28',
        source: '中国节能在线',
        category: 'zero-carbon',
        imageUrl: null
    },
];

const CATEGORIES = [
    { id: 'all', name: '全部资讯', icon: Newspaper },
    { id: 'new-energy', name: '新能源', icon: Zap },
    { id: 'ai-computing', name: 'AI算力', icon: Cpu },
    { id: 'green-finance', name: '绿色金融', icon: TrendingUp },
    { id: 'zero-carbon', name: '零碳园区', icon: Leaf },
];

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredNews = useMemo(() => {
        if (activeCategory === "all") return MOCK_NEWS;
        return MOCK_NEWS.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-20 bg-slate-900/50 border-b border-white/5">
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6 font-medium">
                            <Newspaper className="w-4 h-4" /> 行业动态
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                            洞察行业趋势 <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">把握发展机遇</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            聚焦新能源、AI算力、绿色金融、零碳园区四大领域，
                            为您实时呈现行业最新资讯与深度洞察
                        </p>
                    </div>
                </section>

                {/* Filter */}
                <section className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4">
                    <div className="container mx-auto px-6 overflow-x-auto">
                        <div className="flex gap-2 min-w-max justify-center">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                                        }`}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* News Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        {filteredNews.length === 0 ? (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500">该分类下暂无新闻</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredNews.map((item) => (
                                    <div key={item.id} className="group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full">
                                        <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full bg-slate-800">
                                                    <Newspaper className="w-12 h-12 text-slate-700" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="secondary" className="bg-slate-950/80 backdrop-blur text-white border-0">
                                                    {CATEGORIES.find(c => c.id === item.category)?.name}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                                <span>{item.source}</span>
                                                <span>•</span>
                                                <span>{item.pubDate}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                                <Link href="#" className="hover:underline">{item.title}</Link>
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                                {item.summary}
                                            </p>
                                            <Button variant="link" className="text-emerald-400 p-0 h-auto justify-start hover:text-emerald-300">
                                                阅读全文 <Search className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
