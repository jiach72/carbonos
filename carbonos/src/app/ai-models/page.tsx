'use client';

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Pill, TrendingUp, Battery, Wheat, Brain, Sparkles, Database, Cpu, Zap, Server, ChevronRight, Shield, Clock, Users, LineChart, Layers, Target, Award, CheckCircle } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from 'react';

// 动态数字计数组件
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState('0');
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateValue();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateValue = () => {
        // 提取数字部分
        const numericMatch = value.match(/[\d,]+/);
        if (!numericMatch) {
            setDisplayValue(value);
            return;
        }

        const numericStr = numericMatch[0].replace(/,/g, '');
        const targetNum = parseInt(numericStr, 10);
        const prefix = value.slice(0, value.indexOf(numericMatch[0]));
        const suffixPart = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);

        const duration = 1500; // 动画持续时间
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            const progress = current / steps;
            // 缓动函数 - easeOutExpo
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(targetNum * easeProgress);

            // 格式化数字（添加千分位）
            const formattedValue = currentValue.toLocaleString();
            setDisplayValue(prefix + formattedValue + suffixPart);

            if (current >= steps) {
                clearInterval(timer);
                setDisplayValue(value); // 确保最终值精确
            }
        }, stepDuration);
    };

    return <div ref={ref}>{displayValue}{suffix}</div>;
}

