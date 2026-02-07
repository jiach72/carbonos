import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Server, Network, Cpu, Zap, Clock, BarChart3, Wrench, ChevronRight, Brain } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AIComputingPage() {
    const networkingFeatures = [
        { icon: Network, title: 'InfiniBand & RoCE', description: '基于InfiniBand与RoCE技术的无损网络架构设计' },
        { icon: Server, title: '拓扑优化', description: '针对千卡/万卡集群进行拓扑优化，消除网络拥塞' },
        { icon: Cpu, title: 'GPU利用率最大化', description: '确保GPU算力利用率最大化，降低训练成本' },
    ];

    const aiOpsFeatures = [
        { icon: BarChart3, title: 'PUE优化专家', description: '将EMS系统应用于机房温控，根据算力负载实时调节制冷功率，显著降低PUE' },
        { icon: Clock, title: '7x24h监控', description: '全天候监控告警系统，故障自愈能力，保障算力任务永不断电' },
        { icon: Wrench, title: '资产代维', description: '专业运维团队提供设备巡检、故障处理、性能调优全生命周期服务' },
    ];

    const advantages = [
        { label: '在线率保障', value: '99.99%' },
        { label: 'PUE目标', value: '< 1.25' },
        { label: '故障响应', value: '< 15分钟' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6 font-medium">
                            <Cpu className="w-4 h-4" /> AI算力服务
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            我们不仅懂电 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">更懂连接</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            提供从算力中心组网设计到智能运维的全栈服务，
                            懂能源的运维团队，帮您省下巨额电费。
                        </p>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-12 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-3 gap-8 text-center divide-x divide-white/10">
                            {advantages.map((item) => (
                                <div key={item.label}>
                                    <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">{item.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Networking */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                    <Network className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">算力中心组网</h2>
                                <p className="text-purple-400 font-medium mb-6">HPC Networking</p>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                    提供基于InfiniBand与RoCE技术的无损网络架构设计，
                                    针对千卡/万卡集群进行拓扑优化，消除网络拥塞，确保GPU算力利用率最大化。
                                </p>
                                <div className="space-y-4">
                                    {networkingFeatures.map((feature) => (
                                        <div key={feature.title} className="bg-slate-900/50 border border-white/5 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-900 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <feature.icon className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                                <p className="text-slate-400 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visual */}
                            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-semibold text-white mb-6">万卡集群架构</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                                                <Server className="w-6 h-6 text-purple-400" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between text-sm py-2 px-4 bg-black/20 rounded-lg backdrop-blur text-slate-300">
                                        <span>Spine-Leaf拓扑</span>
                                        <span className="text-purple-400 font-mono">400G IB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AIOps */}
                <section className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Dashboard Visual */}
                            <div className="lg:order-1 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl" />
                                <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                                    <h3 className="text-lg font-semibold text-white mb-6">智能运维大屏</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">实时PUE</span>
                                            <span className="text-2xl font-bold text-emerald-400">1.18</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-400">GPU利用率</span>
                                                <span className="text-white font-medium">82%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full w-[82%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                            <span className="text-slate-400">告警状态</span>
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">系统正常</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:order-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">AIOps智能运维</h2>
                                <p className="text-cyan-400 font-medium mb-6">懂能源的运维团队，帮您省下巨额电费</p>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    将EMS系统应用于机房温控，根据算力负载实时调节制冷功率，显著降低PUE。
                                    7x24h监控、故障自愈、资产代维，保障算力训练任务永不断电。
                                </p>
                                <div className="space-y-4">
                                    {aiOpsFeatures.map((feature) => (
                                        <div key={feature.title} className="bg-slate-900/50 border border-white/5 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-900 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                                <feature.icon className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                                <p className="text-slate-400 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">让绿色算力驱动您的AI未来</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            无论是新建算力中心还是现有机房优化，我们都能提供专业的解决方案
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:contact@scdc.cloud">
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-500/25">咨询算力服务</Button>
                            </a>
                            <Link href="/digital-assets">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">了解数字资产</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
