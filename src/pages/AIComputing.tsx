import { Server, Network, Cpu, Zap, Shield, Clock, BarChart3, Wrench, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// 算力中心组网特性
const networkingFeatures = [
    {
        icon: Network,
        title: 'InfiniBand & RoCE',
        description: '基于InfiniBand与RoCE技术的无损网络架构设计',
    },
    {
        icon: Server,
        title: '拓扑优化',
        description: '针对千卡/万卡集群进行拓扑优化，消除网络拥塞',
    },
    {
        icon: Cpu,
        title: 'GPU利用率最大化',
        description: '确保GPU算力利用率最大化，降低训练成本',
    },
]

// AIOps智能运维特性
const aiOpsFeatures = [
    {
        icon: BarChart3,
        title: 'PUE优化专家',
        description: '将EMS系统应用于机房温控，根据算力负载实时调节制冷功率，显著降低PUE',
    },
    {
        icon: Clock,
        title: '7x24h监控',
        description: '全天候监控告警系统，故障自愈能力，保障算力任务永不断电',
    },
    {
        icon: Wrench,
        title: '资产代维',
        description: '专业运维团队提供设备巡检、故障处理、性能调优全生命周期服务',
    },
]

// 服务优势
const advantages = [
    { label: '在线率保障', value: '99.99%' },
    { label: 'PUE目标', value: '< 1.25' },
    { label: '故障响应', value: '< 15分钟' },
]

export default function AIComputing() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-ai-computing.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Cpu className="w-4 h-4" />
                            AI算力服务
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            我们不仅懂电
                            <span className="text-gradient"> 更懂连接</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            提供从算力中心组网设计到智能运维的全栈服务，
                            懂能源的运维团队，帮您省下巨额电费。
                        </p>
                    </div>
                </div>
            </section>

            {/* 服务指标 */}
            <section className="py-8 bg-dark-400/50">
                <div className="container-custom">
                    <div className="grid grid-cols-3 gap-4">
                        {advantages.map((item) => (
                            <div key={item.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{item.value}</div>
                                <div className="text-sm text-gray-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 算力中心组网 */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                                <Network className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="heading-2 text-white mb-4">算力中心组网</h2>
                            <p className="text-primary-500 font-medium mb-4">HPC Networking</p>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                提供基于InfiniBand与RoCE技术的无损网络架构设计，
                                针对千卡/万卡集群进行拓扑优化，消除网络拥塞，确保GPU算力利用率最大化。
                            </p>
                            <div className="space-y-4">
                                {networkingFeatures.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        className="glass-card p-4 flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 网络拓扑示意图 */}
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-6">万卡集群架构</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                                            <Server className="w-6 h-6 text-purple-400" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Spine-Leaf拓扑</span>
                                    <span className="text-purple-400">400G IB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AIOps智能运维 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* 左侧运维仪表盘 */}
                        <div className="glass-card p-8 relative overflow-hidden lg:order-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-6">智能运维大屏</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">实时PUE</span>
                                        <span className="text-2xl font-bold text-primary-500">1.18</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">GPU利用率</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full w-4/5 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" />
                                            </div>
                                            <span className="text-white font-medium">82%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">告警状态</span>
                                        <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm">正常</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">绿电占比</span>
                                        <span className="text-white font-medium">67%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:order-2">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="heading-2 text-white mb-4">AIOps智能运维</h2>
                            <p className="text-primary-500 font-medium mb-4">懂能源的运维团队，帮您省下巨额电费</p>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                将EMS系统应用于机房温控，根据算力负载实时调节制冷功率，显著降低PUE。
                                7x24h监控、故障自愈、资产代维，保障算力训练任务永不断电。
                            </p>
                            <div className="space-y-4">
                                {aiOpsFeatures.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        className="glass-card p-4 flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom text-center">
                    <h2 className="heading-2 text-white mb-6">让绿色算力驱动您的AI未来</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        无论是新建算力中心还是现有机房优化，我们都能提供专业的解决方案
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary">
                            咨询算力服务
                        </a>
                        <Link to="/digital-assets" className="btn-secondary">
                            了解数字资产 <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
