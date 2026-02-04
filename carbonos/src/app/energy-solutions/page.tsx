import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Battery, Sun, Zap, TrendingDown, Clock, Leaf, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function EnergySolutionsPage() {
    const solutions = [
        {
            id: 'storage',
            icon: Battery,
            title: '工商业储能',
            subtitle: '智能动态增容，峰谷套利',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            painPoints: ['企业扩大生产导致变压器容量不足', '高峰时段电费支出居高不下', '电网扩容审批周期长、成本高'],
            solutions: ['部署创电云液冷/风冷储能柜，无需改造变压器', '智能算法优化充放电策略，最大化峰谷价差', '接入虚拟电厂平台，参与需求响应'],
            values: [
                { icon: TrendingDown, text: '降低约30%容量电费' },
                { icon: Clock, text: '投资回报周期3-4年' },
                { icon: Zap, text: '无需电网扩容' },
            ],
        },
        {
            id: 'solar',
            icon: Sun,
            title: '光储充一体化',
            subtitle: '绿色出行，柔性充电',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            painPoints: ['新能源车充电需求激增', '老旧园区电网配额不足', '扩容审批难、周期长'],
            solutions: ['"光伏发电 + 储能补给 + 智能充电"闭环', '优先使用光伏绿电，降低用电成本', '储能削峰填谷，不抢占电网负荷'],
            values: [
                { icon: Leaf, text: '绿电优先供给' },
                { icon: Battery, text: '柔性充电不堵电网' },
                { icon: TrendingDown, text: '显著降低充电成本' },
            ],
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm mb-6 font-medium">
                            <Zap className="w-4 h-4" /> 能源解决方案
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            精准解决 <span className="text-orange-400">企业用能痛点</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            针对工商业用户的核心需求，提供从储能系统到光储充一体化的完整解决方案，
                            助力企业降本增效、绿色转型。
                        </p>
                    </div>
                </section>

                {/* Solutions List */}
                {solutions.map((sol, index) => (
                    <section key={sol.id} className={`py-20 border-t border-white/5 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                        <div className="container mx-auto px-6">
                            <div className="flex items-center gap-6 mb-12">
                                <div className={`w-16 h-16 rounded-2xl ${sol.bg} flex items-center justify-center`}>
                                    <sol.icon className={`w-8 h-8 ${sol.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{sol.title}</h2>
                                    <p className={`text-lg font-medium ${sol.color}`}>{sol.subtitle}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Pain Points */}
                                <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-sm font-black">!</span>
                                        客户痛点
                                    </h3>
                                    <ul className="space-y-4">
                                        {sol.painPoints.map((p, i) => (
                                            <li key={i} className="flex gap-3 text-slate-400 text-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Solutions */}
                                <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-black">✓</span>
                                        创电云对策
                                    </h3>
                                    <ul className="space-y-4">
                                        {sol.solutions.map((s, i) => (
                                            <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Values */}
                                <div className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-black">★</span>
                                        客户价值
                                    </h3>
                                    <ul className="space-y-4">
                                        {sol.values.map((v, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                                                <div className={`w-8 h-8 rounded-lg ${sol.bg} flex items-center justify-center`}>
                                                    <v.icon className={`w-4 h-4 ${sol.color}`} />
                                                </div>
                                                {v.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* Scenarios */}
                <section className="py-20 border-t border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-8">适用场景</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {['制造业工厂', '物流仓储', '商业综合体', '产业园区', '数据中心', '充电场站', '农业大棚', '港口码头'].map((scene) => (
                                <div key={scene} className="p-4 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
                                    {scene}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
