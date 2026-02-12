'use client';

import { useState, Fragment } from 'react';
import { ToggleLeft, ToggleRight, Shield, Zap, Database, Brain, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeatureFlag {
    id: string;
    name: string;
    description: string;
    category: 'core' | 'ai' | 'integration' | 'advanced';
    tiers: {
        essential: boolean;
        pro: boolean;
        enterprise: boolean;
        custom: boolean;
    };
}

const FEATURE_FLAGS: FeatureFlag[] = [
    // P0: 核心功能
    { id: 'tenant_management', name: '租户管理', description: '多租户隔离与管理', category: 'core', tiers: { essential: true, pro: true, enterprise: true, custom: true } },
    { id: 'user_management', name: '用户管理', description: '用户账号与权限管理', category: 'core', tiers: { essential: true, pro: true, enterprise: true, custom: true } },
    { id: 'organization_management', name: '组织管理', description: '企业组织架构管理', category: 'core', tiers: { essential: true, pro: true, enterprise: true, custom: true } },
    { id: 'carbon_calculation', name: '碳核算', description: '基础碳排放计算功能', category: 'core', tiers: { essential: true, pro: true, enterprise: true, custom: true } },

    // P1: AI 功能
    { id: 'ai_diagnosis', name: 'AI 诊断', description: '智能碳排诊断与建议', category: 'ai', tiers: { essential: false, pro: true, enterprise: true, custom: true } },
    { id: 'ai_analysis', name: 'AI 智算分析', description: '深度数据分析与预测', category: 'ai', tiers: { essential: false, pro: true, enterprise: true, custom: true } },
    { id: 'ai_report', name: 'AI 报告生成', description: '自动生成碳报告', category: 'ai', tiers: { essential: false, pro: false, enterprise: true, custom: true } },

    // P2: 集成功能
    { id: 'api_access', name: 'API 访问', description: '开放 API 接口', category: 'integration', tiers: { essential: false, pro: true, enterprise: true, custom: true } },
    { id: 'data_export', name: '数据导出', description: '批量数据导出', category: 'integration', tiers: { essential: true, pro: true, enterprise: true, custom: true } },
    { id: 'third_party_integration', name: '第三方集成', description: 'ERP/MES 系统对接', category: 'integration', tiers: { essential: false, pro: false, enterprise: true, custom: true } },

    // P3: 高级功能
    { id: 'pcf_calculation', name: '产品碳足迹', description: 'PCF 计算与认证', category: 'advanced', tiers: { essential: false, pro: true, enterprise: true, custom: true } },
    { id: 'green_power', name: '绿电交易', description: '绿色电力采购管理', category: 'advanced', tiers: { essential: false, pro: false, enterprise: true, custom: true } },
];

const categoryLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    core: { label: '核心功能', icon: <Shield className="w-4 h-4" />, color: 'text-emerald-400' },
    ai: { label: 'AI 能力', icon: <Brain className="w-4 h-4" />, color: 'text-purple-400' },
    integration: { label: '集成功能', icon: <Database className="w-4 h-4" />, color: 'text-cyan-400' },
    advanced: { label: '高级功能', icon: <Zap className="w-4 h-4" />, color: 'text-amber-400' },
};

