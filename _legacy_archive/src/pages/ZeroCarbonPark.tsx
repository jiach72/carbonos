import { Building2, Sun, Network, Battery, BarChart3, Leaf, Globe, TrendingDown, ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

// 源网荷储模块
const modules = [
    {
        icon: Sun,
        title: '源 (Supply)',
        description: '园区屋顶光伏全覆盖，提升绿电自给率',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: Network,
        title: '网 (Grid)',
        description: '建设园区级智能微网，实现能量内部互济与柔性互联',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Building2,
        title: '荷 (Load)',
        description: '部署智能充电桩与高耗能设备节能改造',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Battery,
        title: '储 (Storage)',
        description: '配置集中式共享储能电站，解决绿电消纳难题',
        color: 'from-emerald-500 to-green-600',
    },
]

// 碳管理平台特性
const carbonFeatures = [
    {
        icon: BarChart3,
        title: '能耗监测',
        description: '水、电、气、热全要素实时采集，生成园区能流图',
    },
    {
        icon: Globe,
        title: '碳足迹追踪',
        description: '基于区块链技术，追踪每一件出口产品的碳足迹，生成合规的碳盘查报告',
    },
    {
        icon: Leaf,
        title: '绿电交易',
        description: '协助园区企业进行绿电/绿证交易与核销，完成碳中和最后一公里',
    },
]

// 客户价值
const customerValues = [
    {
        icon: Building2,
        title: '绿色招商',
        description: '构建零碳基础设施，吸引外向型/高科技企业入驻',
    },
    {
        icon: TrendingDown,
        title: '能耗双控',
        description: '通过精准调控，显著降低万元GDP能耗指标',
    },
    {
        icon: Globe,
        title: '跨越碳壁垒',
        description: '从容应对欧盟CBAM（碳关税）等国际贸易壁垒',
    },
]

export default function ZeroCarbonPark() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-zero-carbon.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Leaf className="w-4 h-4" />
                            零碳园区解决方案
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            从"低碳"到
                            <span className="text-gradient">"零碳"</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8">
                            为政府园区及大型工业园区提供从顶层规划、硬件建设到数字化运营的一站式
                            "源网荷储"解决方案，打造绿色产业新高地。
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="http://localhost:3000/dashboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-green-500/30 flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                启动 CarbonOS 平台
                            </a>
                            <a href="#contact" className="px-8 py-3 rounded-full border border-gray-600 hover:border-white text-gray-300 hover:text-white transition-colors">
                                了解更多
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 源网荷储一体化 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">源网荷储一体化硬件底座</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            四维一体，构建园区级能源互联网
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module, index) => (
                            <div
                                key={module.title}
                                className="glass-card-hover p-6 text-center"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5`}>
                                    <module.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{module.title}</h3>
                                <p className="text-gray-400 text-sm">{module.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 数字化碳管理平台 */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="heading-2 text-white mb-4">
                                数字化碳管理平台
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                基于物联网采集与区块链存证技术，实现园区碳排放的全流程追踪与管理，
                                助力出口型企业从容应对国际碳关税。
                            </p>
                            <div className="space-y-4">
                                {carbonFeatures.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        className="flex items-start gap-4"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 右侧可视化区域 */}
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-300/5" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-6">碳盘查报告示例</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Scope 1 直接排放</span>
                                        <span className="text-white font-medium">1,234 tCO₂e</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Scope 2 间接排放</span>
                                        <span className="text-white font-medium">2,567 tCO₂e</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">绿电抵消</span>
                                        <span className="text-primary-500 font-medium">-890 tCO₂e</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-1/3 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-gray-400">净排放量</span>
                                    <span className="text-2xl font-bold text-gradient">2,911 tCO₂e</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 客户价值 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">客户价值</h2>
                        <p className="text-gray-400">构建零碳竞争力，引领绿色发展</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {customerValues.map((value, index) => (
                            <div
                                key={value.title}
                                className="glass-card p-6"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5">
                                    <value.icon className="w-7 h-7 text-primary-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom text-center">
                    <h2 className="heading-2 text-white mb-6">打造您的零碳园区</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        无论是新建园区规划还是既有园区改造，我们都能提供完整的零碳解决方案
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary">
                            获取定制方案
                        </a>
                        <Link to="/ai-computing" className="btn-secondary">
                            了解AI算力服务 <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
