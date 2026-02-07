import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Battery, Sun, Zap, TrendingDown, Clock, Leaf, CheckCircle, ChevronRight, Shield, Users, BarChart3, Factory, Warehouse, Building2, Server, Car, Sprout, Anchor, ArrowRight, Phone, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EnergySolutionsPage() {
    const solutions = [
        {
            id: 'storage',
            icon: Battery,
            title: '工商业储能',
            subtitle: 'Industrial Energy Storage',
            tagline: '智能动态增容，峰谷套利最大化',
            description: '无需电网扩容，通过智能储能系统实现变压器动态增容，利用峰谷电价差获取收益',
            gradient: 'from-emerald-500 to-teal-500',
            bgLight: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            textColor: 'text-emerald-400',
            painPoints: [
                { title: '容量不足', desc: '企业扩产导致变压器容量瓶颈' },
                { title: '电费高企', desc: '高峰时段电价推高运营成本' },
                { title: '扩容困难', desc: '电网扩容审批周期长达数月' },
            ],
            solutions: [
                { title: '液冷/风冷储能柜', desc: '灵活部署，无需改造变压器' },
                { title: '智能充放策略', desc: 'AI算法优化，最大化峰谷价差' },
                { title: '虚拟电厂接入', desc: '参与需求响应，获取额外收益' },
            ],
            values: [
                { icon: TrendingDown, value: '30%', label: '容量电费降低', highlight: true },
                { icon: Clock, value: '3-4年', label: '投资回报周期', highlight: false },
                { icon: Zap, value: '0', label: '电网扩容成本', highlight: false },
            ],
            caseStudy: {
                title: '某制造业龙头',
                result: '年节省电费超200万元',
                capacity: '2MW/4MWh',
            },
        },
        {
            id: 'solar',
            icon: Sun,
            title: '光储充一体化',
            subtitle: 'Solar + Storage + Charging',
            tagline: '绿色出行，柔性充电不堵电网',
            description: '光伏发电、储能补给、智能充电三位一体，打造园区绿色能源闭环',
            gradient: 'from-amber-500 to-orange-500',
            bgLight: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            textColor: 'text-amber-400',
            painPoints: [
                { title: '充电需求激增', desc: '新能源车保有量快速增长' },
                { title: '配额受限', desc: '老旧园区电网容量不足' },
                { title: '成本压力', desc: '高峰充电电价冲击运营' },
            ],
            solutions: [
                { title: '光储充闭环', desc: '光伏发电直供充电桩' },
                { title: '绿电优先', desc: '优先消纳自发绿电，降成本' },
                { title: '削峰填谷', desc: '储能平滑负荷，不抢电网' },
            ],
            values: [
                { icon: Leaf, value: '100%', label: '绿电优先供给', highlight: true },
                { icon: Battery, value: '柔性', label: '充电不堵电网', highlight: false },
                { icon: TrendingDown, value: '40%', label: '充电成本降低', highlight: false },
            ],
            caseStudy: {
                title: '某物流园区',
                result: '日均充电200+车次',
                capacity: '500kW光伏 + 1MW储能',
            },
        },
        {
            id: 'microgrid',
            icon: Zap,
            title: '园区微电网',
            subtitle: 'Smart Microgrid',
            tagline: '源网荷储协同，打造能源自治园区',
            description: '集成分布式光伏、储能、充电桩、负荷管理，构建园区级智能微电网',
            gradient: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            textColor: 'text-purple-400',
            painPoints: [
                { title: '能源孤岛', desc: '各系统独立运行效率低' },
                { title: '调度复杂', desc: '多能源协调难以优化' },
                { title: '韧性不足', desc: '电网故障影响生产' },
            ],
            solutions: [
                { title: 'EMS能量管理', desc: '统一调度多种能源资源' },
                { title: '智能负荷管理', desc: '优化用能结构降本增效' },
                { title: '孤岛运行能力', desc: '电网故障时独立供电' },
            ],
            values: [
                { icon: Shield, value: '99.99%', label: '供电可靠性', highlight: true },
                { icon: BarChart3, value: '15%', label: '综合能效提升', highlight: false },
                { icon: Leaf, value: '碳中和', label: '绿色园区认证', highlight: false },
            ],
            caseStudy: {
                title: '某零碳产业园',
                result: '获评国家级绿色园区',
                capacity: '3MW光伏 + 5MWh储能',
            },
        },
    ];

    const scenes = [
        { icon: Factory, name: '制造业工厂', desc: '降低生产用电成本' },
        { icon: Warehouse, name: '物流仓储', desc: '冷链/电动叉车供能' },
        { icon: Building2, name: '商业综合体', desc: '空调/照明负荷优化' },
        { icon: Server, name: '数据中心', desc: '备用电源/削峰填谷' },
        { icon: Car, name: '充电场站', desc: '光储充一体化运营' },
        { icon: Sprout, name: '农业大棚', desc: '光伏供电/储能调峰' },
        { icon: Anchor, name: '港口码头', desc: '岸电储能/港机供电' },
        { icon: Building2, name: '产业园区', desc: '微电网整体解决方案' },
    ];

    const stats = [
        { value: '500+', label: '服务企业' },
        { value: '200MW', label: '装机容量' },
        { value: '3亿+', label: '年节省电费（元）' },
        { value: '50万吨', label: '年减排CO₂' },
    ];

    const certifications = [
        '国家高新技术企业',
        '电力业务许可证',
        'ISO 9001认证',
        '储能系统集成资质',
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-emerald-600/20 via-amber-600/15 to-orange-600/10 blur-[150px] rounded-full opacity-60 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8 font-medium">
                            <Zap className="w-4 h-4" /> 工商业能源解决方案
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            精准解决 <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400">企业用能痛点</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
                            针对工商业用户的核心需求，提供从储能系统到光储充一体化、园区微电网的完整解决方案，
                            助力企业降本增效、绿色转型，实现能源自主可控。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:energy@scdc.cloud">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-lg shadow-emerald-500/25 px-8">
                                    预约现场勘测
                                </Button>
                            </a>
                            <a href="tel:400-xxx-xxxx">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">
                                    <Phone className="w-4 h-4 mr-2" /> 咨询热线
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {stats.map((item) => (
                                <div key={item.label}>
                                    <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">{item.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Solutions List */}
                {solutions.map((sol, index) => (
                    <section key={sol.id} id={sol.id} className={`py-24 ${index % 2 === 0 ? '' : 'bg-slate-900/30'} border-t border-white/5`}>
                        <div className="container mx-auto px-6">
                            {/* Header */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
                                <div className="flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${sol.gradient} flex items-center justify-center shadow-lg shadow-${sol.gradient.split(' ')[0].replace('from-', '')}/20`}>
                                        <sol.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${sol.textColor} mb-1`}>{sol.subtitle}</p>
                                        <h2 className="text-3xl lg:text-4xl font-bold text-white">{sol.title}</h2>
                                        <p className="text-slate-400 mt-2">{sol.tagline}</p>
                                    </div>
                                </div>
                                <div className={`${sol.bgLight} ${sol.borderColor} border rounded-2xl p-4 lg:text-right`}>
                                    <p className="text-slate-400 text-sm mb-1">典型案例</p>
                                    <p className="text-white font-semibold">{sol.caseStudy.title}</p>
                                    <p className={`${sol.textColor} font-bold`}>{sol.caseStudy.result}</p>
                                    <p className="text-slate-500 text-xs mt-1">{sol.caseStudy.capacity}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-400 text-lg leading-relaxed max-w-4xl mb-12">
                                {sol.description}
                            </p>

                            {/* Three Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Pain Points */}
                                <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 font-black">!</span>
                                        客户痛点
                                    </h3>
                                    <div className="space-y-6">
                                        {sol.painPoints.map((p, i) => (
                                            <div key={i}>
                                                <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    {p.title}
                                                </h4>
                                                <p className="text-slate-400 text-sm pl-4">{p.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Solutions */}
                                <div className={`bg-slate-900/50 ${sol.borderColor} border rounded-2xl p-8`}>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className={`w-10 h-10 rounded-xl ${sol.bgLight} flex items-center justify-center ${sol.textColor} font-black`}>✓</span>
                                        创电云对策
                                    </h3>
                                    <div className="space-y-6">
                                        {sol.solutions.map((s, i) => (
                                            <div key={i}>
                                                <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                                                    <CheckCircle className={`w-4 h-4 ${sol.textColor}`} />
                                                    {s.title}
                                                </h4>
                                                <p className="text-slate-400 text-sm pl-6">{s.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Values */}
                                <div className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black">★</span>
                                        客户价值
                                    </h3>
                                    <div className="space-y-4">
                                        {sol.values.map((v, i) => (
                                            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${v.highlight ? `${sol.bgLight} ${sol.borderColor} border` : 'bg-white/5'}`}>
                                                <div className={`w-12 h-12 rounded-xl ${sol.bgLight} flex items-center justify-center`}>
                                                    <v.icon className={`w-6 h-6 ${sol.textColor}`} />
                                                </div>
                                                <div>
                                                    <div className={`text-2xl font-bold ${v.highlight ? sol.textColor : 'text-white'}`}>{v.value}</div>
                                                    <div className="text-slate-400 text-sm">{v.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* Scenarios */}
                <section className="py-24 bg-slate-900/30 border-t border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">适用场景</h2>
                            <p className="text-slate-400">覆盖工商业各类用能场景，提供定制化解决方案</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {scenes.map((scene) => (
                                <div key={scene.name} className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-default text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 transition-colors">
                                        <scene.icon className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-1 group-hover:text-emerald-400 transition-colors">{scene.name}</h4>
                                    <p className="text-slate-500 text-xs">{scene.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className="py-16 border-t border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-slate-500 text-sm mb-6">资质认证</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {certifications.map((cert) => (
                                <div key={cert} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm flex items-center gap-2">
                                    <Award className="w-4 h-4 text-emerald-400" />
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-y border-emerald-500/20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">让绿色能源驱动您的企业未来</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            无论是工厂储能还是园区微电网，我们都能提供专业的勘测设计与交钥匙工程服务
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:energy@scdc.cloud">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-lg shadow-emerald-500/25 px-8">
                                    预约现场勘测
                                </Button>
                            </a>
                            <Link href="/digital-assets">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">
                                    了解数字资产 <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