const tierLabels = ['essential', 'pro', 'enterprise', 'custom'] as const;
const tierNames: Record<string, string> = {
    essential: '启航版',
    pro: '专业版',
    enterprise: '旗舰版',
    custom: '定制版',
};

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>(FEATURE_FLAGS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    const handleToggle = (flagId: string, tier: keyof FeatureFlag['tiers']) => {
        setFlags(prev => prev.map(flag => {
            if (flag.id === flagId) {
                return {
                    ...flag,
                    tiers: {
                        ...flag.tiers,
                        [tier]: !flag.tiers[tier],
                    },
                };
            }
            return flag;
        }));
        toast.success('功能开关已更新');
    };

    const filteredFlags = flags.filter(flag => {
        const matchesSearch = !searchTerm ||
            flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flag.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || flag.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // 按分类分组
    const groupedFlags = filteredFlags.reduce((acc, flag) => {
        if (!acc[flag.category]) acc[flag.category] = [];
        acc[flag.category].push(flag);
        return acc;
    }, {} as Record<string, FeatureFlag[]>);

    return (
        <div className="space-y-6">
            {/* 页头 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ToggleRight className="w-7 h-7 text-emerald-500" />
                        功能开关管理
                    </h1>
                    <p className="text-slate-400 mt-1">配置各版本的功能权限</p>
                </div>
            </div>

            {/* 统计 */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <div className="text-sm text-slate-400">总功能数</div>
                    <div className="text-2xl font-bold text-white mt-1">{flags.length}</div>
                </div>
                {tierLabels.map(tier => (
                    <div key={tier} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                        <div className="text-sm text-slate-400">{tierNames[tier]}</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">
                            {flags.filter(f => f.tiers[tier]).length}
                        </div>
                    </div>
                ))}
            </div>

            {/* 搜索和筛选 */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="搜索功能..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={filterCategory === null ? 'default' : 'outline'}
                        className={filterCategory === null ? 'bg-emerald-600 hover:bg-emerald-500' : 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'}
                        onClick={() => setFilterCategory(null)}
                    >
                        全部
                    </Button>
                    {Object.entries(categoryLabels).map(([key, { label, color }]) => {
                        const isActive = filterCategory === key;
                        const colorMap: Record<string, { active: string; inactive: string }> = {
                            core: { active: 'bg-emerald-600 hover:bg-emerald-500 text-white', inactive: 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' },
                            ai: { active: 'bg-purple-600 hover:bg-purple-500 text-white', inactive: 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10' },
                            integration: { active: 'bg-cyan-600 hover:bg-cyan-500 text-white', inactive: 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10' },
                            advanced: { active: 'bg-amber-600 hover:bg-amber-500 text-white', inactive: 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10' },
                        };
                        const styles = colorMap[key] || colorMap.core;
                        return (
                            <Button
                                key={key}
                                size="sm"
                                variant={isActive ? 'default' : 'outline'}
                                className={isActive ? styles.active : styles.inactive}
                                onClick={() => setFilterCategory(key)}
                            >
                                {label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* 功能矩阵表格 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                            <th className="p-4 w-1/3">功能</th>
                            {tierLabels.map(tier => (
                                <th key={tier} className="p-4 text-center">{tierNames[tier]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedFlags).map(([category, categoryFlags]) => (
                            <Fragment key={category}>
                                <tr key={`header-${category}`} className="bg-slate-800/30">
                                    <td colSpan={5} className="p-3">
                                        <div className={`flex items-center gap-2 font-medium ${categoryLabels[category].color}`}>
                                            {categoryLabels[category].icon}
                                            {categoryLabels[category].label}
                                        </div>
                                    </td>
                                </tr>
                                {categoryFlags.map(flag => (
                                    <tr key={flag.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{flag.name}</div>
                                            <div className="text-xs text-slate-500">{flag.description}</div>
                                        </td>
                                        {tierLabels.map(tier => (
                                            <td key={tier} className="p-4 text-center">
                                                <button
                                                    onClick={() => handleToggle(flag.id, tier)}
                                                    className="inline-flex items-center justify-center"
                                                >
                                                    {flag.tiers[tier] ? (
                                                        <ToggleRight className="w-8 h-8 text-emerald-500 hover:text-emerald-400 transition-colors" />
                                                    ) : (
                                                        <ToggleLeft className="w-8 h-8 text-slate-600 hover:text-slate-500 transition-colors" />
                                                    )}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 说明 */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm">
                <strong>注意：</strong> 功能开关修改将在下次用户登录时生效。核心功能默认对所有版本开放，请谨慎修改。
            </div>
        </div>
    );
}
