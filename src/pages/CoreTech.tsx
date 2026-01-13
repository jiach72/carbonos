import { Battery, Cpu, Radio, Shield, Zap, Clock, Network, BarChart3, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// 核心技术数据
const technologies = [
    {
        id: 'bms',
        icon: Battery,
        title: 'BMS 电池管理系统',
        subtitle: '三级架构，毫秒级安全',
        color: 'from-green-500 to-emerald-500',
        features: [
            {
                icon: Shield,
                title: '毫秒级响应',
                description: '故障发生时，系统可在10ms内切断回路，防止热失控蔓延',
            },
            {
                icon: BarChart3,
                title: '主动均衡',
                description: '智能调节电芯一致性，延长电池组使用寿命20%以上',
            },
            {
                icon: Cpu,
                title: '三级分层架构',
                description: '"模组-电池簇-电池堆"三级架构，精准监控每一颗电芯',
            },
        ],
        description: '创电云自研BMS采用"模组-电池簇-电池堆"三级分层架构。通过高精度传感器与AI算法，实时监测单体电芯电压、温差与绝缘阻抗。',
    },
    {
        id: 'ems',
        icon: Cpu,
        title: 'EMS 能源管理系统',
        subtitle: '边缘智能，离网自治',
        color: 'from-blue-500 to-cyan-500',
        features: [
            {
                icon: Network,
                title: '弱网生存',
                description: '即使在网络中断的极端环境下，本地策略依然保障微网稳定运行',
            },
            {
                icon: Zap,
                title: '多源协同',
                description: '完美协调光伏、储能、充电桩与电网之间的能量流动',
            },
            {
                icon: Clock,
                title: 'ECU边缘控制',
                description: '强大的边缘控制终端，实现全自动化的"源网荷储"互动',
            },
        ],
        description: '不同于传统的纯云端控制，创电云部署了强大的ECU（边缘控制终端），实现真正的边缘智能与离网自治能力。',
    },
    {
        id: 'vpp',
        icon: Radio,
        title: 'VPP 虚拟电厂',
        subtitle: '聚沙成塔，辅助服务',
        color: 'from-purple-500 to-pink-500',
        features: [
            {
                icon: Network,
                title: '资源聚合',
                description: '将分散的储能柜、充电桩与分布式光伏聚合为"虚拟电厂"',
            },
            {
                icon: BarChart3,
                title: '调峰调频',
                description: '根据电网指令灵活参与调峰调频与需求响应(DR)',
            },
            {
                icon: Zap,
                title: '第二份收益',
                description: '在峰谷套利之外，为资产持有者创造辅助服务收益',
            },
        ],
        description: '通过物联网与AI算法，将分散在各地的工商业储能柜、充电桩与分布式光伏聚合为"虚拟电厂"，参与电力市场交易。',
    },
]

export default function CoreTech() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-core-tech.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Cpu className="w-4 h-4" />
                            核心技术
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            云-边-端
                            <span className="text-gradient"> 全栈自研</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            从电芯级BMS到系统级EMS，再到聚合级VPP，创电云构建了完整的能源数字化技术栈，
                            为客户提供安全、智能、高效的能源管理解决方案。
                        </p>
                    </div>
                </div>
            </section>

            {/* 技术板块 */}
            {technologies.map((tech, index) => (
                <section
                    key={tech.id}
                    className={`section-padding ${index % 2 === 0 ? 'bg-dark-400/50' : ''}`}
                >
                    <div className="container-custom">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* 左侧文字 (偶数) 或 右侧文字 (奇数) */}
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-6`}>
                                    <tech.icon className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="heading-2 text-white mb-2">{tech.title}</h2>
                                <p className="text-primary-500 font-medium mb-4">{tech.subtitle}</p>
                                <p className="text-gray-400 leading-relaxed mb-8">{tech.description}</p>
                                <Link to="/energy-solutions" className="inline-flex items-center text-primary-500 font-medium hover:underline">
                                    查看应用案例 <ChevronRight className="w-5 h-5 ml-1" />
                                </Link>
                            </div>

                            {/* 右侧特性卡片 (偶数) 或 左侧 (奇数) */}
                            <div className={`grid gap-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                {tech.features.map((feature, fIndex) => (
                                    <div
                                        key={feature.title}
                                        className="glass-card p-6 flex items-start gap-4"
                                        style={{ animationDelay: `${fIndex * 0.1}s` }}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center flex-shrink-0`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom text-center">
                    <h2 className="heading-2 text-white mb-6">想了解更多技术细节？</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        我们的技术团队随时准备为您提供专业咨询，帮助您找到最适合的解决方案
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary">
                            联系技术顾问
                        </a>
                        <Link to="/energy-solutions" className="btn-secondary">
                            查看解决方案
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
