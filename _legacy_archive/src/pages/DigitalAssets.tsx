import { Database, Globe, Shield, FileText, Coins, BarChart3, ChevronRight, Lock, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

// RDA特性
const rdaFeatures = [
    {
        icon: Database,
        title: '数据确权',
        description: '通过区块链存证技术，将电站与算力中心的运行数据确权为可信数据资产',
    },
    {
        icon: FileText,
        title: '数据入表',
        description: '帮助企业完成数据资产入表，增加企业净资产',
    },
    {
        icon: BarChart3,
        title: '数据交易',
        description: '在数据交易所挂牌交易，实现数据价值变现',
    },
]

// RWA运作机制
const rwaFlow = [
    {
        step: 1,
        title: '资产端',
        description: '优质电站/算力服务器',
        icon: Database,
    },
    {
        step: 2,
        title: '数据层 (Proof of Data)',
        description: '利用BMS+EMS提供的不可篡改数据，证明底层资产的真实性与健康度',
        icon: Eye,
    },
    {
        step: 3,
        title: '合约层',
        description: '智能合约自动分配每日收益，实现透明、即时的结算',
        icon: Lock,
    },
    {
        step: 4,
        title: '金融层',
        description: '将重资产碎片化(Tokenization)，允许全球投资者共享绿色能源与AI发展的红利',
        icon: Coins,
    },
]

export default function DigitalAssets() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-digital-assets.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Coins className="w-4 h-4" />
                            数字资产
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            链接全球
                            <span className="text-gradient"> 流动性</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            从国内RDA（资源/数据资产）到海外RWA（实物资产通证化），
                            创电云帮助企业释放数据价值，连接全球资本。
                        </p>
                    </div>
                </div>
            </section>

            {/* 国内RDA */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
                                国内业务
                            </div>
                            <h2 className="heading-2 text-white mb-4">
                                RDA 资源/数据资产
                            </h2>
                            <p className="text-primary-500 font-medium mb-4">数据即资产，入表即价值</p>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                响应国家"数据要素×"战略，创电云通过区块链存证技术，
                                将电站与算力中心的运行数据确权为可信数据资产。
                            </p>
                            <div className="space-y-4">
                                {rdaFeatures.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="glass-card p-4 flex items-start gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 右侧数据可视化 */}
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white mb-6">数据资产入表示例</h3>
                                <div className="space-y-6">
                                    <div className="glass-card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">电站运行数据</span>
                                            <span className="text-blue-400 text-sm">已确权</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white">¥ 2,450,000</div>
                                        <div className="text-sm text-gray-500">预估资产价值</div>
                                    </div>
                                    <div className="glass-card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">算力服务数据</span>
                                            <span className="text-blue-400 text-sm">已确权</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white">¥ 1,890,000</div>
                                        <div className="text-sm text-gray-500">预估资产价值</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 海外RWA */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-6">
                            海外业务
                        </div>
                        <h2 className="heading-2 text-white mb-4">
                            RWA 实物资产通证化
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            将重资产碎片化(Tokenization)，允许全球投资者共享绿色能源与AI发展的红利
                        </p>
                    </div>

                    {/* RWA运作流程 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rwaFlow.map((item, index) => (
                            <div
                                key={item.step}
                                className="glass-card p-6 relative"
                            >
                                {/* 连接线 */}
                                {index < rwaFlow.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-transparent" />
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                                        {item.step}
                                    </span>
                                    <item.icon className="w-6 h-6 text-primary-500" />
                                </div>
                                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* 价值主张 */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: '透明', desc: '区块链上的每一笔交易都可追溯', icon: Eye },
                            { title: '安全', desc: 'BMS+EMS数据作为资产健康度的真实证明', icon: Shield },
                            { title: '流动', desc: '7*24小时全球交易，即时结算', icon: Globe },
                        ].map((item) => (
                            <div key={item.title} className="glass-card p-6 text-center">
                                <div className="w-14 h-14 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                    <item.icon className="w-7 h-7 text-amber-400" />
                                </div>
                                <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom text-center">
                    <h2 className="heading-2 text-white mb-6">探索数字资产的无限可能</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        无论是数据资产入表还是RWA发行，我们的金融科技团队都能为您提供专业服务
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary">
                            咨询金融方案
                        </a>
                        <Link to="/about" className="btn-secondary">
                            了解我们的团队 <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
