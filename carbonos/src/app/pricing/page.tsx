'use client';

import { Check, X, Zap, Building2, Factory, Crown, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

interface PricingTier {
    name: string;
    nameEn: string;
    price: string;
    priceNote: string;
    description: string;
    icon: React.ReactNode;
    features: { name: string; included: boolean }[];
    cta: string;
    ctaLink: string;
    popular?: boolean;
    gradient: string;
}

const tiers: PricingTier[] = [
    {
        name: '启航版',
        nameEn: 'Essential',
        price: '¥9,800',
        priceNote: '/年',
        description: '适合小型出口企业，快速应对 CBAM 碳关税合规',
        icon: <Factory className="w-6 h-6" />,
        gradient: 'from-slate-500 to-slate-600',
        features: [
            { name: '组织碳核算 (Excel 导入)', included: true },
            { name: '数字化调研向导', included: true },
            { name: 'CBAM 报告 (1份/月)', included: true },
            { name: '基础数据看板', included: true },
            { name: 'AI 智能诊断', included: false },
            { name: 'IoT 数据接入', included: false },
            { name: '产品碳足迹 (PCF)', included: false },
            { name: '碳-能协同控制', included: false },
        ],
        cta: '立即开通',
        ctaLink: '/diagnosis',
    },
    {
        name: '专业版',
        nameEn: 'Pro',
        price: '¥49,800',
        priceNote: '/年',
        description: '适合中型制造企业，降本增效、全面盘查',
        icon: <Building2 className="w-6 h-6" />,
        gradient: 'from-emerald-500 to-teal-600',
        popular: true,
        features: [
            { name: '组织碳核算 (Excel 导入)', included: true },
            { name: '数字化调研向导', included: true },
            { name: 'CBAM 报告 (不限)', included: true },
            { name: '基础数据看板', included: true },
            { name: 'AI 智能诊断', included: true },
            { name: 'IoT 数据接入 (10点)', included: true },
            { name: '产品碳足迹 (PCF)', included: true },
            { name: '碳-能协同控制', included: false },
        ],
        cta: '免费试用',
        ctaLink: '/diagnosis',
    },
    {
        name: '旗舰版',
        nameEn: 'Enterprise',
        price: '¥200,000',
        priceNote: '起/年',
        description: '适合工业园区、大型集团、政府客户',
        icon: <Crown className="w-6 h-6" />,
        gradient: 'from-amber-500 to-orange-600',
        features: [
            { name: '组织碳核算 (Excel 导入)', included: true },
            { name: '数字化调研向导', included: true },
            { name: 'CBAM 报告 (不限)', included: true },
            { name: '基础数据看板', included: true },
            { name: 'AI 智能诊断', included: true },
            { name: 'IoT 数据接入 (无限)', included: true },
            { name: '产品碳足迹 (PCF)', included: true },
            { name: '碳-能协同控制', included: true },
        ],
        cta: '联系销售',
        ctaLink: '/about#contact',
    },
];

const addons = [
    { name: 'AI 深度诊断报告', price: '¥2,000', unit: '/份', desc: '详尽优化建议与投资回报分析' },
    { name: '供应链协同账号', price: '¥5,000', unit: '/10个', desc: '邀请供应商填报上游碳数据' },
    { name: '额外 IoT 接入点', price: '¥500', unit: '/设备/年', desc: '超出套餐限制的设备接入' },
    { name: '绿色金融报告', price: '¥2,000', unit: '/份', desc: '银行碳信排查报告' },
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="pt-32 pb-16 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                透明定价，按需选择
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                选择适合您的
                                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                    {' '}CarbonOS™{' '}
                                </span>
                                版本
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                从 CBAM 合规到碳资产变现，我们提供全方位的零碳转型解决方案
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {tiers.map((tier, index) => (
                                <motion.div
                                    key={tier.nameEn}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative rounded-2xl ${tier.popular
                                        ? 'bg-gradient-to-b from-emerald-500/20 to-slate-900/80 border-2 border-emerald-500/50'
                                        : 'bg-slate-900/50 border border-slate-800'
                                        } backdrop-blur-sm overflow-hidden`}
                                >
                                    {tier.popular && (
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                            最受欢迎
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white`}>
                                                {tier.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                                                <p className="text-sm text-slate-500">{tier.nameEn}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className="text-4xl font-bold text-white">{tier.price}</span>
                                            <span className="text-slate-400">{tier.priceNote}</span>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6">{tier.description}</p>

                                        {/* CTA Button */}
                                        <Link href={tier.ctaLink}>
                                            <Button
                                                className={`w-full mb-6 ${tier.popular
                                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                                    : 'bg-slate-800 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {tier.cta}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>

                                        {/* Features */}
                                        <div className="space-y-3">
                                            {tier.features.map((feature) => (
                                                <div key={feature.name} className="flex items-center gap-3">
                                                    {feature.included ? (
                                                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-slate-600 flex-shrink-0" />
                                                    )}
                                                    <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Add-ons Section */}
                <section className="pb-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">增值服务</h2>
                            <p className="text-slate-400">按需购买，灵活扩展</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {addons.map((addon, index) => (
                                <motion.div
                                    key={addon.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
                                >
                                    <h3 className="text-white font-semibold mb-2">{addon.name}</h3>
                                    <div className="mb-3">
                                        <span className="text-2xl font-bold text-emerald-400">{addon.price}</span>
                                        <span className="text-slate-500 text-sm">{addon.unit}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{addon.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="pb-32 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center">
                            <Zap className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                不确定哪个版本适合您？
                            </h2>
                            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                                完成 3 分钟免费诊断，我们将根据您的业务场景推荐最合适的方案
                            </p>
                            <Link href="/diagnosis">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500">
                                    免费诊断我的零碳需求
                                    <ArrowRight className="w-5 h-5 ml-2" />
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