export default function AIModelsPage() {
    // AI 大模型训练服务 - 行业解决方案
    const aiTrainingServices = [
        {
            icon: Pill,
            title: '医药大模型',
            subtitle: 'Pharma AI',
            description: '基于海量临床与分子数据，加速药物研发全生命周期',
            features: [
                '药物分子设计与虚拟筛选',
                '蛋白质结构预测（AlphaFold级）',
                '临床试验数据智能分析',
                '药物相互作用预测',
            ],
            useCases: ['新药研发加速', '基因组学分析', 'AI辅助诊断'],
            stats: { value: '70%', label: '研发周期缩短' },
            color: 'emerald'
        },
        {
            icon: TrendingUp,
            title: '金融大模型',
            subtitle: 'FinTech AI',
            description: '实时风险感知与智能决策，驱动金融业务创新',
            features: [
                '实时风险评估引擎',
                '量化交易策略训练',
                '反欺诈智能检测',
                '市场趋势预测分析',
            ],
            useCases: ['智能风控', '量化策略', '反欺诈'],
            stats: { value: '99.9%', label: '风险识别率' },
            color: 'amber'
        },
        {
            icon: Battery,
            title: '新能源大模型',
            subtitle: 'Energy AI',
            description: '精准预测与智能调度，最大化清洁能源利用效率',
            features: [
                '光伏/风电功率预测',
                '电网负荷智能调度',
                'V2G车网互动优化',
                '储能策略智能决策',
            ],
            useCases: ['发电预测', '智能调度', '电力交易'],
            stats: { value: '15%', label: '能效提升' },
            color: 'sky'
        },
        {
            icon: Wheat,
            title: '农业育种大模型',
            subtitle: 'AgriTech AI',
            description: '智慧育种与精准农业，保障国家粮食安全',
            features: [
                '基因组分析与选择',
                '育种方案智能优化',
                '产量品质预测模型',
                '病虫害智能诊断',
            ],
            useCases: ['智慧育种', '产量预测', '精准农业'],
            stats: { value: '3x', label: '育种效率提升' },
            color: 'lime'
        },
    ];

    const stats = [
        { value: '200+', label: '服务企业', icon: Users },
        { value: '5,000+', label: '模型训练任务', icon: Layers },
        { value: '10,000+', label: 'GPU 集群规模', icon: Cpu },
        { value: 'PB级', label: '数据处理量', icon: Database },
    ];

    const advantages = [
        {
            icon: Shield,
            title: '数据安全合规',
            description: '等保三级认证、私有化部署、数据全程加密，满足医疗金融等高敏感行业合规要求',
        },
        {
            icon: Clock,
            title: '快速交付能力',
            description: '从需求对接到模型上线平均仅需 2-4 周，支持敏捷迭代与持续优化',
        },
        {
            icon: LineChart,
            title: '全链路服务',
            description: '数据治理→模型开发→训练调优→部署运维，端到端专业服务团队',
        },
    ];

    const process = [
        { step: '01', title: '需求调研', desc: '深入理解业务场景与数据现状' },
        { step: '02', title: '方案设计', desc: '定制化模型架构与训练策略' },
        { step: '03', title: '数据准备', desc: '数据清洗、标注与特征工程' },
        { step: '04', title: '模型训练', desc: '大规模分布式训练与调优' },
        { step: '05', title: '评估验证', desc: '多维度性能测试与效果评估' },
        { step: '06', title: '部署上线', desc: '生产环境部署与监控运维' },
    ];

    const certifications = [
        '等保三级认证',
        'ISO 27001',
        'SOC 2 Type II',
        'GDPR 合规',
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-purple-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-amber-600/10 blur-[150px] rounded-full opacity-60 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-8 font-medium">
                            <Brain className="w-4 h-4" /> 行业垂直大模型解决方案
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            赋能 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">垂直行业</span> AI 创新
                        </h1>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
                            依托创电云万卡 GPU 集群与专业 AI 工程团队，为医药、金融、新能源、农业等战略性产业
                            提供从数据治理到模型部署的全链路大模型训练服务，加速行业智能化转型。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:ai@scdc.cloud">
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/25 px-8">
                                    预约咨询
                                </Button>
                            </a>
                            <Link href="#solutions">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">
                                    查看解决方案
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats - 动态数字 */}
                <section className="py-16 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((item) => (
                                <div key={item.label} className="text-center group">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                                        <item.icon className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                                        <AnimatedCounter value={item.value} />
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Solutions */}
                <section id="solutions" className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">行业解决方案</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                针对不同行业特点，提供定制化的大模型训练与部署方案
                            </p>
                        </div>

                        <div className="space-y-8">
                            {aiTrainingServices.map((service, index) => {
                                const colorMap = {
                                    emerald: { bg: 'from-emerald-500 to-teal-500', bgLight: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20' },
                                    amber: { bg: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20' },
                                    sky: { bg: 'from-sky-500 to-blue-500', bgLight: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', shadow: 'shadow-sky-500/20' },
                                    lime: { bg: 'from-lime-500 to-green-500', bgLight: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/20', shadow: 'shadow-lime-500/20' },
                                } as const;
                                const colors = colorMap[service.color as keyof typeof colorMap];

                                return (
                                    <div key={service.title} className={`${colors.bgLight} border ${colors.border} rounded-3xl p-8 lg:p-10 hover:bg-slate-900/30 transition-all duration-300`}>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                            {/* 左侧：标题与描述 */}
                                            <div className="lg:col-span-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.shadow}`}>
                                                        <service.icon className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                                                        <p className={`text-sm font-medium ${colors.text}`}>{service.subtitle}</p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 leading-relaxed mb-6">{service.description}</p>
                                                <div className={`inline-flex items-center gap-3 px-4 py-3 ${colors.bgLight} border ${colors.border} rounded-xl`}>
                                                    <div className={`text-3xl font-bold ${colors.text}`}>{service.stats.value}</div>
                                                    <div className="text-slate-400 text-sm">{service.stats.label}</div>
                                                </div>
                                            </div>

                                            {/* 中间：核心能力 */}
                                            <div className="lg:col-span-1">
                                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                    <Target className={`w-4 h-4 ${colors.text}`} /> 核心能力
                                                </h4>
                                                <div className="space-y-3">
                                                    {service.features.map((feature) => (
                                                        <div key={feature} className="flex items-start gap-3">
                                                            <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                            <span className="text-slate-300 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 右侧：应用场景 */}
                                            <div className="lg:col-span-1">
                                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                    <Sparkles className={`w-4 h-4 ${colors.text}`} /> 典型场景
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.useCases.map((uc) => (
                                                        <span key={uc} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm">
                                                            {uc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Why Us */}
                <section className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">为什么选择创电云</h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                专业的算力基础设施与 AI 工程团队，为您的大模型训练保驾护航
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {advantages.map((item) => (
                                <div key={item.title} className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center hover:border-purple-500/30 transition-colors group">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition-colors">
                                        <item.icon className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* 资质认证 */}
                        <div className="mt-16 text-center">
                            <p className="text-slate-500 text-sm mb-6">安全资质认证</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {certifications.map((cert) => (
                                    <div key={cert} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm flex items-center gap-2">
                                        <Award className="w-4 h-4 text-purple-400" />
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">服务流程</h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                从需求到上线，全程专业团队陪伴
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {process.map((item, index) => (
                                <div key={item.step} className="text-center group">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 group-hover:border-purple-500/60 transition-colors">
                                        <span className="text-purple-400 font-bold">{item.step}</span>
                                    </div>
                                    <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                                    <p className="text-slate-500 text-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-y border-purple-500/20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">开启您的 AI 模型训练之旅</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            无论是算法研发还是模型部署，我们都能提供专业的算力支撑与技术服务
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:ai@scdc.cloud">
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/25 px-8">
                                    预约咨询
                                </Button>
                            </a>
                            <Link href="/ai-computing">
                                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full">
                                    了解算力基础设施 <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
