'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Leaf, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 行业排放因子 (tCO2e / 万kWh)
const EMISSION_FACTORS: Record<string, { factor: number; label: string }> = {
    manufacturing: { factor: 5.2, label: '制造业' },
    chemical: { factor: 8.1, label: '化工' },
    electronics: { factor: 3.8, label: '电子' },
    textile: { factor: 4.5, label: '纺织' },
    food: { factor: 3.2, label: '食品加工' },
    building_materials: { factor: 7.5, label: '建材' },
};

// 碳价 (EUR/tCO2e) - 欧盟 ETS 价格
const CARBON_PRICE_EUR = 85;
// 汇率 EUR -> CNY
const EUR_TO_CNY = 7.8;

// 出口地区设置
const EXPORT_REGIONS: Record<string, { taxRate: number; label: string }> = {
    eu: { taxRate: 1.0, label: '欧盟' },      // 100% CBAM 适用
    us: { taxRate: 0.0, label: '美国' },      // 暂无碳税
    asia: { taxRate: 0.0, label: '东南亚' },   // 暂无碳税
    none: { taxRate: 0.0, label: '无出口/内销' },
};

// 绿电交易预估收益 (CNY/万kWh)
const GREEN_POWER_PREMIUM = 150;

interface CalculatorResult {
    carbonEmission: number;      // 年碳排放量 (tCO2e)
    carbonTaxSaved: number;      // 预计节省碳税 (CNY)
    greenPowerRevenue: number;   // 绿电交易收益 (CNY)
    paybackYears: number;        // 投资回报期 (年)
    recommendedPlan: string;     // 推荐方案
}

export function ROICalculator() {
    const [industry, setIndustry] = useState('manufacturing');
    const [electricityUsage, setElectricityUsage] = useState('500');
    const [exportRegion, setExportRegion] = useState('eu');
    const [showResult, setShowResult] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);

    // 计算结果
    const result = useMemo<CalculatorResult | null>(() => {
        const usage = parseFloat(electricityUsage);
        if (isNaN(usage) || usage <= 0) return null;

        const emissionFactor = EMISSION_FACTORS[industry]?.factor || 5.0;
        const carbonEmission = usage * emissionFactor;

        const taxRate = EXPORT_REGIONS[exportRegion]?.taxRate || 0;
        const carbonTaxSaved = carbonEmission * CARBON_PRICE_EUR * EUR_TO_CNY * taxRate * 0.15; // 假设优化后可减排 15%

        const greenPowerRevenue = usage * GREEN_POWER_PREMIUM * 0.3; // 假设 30% 可通过绿电交易获益

        // 投资回报期计算 (假设 CarbonOS 年费 5 万)
        const annualSaving = carbonTaxSaved + greenPowerRevenue;
        const investmentCost = 50000;
        const paybackYears = annualSaving > 0 ? investmentCost / annualSaving : Infinity;

        // 推荐方案
        let recommendedPlan = '启航版';
        if (usage >= 1000 || taxRate > 0) {
            recommendedPlan = '专业版';
        }
        if (usage >= 5000) {
            recommendedPlan = '旗舰版';
        }

        return {
            carbonEmission,
            carbonTaxSaved,
            greenPowerRevenue,
            paybackYears: Math.min(paybackYears, 10),
            recommendedPlan,
        };
    }, [industry, electricityUsage, exportRegion]);

    const handleCalculate = () => {
        setShowResult(true);
    };

    const handleGetReport = () => {
        setShowLeadForm(true);
    };

    const formatCurrency = (value: number) => {
        if (value >= 10000) {
            return `¥ ${(value / 10000).toFixed(1)} 万`;
        }
        return `¥ ${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
    };

    return (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-b border-white/5">
            <div className="container px-4 sm:px-6 mx-auto">
                <div className="max-w-4xl mx-auto">
                    {/* 标题区 */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
                            <Calculator className="w-4 h-4" />
                            3 秒计算您的零碳收益
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            ROI 价值计算器
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            输入您的基本信息，即时了解采用 CarbonOS™ 的潜在收益
                        </p>
                    </div>

                    {/* 计算器表单 */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {/* 行业选择 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    行业类型
                                </label>
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                                >
                                    {Object.entries(EMISSION_FACTORS).map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 用电量 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    年用电量 (万 kWh)
                                </label>
                                <input
                                    type="number"
                                    value={electricityUsage}
                                    onChange={(e) => setElectricityUsage(e.target.value)}
                                    placeholder="500"
                                    className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                                />
                            </div>

                            {/* 出口地区 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    主要出口地区
                                </label>
                                <select
                                    value={exportRegion}
                                    onChange={(e) => setExportRegion(e.target.value)}
                                    className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                                >
                                    {Object.entries(EXPORT_REGIONS).map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 计算按钮 */}
                        {!showResult && (
                            <div className="text-center">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/25"
                                    onClick={handleCalculate}
                                >
                                    <Calculator className="w-5 h-5 mr-2" />
                                    计算潜在收益
                                </Button>
                            </div>
                        )}

                        {/* 结果展示 */}
                        {showResult && result && (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="text-center mb-6">
                                    <span className="text-slate-400 text-sm">📊 您的潜在收益</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    {/* 节省碳税 */}
                                    <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-5 text-center">
                                        <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                            {formatCurrency(result.carbonTaxSaved)}
                                        </div>
                                        <div className="text-sm text-slate-400">预计节省碳税 / 年</div>
                                    </div>

                                    {/* 绿电收益 */}
                                    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-center">
                                        <Leaf className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                            {formatCurrency(result.greenPowerRevenue)}
                                        </div>
                                        <div className="text-sm text-slate-400">绿电交易收益 / 年</div>
                                    </div>

                                    {/* 投资回报期 */}
                                    <div className="bg-slate-800/50 border border-amber-500/20 rounded-xl p-5 text-center">
                                        <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                            {result.paybackYears.toFixed(1)} 年
                                        </div>
                                        <div className="text-sm text-slate-400">投资回报期</div>
                                    </div>
                                </div>

                                {/* 推荐方案 */}
                                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <div className="text-slate-400 text-sm mb-1">推荐方案</div>
                                        <div className="text-xl font-bold text-white">
                                            CarbonOS™ {result.recommendedPlan}
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1">
                                            年碳排放: {result.carbonEmission.toFixed(0)} tCO₂e
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="h-12 px-6 bg-white hover:bg-slate-100 text-slate-900 rounded-full"
                                        onClick={handleGetReport}
                                    >
                                        获取完整诊断报告 <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>

                                {/* Lead Capture 表单 (简化版) */}
                                {showLeadForm && (
                                    <div className="mt-6 bg-slate-800/50 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            留下联系方式，获取详细报告
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                placeholder="姓名"
                                                className="h-12 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                            <input
                                                type="text"
                                                placeholder="公司名称"
                                                className="h-12 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="手机号码"
                                                className="h-12 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                            <input
                                                type="email"
                                                placeholder="邮箱"
                                                className="h-12 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            />
                                        </div>
                                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                                            提交并获取报告
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 底部说明 */}
                    <p className="text-center text-xs text-slate-500 mt-4">
                        * 以上数据为基于行业平均值的估算结果，实际收益可能因具体情况而异。
                    </p>
                </div>
            </div>
        </section>
    );
}
