import { Battery, Sun, Zap, TrendingDown, Clock, Leaf, ChevronRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

// 解决方案数据
const solutions = [
    {
        id: 'storage',
        icon: Battery,
        title: '工商业储能',
        subtitle: '智能动态增容，峰谷套利',
        color: 'from-emerald-500 to-green-600',
        painPoints: [
            '企业扩大生产导致变压器容量不足',
            '高峰时段电费支出居高不下',
            '电网扩容审批周期长、成本高',
        ],
        solutions: [
            '部署创电云液冷/风冷储能柜，无需改造变压器即可实现动态增容',
            '智能算法优化充放电策略，最大化峰谷价差收益',
            '接入虚拟电厂平台，参与需求响应获取额外收益',
        ],
        values: [
            { icon: TrendingDown, text: '降低约30%容量电费' },
            { icon: Clock, text: '投资回报周期3-4年' },
            { icon: Zap, text: '无需电网扩容' },
        ],
    },
    {
        id: 'solar-storage-charging',
        icon: Sun,
        title: '光储充一体化',
        subtitle: '绿色出行，柔性充电',
        color: 'from-amber-500 to-orange-500',
        painPoints: [
            '新能源车充电需求激增',
            '老旧园区电网配额不足',
            '扩容审批难、周期长',
        ],
        solutions: [
            '"光伏发电 + 储能补给 + 智能充电"闭环系统',
            '优先使用光伏绿电，降低用电成本',
            '储能削峰填谷，不抢占电网负荷',
        ],
        values: [
            { icon: Leaf, text: '绿电优先供给' },
            { icon: Battery, text: '柔性充电不堵电网' },
            { icon: TrendingDown, text: '显著降低充电成本' },
        ],
    },
]

export default function EnergySolutions() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-energy-solutions.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Zap className="w-4 h-4" />
                            能源解决方案
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            精准解决
                            <span className="text-gradient"> 企业用能痛点</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            针对工商业用户的核心需求，提供从储能系统到光储充一体化的完整解决方案，
                            助力企业降本增效、绿色转型。
                        </p>
                    </div>
                </div>
            </section>

            {/* 解决方案板块 */}
            {solutions.map((solution, index) => (
                <section
                    key={solution.id}
                    className={`section-padding ${index % 2 === 0 ? 'bg-dark-400/50' : ''}`}
                >
                    <div className="container-custom">
                        {/* 标题区 */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center`}>
                                <solution.icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="heading-2 text-white">{solution.title}</h2>
                                <p className="text-primary-500 font-medium">{solution.subtitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* 痛点 */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-sm">!</span>
                                    客户痛点
                                </h3>
                                <ul className="space-y-3">
                                    {solution.painPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 解决方案 */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">✓</span>
                                    创电云对策
                                </h3>
                                <ul className="space-y-3">
                                    {solution.solutions.map((sol, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                            <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                            {sol}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 价值 */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">★</span>
                                    客户价值
                                </h3>
                                <div className="space-y-4">
                                    {solution.values.map((value, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${solution.color} flex items-center justify-center`}>
                                                <value.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-white font-medium">{value.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* 适用场景 */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">适用场景</h2>
                        <p className="text-gray-400">覆盖多种工商业应用场景</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['制造业工厂', '物流仓储', '商业综合体', '产业园区', '数据中心', '充电场站', '农业大棚', '港口码头'].map((scene) => (
                            <div key={scene} className="glass-card p-4 text-center text-gray-300 hover:text-primary-500 hover:border-primary-500/50 transition-all duration-300 cursor-pointer">
                                {scene}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom text-center">
                    <h2 className="heading-2 text-white mb-6">获取定制化方案</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        提供您的用电数据，我们将为您量身定制储能解决方案
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary">
                            预约方案咨询
                        </a>
                        <Link to="/zero-carbon" className="btn-secondary">
                            了解零碳园区 <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
