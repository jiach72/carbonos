import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Database, Globe, Shield, FileText, Coins, BarChart3, ChevronRight, Lock, Eye } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DigitalAssetsPage() {
    const rdaFeatures = [
        { icon: Database, title: '数据确权', description: '通过区块链存证技术，将电站与算力中心的运行数据确权为可信数据资产' },
        { icon: FileText, title: '数据入表', description: '帮助企业完成数据资产入表，增加企业净资产' },
        { icon: BarChart3, title: '数据交易', description: '在数据交易所挂牌交易，实现数据价值变现' },
    ];

    const rwaFlow = [
        { step: 1, title: '资产端', description: '优质电站/算力服务器', icon: Database },
        { step: 2, title: '数据层 (Proof of Data)', description: '利用BMS+EMS提供的不可篡改数据，证明底层资产的真实性与健康度', icon: Eye },
        { step: 3, title: '合约层', description: '智能合约自动分配每日收益，实现透明、即时的结算', icon: Lock },
        { step: 4, title: '金融层', description: '将重资产碎片化(Tokenization)，允许全球投资者共享绿色能源与AI发展的红利', icon: Coins },
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
                            <Coins className="w-4 h-4" /> 数字资产
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            链接全球 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">流动性</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            从国内RDA（资源/数据资产）到海外RWA（实物资产通证化），
                            创电云帮助企业释放数据价值，连接全球资本。
                        </p>
                    </div>
                </section>

                {/* RDA */}
                <section className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium mb-6 rounded-md">
                                    国内业务
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">RDA 资源/数据资产</h2>
                                <p className="text-blue-400 font-medium mb-6">数据即资产，入表即价值</p>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                    响应国家"数据要素×"战略，创电云通过区块链存证技术，
                                    将电站与算力中心的运行数据确权为可信数据资产。
                                </p>
                                <div className="space-y-4">
                                    {rdaFeatures.map((feature) => (
                                        <div key={feature.title} className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <feature.icon className="w-5 h-5 text-blue-400" />
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
                            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-lg font-semibold text-white mb-6">数据资产入表示例</h3>
                                    <div className="bg-slate-950/50 border border-white/5 p-5 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400">电站运行数据</span>
                                            <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">已确权</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white font-mono">¥ 2,450,000</div>
                                        <div className="text-xs text-slate-500 mt-1">预估资产价值</div>
                                    </div>
                                    <div className="bg-slate-950/50 border border-white/5 p-5 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400">算力服务数据</span>
                                            <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">已确权</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white font-mono">¥ 1,890,000</div>
                                        <div className="text-xs text-slate-500 mt-1">预估资产价值</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RWA */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium mb-6 rounded-md">
                                海外业务
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">RWA 实物资产通证化</h2>
                            <p className="text-slate-400">将重资产碎片化(Tokenization)，允许全球投资者共享绿色能源与AI发展的红利</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                            {/* Line for desktop */}
                            <div className="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0" />

                            {rwaFlow.map((item, index) => (
                                <div key={item.step} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl relative backdrop-blur-sm z-10 hover:border-amber-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-600/20">
                                            {item.step}
                                        </span>
                                        <item.icon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Values */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: '透明', desc: '区块链上的每一笔交易都可追溯', icon: Eye },
                                { title: '安全', desc: 'BMS+EMS数据作为资产健康度的真实证明', icon: Shield },
                                { title: '流动', desc: '7*24小时全球交易，即时结算', icon: Globe },
                            ].map((item) => (
                                <div key={item.title} className="bg-slate-900/20 p-6 rounded-xl text-center border border-white/5 hover:bg-slate-900/40 transition-colors">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Green Finance - NEW SECTION */}
                <section className="py-24 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border-y border-emerald-500/10">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 rounded-md">
                                🌱 生态资源变现
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">绿色金融服务</h2>
                            <p className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
                                让碳数据变成真金白银
                            </p>
                            <p className="text-slate-400">Turning Carbon Data into Cash Flow</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* 绿电/绿证交易 */}
                            <div className="bg-slate-900/50 border border-emerald-500/20 p-8 rounded-2xl hover:border-emerald-500/40 transition-colors group">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                    <Coins className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">绿电/绿证交易</h3>
                                <p className="text-slate-400 mb-6">一站式撮合与核销，连接绿电买卖双方</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        绿电采购撮合
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        绿证交易与核销
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        平台佣金 1%-3%
                                    </li>
                                </ul>
                            </div>

                            {/* CCER 开发 */}
                            <div className="bg-slate-900/50 border border-emerald-500/20 p-8 rounded-2xl hover:border-emerald-500/40 transition-colors group">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                    <FileText className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">CCER 项目开发</h3>
                                <p className="text-slate-400 mb-6">方法学匹配与项目申报，助力碳资产变现</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        方法学自动匹配
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        项目申报全流程服务
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        前期免费，落地分成 30%-50%
                                    </li>
                                </ul>
                            </div>

                            {/* 绿色信贷辅助 */}
                            <div className="bg-slate-900/50 border border-emerald-500/20 p-8 rounded-2xl hover:border-emerald-500/40 transition-colors group">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                    <BarChart3 className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">绿色信贷辅助</h3>
                                <p className="text-slate-400 mb-6">生成银行认可的 ESG/碳信用评估报告</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        建行/兴业银行标准模板
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        一键生成碳信排查报告
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        平均获得 6%-8% 利率优惠
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Green Finance CTA */}
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-6 py-3">
                                <span className="text-emerald-400 font-medium">💰 累计辅助融资 5,000+ 万元</span>
                                <Link href="/pricing">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 rounded-full">
                                        了解旗舰版
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/20 border-t border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">探索数字资产的无限可能</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            无论是数据资产入表还是RWA发行，我们的金融科技团队都能为您提供专业服务
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:contact@scdc.cloud">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/25">咨询金融方案</Button>
                            </a>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">了解我们的团队</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
