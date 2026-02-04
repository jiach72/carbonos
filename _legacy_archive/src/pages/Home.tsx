import { ArrowRight, Battery, Cpu, Leaf, Coins, ChevronRight, BarChart3, Building2, Factory } from 'lucide-react'
import { Link } from 'react-router-dom'

// 业务矩阵数据
const businessMatrix = [
    {
        icon: Cpu,
        title: '软件引擎',
        keywords: ['EMS/BMS智能控制', '虚拟电厂聚合'],
        description: '云-边-端全栈自研，毫秒级响应保障系统安全',
        link: '/core-tech',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Leaf,
        title: '零碳园区',
        keywords: ['源网荷储一体化', '碳足迹追踪'],
        description: '一站式解决方案助力企业跨越碳关税壁垒',
        link: '/zero-carbon',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Battery,
        title: 'AI基建',
        keywords: ['绿色算力', '99.99%在线率'],
        description: '懂能源的运维团队，PUE优化专家',
        link: '/ai-computing',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Coins,
        title: '金融赋能',
        keywords: ['RWA实物上链', '数据资产入表'],
        description: '链接全球流动性，碎片化投资绿色资产',
        link: '/digital-assets',
        color: 'from-amber-500 to-orange-500',
    },
]

// 信任数据
const trustData = [
    { label: '管理资产规模', value: '500+', unit: 'MWh' },
    { label: '累计减排', value: '10,000+', unit: '吨 CO₂' },
    { label: '服务企业', value: '50+', unit: '家' },
]

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* 视频背景 */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        poster="/hero-home.png"
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                        {/* 视频加载失败时显示图片作为fallback */}
                    </video>
                    <div className="absolute inset-0 bg-dark-500/60" />
                    {/* 渐变光晕 */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container-custom relative z-10 pt-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* 标签 */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-8 animate-fade-in">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                            新能源 × 数字化 × 金融科技
                        </div>

                        {/* 主标题 */}
                        <h1 className="heading-1 text-white mb-6 animate-slide-up">
                            绿色能源驱动
                            <span className="text-gradient block mt-2">智算未来</span>
                        </h1>

                        {/* 副标题 */}
                        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            云-边-端全栈自研，打造"能源 + 算力 + 金融"的数字化闭环
                        </p>

                        {/* CTA 按钮 */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/energy-solutions" className="btn-primary text-base">
                                了解解决方案
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/about" className="btn-secondary text-base">
                                关于我们
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 向下滚动提示 - 鼠标滚轮动画 */}
                <a
                    href="#business-matrix"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer z-20"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('business-matrix')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5 group-hover:border-primary-500 transition-colors duration-300">
                        <div className="w-1 h-1.5 bg-white rounded-full animate-scroll-down group-hover:bg-primary-500 transition-colors duration-300" />
                    </div>
                </a>
            </section>

            {/* 业务矩阵 */}
            <section id="business-matrix" className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="heading-2 text-white mb-4">四大业务矩阵</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            从能源管理到数字资产，构建完整的绿色价值闭环
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {businessMatrix.map((item, index) => (
                            <Link
                                key={item.title}
                                to={item.link}
                                className="glass-card-hover p-6 group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* 图标 */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* 标题 */}
                                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>

                                {/* 关键词标签 */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.keywords.map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>

                                {/* 描述 */}
                                <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                                {/* 了解更多 */}
                                <div className="flex items-center text-primary-500 text-sm font-medium transition-transform duration-300 group-hover:translate-x-2">
                                    了解更多 <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 数据信任背书 */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-300/5" />

                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* 左侧文字 */}
                        <div>
                            <h2 className="heading-2 text-white mb-6">
                                值得信赖的
                                <span className="text-gradient"> 能源数字化</span>
                                伙伴
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                创电云深耕新能源与数字化交叉领域，通过自研的 BMS/EMS 系统、
                                虚拟电厂平台以及区块链存证技术，为企业提供从资产运营到价值变现的全链路服务。
                            </p>
                            <Link to="/about" className="btn-primary">
                                了解更多 <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* 右侧数据卡片 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {trustData.map((item, index) => (
                                <div
                                    key={item.label}
                                    className="glass-card p-6 text-center"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-primary-500 mb-1">{item.unit}</div>
                                    <div className="text-sm text-gray-500">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 应用场景 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="heading-2 text-white mb-4">多元应用场景</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            从工商业储能到零碳园区，全方位满足企业绿色转型需求
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Factory,
                                title: '工商业储能',
                                description: '智能峰谷套利，降本增效',
                            },
                            {
                                icon: Building2,
                                title: '智慧园区',
                                description: '源网荷储一体化解决方案',
                            },
                            {
                                icon: BarChart3,
                                title: 'AI算力中心',
                                description: 'PUE优化，绿电供给',
                            },
                        ].map((scene, index) => (
                            <div
                                key={scene.title}
                                className="glass-card-hover p-8 text-center"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6">
                                    <scene.icon className="w-8 h-8 text-primary-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-3">{scene.title}</h3>
                                <p className="text-gray-400 text-sm">{scene.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10" />

                <div className="container-custom relative z-10 text-center">
                    <h2 className="heading-2 text-white mb-6">
                        开启您的绿色数字化旅程
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                        无论您是电站业主、园区运营者还是算力投资人，我们都能为您提供定制化解决方案
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:contact@scdc.cloud" className="btn-primary text-base">
                            立即咨询
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link to="/core-tech" className="btn-secondary text-base">
                            查看技术方案
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
