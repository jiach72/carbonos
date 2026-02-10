"use client";

import { useState } from "react";
import { BarChart3, Leaf, Globe, Sun, Network, Battery, Building2, TrendingDown, CheckCircle2, Calculator, ArrowRight, MousePointer2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Slider } from "@/components/ui/slider";

// --- Components ---

function SolutionCard({ icon: Icon, title, desc, color, bg, borderColor }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        x.set(clientX - left);
        y.set(clientY - top);
    }

    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl border ${borderColor} ${bg} p-8 group`}
            onMouseMove={onMouseMove}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([newX, newY]) => `radial-gradient(600px circle at ${newX}px ${newY}px, rgba(255,255,255,0.1), transparent 40%)`
                    ),
                }}
            />
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-950/50 ${color} ring-1 ring-white/10`}>
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
        </motion.div>
    );
}

function ROISimulator() {
    const [area, setArea] = useState(50); // 1000m2
    const [elec, setElec] = useState(100); // 10000kWh

    // 计算逻辑:
    // elec 单位是"万度"（万 kWh），area 单位是"万㎡"
    // 碳排放因子: 0.5703 kgCO₂/kWh（华东电网）
    // 假设节能率: 15%（综合能源管理）
    // 减碳量(吨) = elec × 10000(kWh) × 0.5703(kg/kWh) × 15%(节能率) ÷ 1000(kg→吨)
    const savingRate = 0.15; // 15% 节能率
    const carbonFactor = 0.5703; // kgCO₂/kWh
    const carbonReduction = Math.round(elec * 10000 * carbonFactor * savingRate / 1000 * 10) / 10;
    // 节支(元) = elec × 10000(kWh) × 0.8(元/kWh 工业电价) × 15%(节能率)
    const costSavings = Math.round(elec * 10000 * 0.8 * savingRate);

    return (
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Calculator className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">零碳收益模拟器</h3>
                    <p className="text-sm text-slate-400">只需拖动滑块，预估您的园区节能潜力</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Sliders */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">园区面积 (万㎡)</span>
                            <span className="text-emerald-400 font-mono">{area} 万㎡</span>
                        </div>
                        <Slider
                            value={[area]}
                            onValueChange={(v) => setArea(v[0])}
                            max={500}
                            step={1}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">年用电量 (万度)</span>
                            <span className="text-blue-400 font-mono">{elec} 万度</span>
                        </div>
                        <Slider
                            value={[elec]}
                            onValueChange={(v) => setElec(v[0])}
                            max={1000}
                            step={10}
                            className="py-2"
                        />
                    </div>

                    <div className="pt-4 flex gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MousePointer2 className="w-3 h-3" /> 拖动滑块查看变化</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Results */}
                    <motion.div
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center text-center"
                        key={carbonReduction}
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="text-sm text-emerald-300 mb-2">预计年减碳</div>
                        <div className="text-3xl font-bold text-white mb-1">{carbonReduction}<span className="text-sm font-normal text-slate-400 ml-1">吨</span></div>
                        <div className="text-xs text-slate-500">相当于植树 {Math.round(carbonReduction * 50)} 棵</div>
                    </motion.div>

                    <motion.div
                        className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-center text-center"
                        key={costSavings}
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="text-sm text-blue-300 mb-2">预计年节支</div>
                        <div className="text-3xl font-bold text-white mb-1">{costSavings > 10000 ? (costSavings / 10000).toFixed(1) + 'w' : costSavings}<span className="text-sm font-normal text-slate-400 ml-1">元</span></div>
                        <div className="text-xs text-slate-500">基于综合能源管理</div>
                    </motion.div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8">
                    获取详细诊断报告 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}




export default function ZeroCarbonParkPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white selection:bg-emerald-500/30 font-sans">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
                        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
                        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen" />
                        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-teal-500/15 blur-[100px] rounded-full mix-blend-screen" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 backdrop-blur-md mb-8 ring-1 ring-white/10 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/20 transition-colors cursor-pointer">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2.5 animate-pulse"></span>
                                CarbonOS™ v1.0 SaaS 现已上线
                            </div>

                            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 leading-[1.1]">
                                <span className="block text-slate-200 mb-2">零碳园区解决方案</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                                    CarbonOS™ 智能中枢
                                </span>
                            </h1>

                            <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed mb-6">
                                从顶层规划、硬件建设到数字化运营，一站式零碳转型服务。
                            </p>
                            <p className="mx-auto max-w-2xl text-base text-slate-500 leading-relaxed">
                                集成源网荷储、碳核算与合规报告，助力园区跨越碳关税壁垒，抢占绿色发展先机。
                            </p>
                        </motion.div>

                        {/* 数据亮点 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-wrap items-center justify-center gap-8 mt-14"
                        >
                            <div className="text-center group cursor-default">
                                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">50+</div>
                                <div className="text-sm text-slate-500">服务园区</div>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="text-center group cursor-default">
                                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">500<span className="text-lg">MWh</span></div>
                                <div className="text-sm text-slate-500">管理资产</div>
                            </div>
                            <div className="w-px h-10 bg-slate-700" />
                            <div className="text-center group cursor-default">
                                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">30%</div>
                                <div className="text-sm text-slate-500">平均降碳</div>
                            </div>
                        </motion.div>

                        {/* ROI Simulator Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-16 max-w-4xl mx-auto"
                        >
                            <ROISimulator />
                        </motion.div>
                    </div>
                </section>

                {/* 源网荷储一体化 (Solutions) */}
                <section id="solutions" className="py-24 relative border-t border-white/5 bg-slate-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">源网荷储一体化硬件底座</h2>
                            <p className="text-slate-400 text-lg">四维一体，构建园区级能源互联网实体支撑</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SolutionCard
                                icon={Sun}
                                title="源 (Supply)"
                                desc="园区屋顶光伏全覆盖，提升绿电自给率"
                                color="text-amber-400"
                                bg="bg-amber-500/10"
                                borderColor="border-amber-500/20"
                            />
                            <SolutionCard
                                icon={Network}
                                title="网 (Grid)"
                                desc="建设园区级智能微网，实现能量内部互济与柔性互联"
                                color="text-blue-400"
                                bg="bg-blue-500/10"
                                borderColor="border-blue-500/20"
                            />
                            <SolutionCard
                                icon={Building2}
                                title="荷 (Load)"
                                desc="部署智能充电桩与高耗能设备节能改造"
                                color="text-purple-400"
                                bg="bg-purple-500/10"
                                borderColor="border-purple-500/20"
                            />
                            <SolutionCard
                                icon={Battery}
                                title="储 (Storage)"
                                desc="配置集中式共享储能电站，解决绿电消纳难题"
                                color="text-emerald-400"
                                bg="bg-emerald-500/10"
                                borderColor="border-emerald-500/20"
                            />
                        </div>
                    </div>
                </section>

                {/* 数字化碳管理平台 (Features) */}
                <section id="features" className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                                    <Globe className="w-4 h-4" /> 核心软件能力
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                    数字化碳管理平台
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    基于物联网采集与区块链存证技术，实现园区碳排放的全流程追踪与管理，
                                    助力出口型企业从容应对国际碳关税（CBAM）。
                                </p>
                                <div className="space-y-6">
                                    <FeatureItem
                                        title="能耗监测"
                                        desc="水、电、气、热全要素实时采集，生成园区能流图"
                                        icon={BarChart3}
                                    />
                                    <FeatureItem
                                        title="碳足迹追踪"
                                        desc="全生命周期追踪每一件出口产品的碳足迹，生成合规的碳盘查报告"
                                        icon={Globe}
                                    />
                                    <FeatureItem
                                        title="绿电交易"
                                        desc="协助园区企业进行绿电/绿证交易与核销，完成碳中和最后一公里"
                                        icon={Leaf}
                                    />
                                </div>
                            </div>

                            {/* Visualization Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
                                <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                        <h3 className="text-lg font-semibold text-white">碳盘查报告预览</h3>
                                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">2026年度</span>
                                    </div>

                                    <div className="space-y-6">
                                        <StatRow label="Scope 1 直接排放" value="1,234" unit="tCO₂e" color="bg-orange-500" width="w-[70%]" />
                                        <StatRow label="Scope 2 间接排放" value="2,567" unit="tCO₂e" color="bg-blue-500" width="w-[90%]" />

                                        <div className="py-2">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 绿电抵消</span>
                                                <span className="text-emerald-400 font-mono">-890 tCO₂e</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[30%] rounded-full opacity-60" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                        <div className="text-slate-400 text-sm">净排放量</div>
                                        <div className="text-3xl font-bold text-white tracking-tight">2,911 <span className="text-sm font-normal text-slate-500">tCO₂e</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 客户价值 (Values) */}
                <section id="values" className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">客户价值</h2>
                            <p className="text-slate-400">构建零碳竞争力，引领绿色发展</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Building2 className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">绿色招商</h3>
                                <p className="text-slate-400 leading-relaxed">构建零碳基础设施，吸引注重ESG的外向型与高科技企业入驻，提升园区品牌溢价。</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingDown className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">能耗双控</h3>
                                <p className="text-slate-400 leading-relaxed">通过AI智能调控与多能互补，显著降低万元GDP能耗指标，满足政府监管要求。</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Globe className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">跨越碳壁垒</h3>
                                <p className="text-slate-400 leading-relaxed">一站式完成碳盘查与认证，从容应对欧盟CBAM（碳关税）等国际贸易绿色壁垒。</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-900/10" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">准备好打造您的零碳园区了吗？</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="h-12 px-8 bg-white text-slate-900 hover:bg-slate-100 font-semibold w-full sm:w-auto">
                                获取定制方案
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}

function FeatureItem({ title, desc, icon: Icon }: any) {
    return (
        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/5">
                <Icon className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
                <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
                <p className="text-slate-400 text-sm">{desc}</p>
            </div>
        </div>
    )
}

function StatRow({ label, value, unit, color, width }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-mono">{value} {unit}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} ${width} rounded-full`} />
            </div>
        </div>
    )
}
