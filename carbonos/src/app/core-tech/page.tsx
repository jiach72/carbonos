import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Battery, Cpu, Radio, Shield, Zap, Clock, Network, BarChart3, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoreTechPage() {
    const technologies = [
        {
            id: 'bms',
            icon: Battery,
            title: 'BMS 电池管理系统',
            subtitle: '三级架构，毫秒级安全',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            features: [
                { icon: Shield, title: '毫秒级响应', description: '故障发生时，系统可在10ms内切断回路，防止热失控蔓延' },
                { icon: BarChart3, title: '主动均衡', description: '智能调节电芯一致性，延长电池组使用寿命20%以上' },
                { icon: Cpu, title: '三级分层架构', description: '"模组-电池簇-电池堆"三级架构，精准监控每一颗电芯' },
            ],
            description: '创电云自研BMS采用"模组-电池簇-电池堆"三级分层架构。通过高精度传感器与AI算法，实时监测单体电芯电压、温差与绝缘阻抗。',
        },
        {
            id: 'ems',
            icon: Cpu,
            title: 'EMS 能源管理系统',
            subtitle: '边缘智能，离网自治',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            features: [
                { icon: Network, title: '弱网生存', description: '即使在网络中断的极端环境下，本地策略依然保障微网稳定运行' },
                { icon: Zap, title: '多源协同', description: '完美协调光伏、储能、充电桩与电网之间的能量流动' },
                { icon: Clock, title: 'ECU边缘控制', description: '强大的边缘控制终端，实现全自动化的"源网荷储"互动' },
            ],
            description: '不同于传统的纯云端控制，创电云部署了强大的ECU（边缘控制终端），实现真正的边缘智能与离网自治能力。',
        },
        {
            id: 'vpp',
            icon: Radio,
            title: 'VPP 虚拟电厂',
            subtitle: '聚沙成塔，辅助服务',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            features: [
                { icon: Network, title: '资源聚合', description: '将分散的储能柜、充电桩与分布式光伏聚合为"虚拟电厂"' },
                { icon: BarChart3, title: '调峰调频', description: '根据电网指令灵活参与调峰调频与需求响应(DR)' },
                { icon: Zap, title: '第二份收益', description: '在峰谷套利之外，为资产持有者创造辅助服务收益' },
            ],
            description: '通过物联网与AI算法，将分散在各地的工商业储能柜、充电桩与分布式光伏聚合为"虚拟电厂"，参与电力市场交易。',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6 font-medium">
                            <Cpu className="w-4 h-4" /> 核心技术栈
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            云-边-端 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">全栈自研</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            从电芯级BMS到系统级EMS，再到聚合级VPP，创电云构建了完整的能源数字化技术栈，
                            为客户提供安全、智能、高效的能源管理解决方案。
                        </p>
                    </div>
                </section>

                {/* Tech Sections */}
                {technologies.map((tech, index) => (
                    <section key={tech.id} className={`py-20 border-t border-white/5 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}>
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className={`w-16 h-16 rounded-2xl ${tech.bg} flex items-center justify-center mb-6`}>
                                        <tech.icon className={`w-8 h-8 ${tech.color}`} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{tech.title}</h2>
                                    <p className={`text-lg font-medium mb-6 ${tech.color}`}>{tech.subtitle}</p>
                                    <p className="text-slate-400 leading-relaxed mb-8">{tech.description}</p>
                                    <Link href="/energy-solutions">
                                        <Button variant="link" className={`p-0 h-auto text-base ${tech.color} hover:text-white`}>
                                            查看应用案例 <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    {tech.features.map((feature, i) => (
                                        <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-xl flex gap-4 hover:border-white/10 transition-colors">
                                            <div className={`w-10 h-10 rounded-lg ${tech.bg} flex items-center justify-center flex-shrink-0`}>
                                                <feature.icon className={`w-5 h-5 ${tech.color}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* CTA */}
                <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/20 border-t border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">想了解更多技术细节？</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            我们的技术团队随时准备为您提供专业咨询，帮助您找到最适合的解决方案
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:contact@scdc.cloud">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/25">联系技术顾问</Button>
                            </a>
                            <Link href="/energy-solutions">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">查看解决方案</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
