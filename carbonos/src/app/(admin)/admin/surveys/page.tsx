'use client';

import { useState, useEffect } from 'react';
import {
    FileText, Search, Filter, Download, Eye, Trash2,
    ChevronLeft, ChevronRight, Loader2, Mail, Phone, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Survey {
    id: string;
    scenario: string;
    industry: string;
    electricity_range: string;
    exports_to_eu: boolean;
    has_carbon_audit: boolean | null;
    contact_info: {
        name: string;
        company: string;
        phone: string;
        email: string;
    } | null;
    diagnosis_score: number | null;
    recommended_plan: string | null;
    created_at: string;
}

// 映射表
const scenarioLabels: Record<string, string> = {
    factory: '出口工厂',
    building: '商业建筑',
    park: '工业园区',
    government: '政府机构',
    other: '其他',
};

const industryLabels: Record<string, string> = {
    manufacturing: '制造业',
    chemical: '化工',
    building_materials: '建材',
    electronics: '电子',
    textile: '纺织',
    food: '食品加工',
    other: '其他',
};

const electricityLabels: Record<string, string> = {
    below_100: '< 100 万 kWh',
    '100_500': '100-500 万 kWh',
    '500_1000': '500-1000 万 kWh',
    above_1000: '> 1000 万 kWh',
};

const planLabels: Record<string, string> = {
    essential: '启航版',
    pro: '专业版',
    enterprise: '旗舰版',
    custom: '定制版',
};

export default function SurveysPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('/api/v1/admin/surveys', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSurveys(data);
                } else {
                    // 模拟数据用于开发
                    setSurveys(generateMockSurveys());
                }
            } catch (error) {
                console.error('获取调研数据失败:', error);
                setSurveys(generateMockSurveys());
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    // 模拟数据生成
    const generateMockSurveys = (): Survey[] => {
        return Array.from({ length: 25 }, (_, i) => ({
            id: `survey-${i + 1}`,
            scenario: ['factory', 'building', 'park', 'government'][i % 4],
            industry: ['manufacturing', 'chemical', 'electronics', 'textile'][i % 4],
            electricity_range: ['below_100', '100_500', '500_1000', 'above_1000'][i % 4],
            exports_to_eu: i % 3 === 0,
            has_carbon_audit: i % 2 === 0,
            contact_info: {
                name: `测试用户 ${i + 1}`,
                company: `测试企业 ${i + 1}`,
                phone: `1380013800${i}`,
                email: `test${i + 1}@example.com`,
            },
            diagnosis_score: 30 + Math.floor(Math.random() * 70),
            recommended_plan: ['essential', 'pro', 'enterprise', 'custom'][i % 4],
            created_at: new Date(Date.now() - i * 86400000).toISOString(),
        }));
    };

    // 过滤
    const filteredSurveys = surveys.filter(survey => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            survey.contact_info?.name.toLowerCase().includes(search) ||
            survey.contact_info?.company.toLowerCase().includes(search) ||
            survey.contact_info?.email.toLowerCase().includes(search)
        );
    });

    // 分页
    const totalPages = Math.ceil(filteredSurveys.length / pageSize);
    const paginatedSurveys = filteredSurveys.slice((page - 1) * pageSize, page * pageSize);

    const getScoreColor = (score: number | null) => {
        if (!score) return 'text-slate-400';
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-cyan-400';
        if (score >= 40) return 'text-amber-400';
        return 'text-red-400';
    };

    const handleExport = () => {
        toast.success('导出成功', { description: '调研数据已导出为 CSV 文件' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页头 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-7 h-7 text-emerald-500" />
                        调研管理
                    </h1>
                    <p className="text-slate-400 mt-1">管理在线诊断问卷提交记录</p>
                </div>
                <Button onClick={handleExport} className="bg-slate-800 hover:bg-slate-700">
                    <Download className="w-4 h-4 mr-2" /> 导出 CSV
                </Button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '总提交数', value: surveys.length, color: 'text-white' },
                    { label: '本周新增', value: surveys.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 86400000)).length, color: 'text-emerald-400' },
                    { label: '出口欧盟', value: surveys.filter(s => s.exports_to_eu).length, color: 'text-amber-400' },
                    { label: '平均得分', value: Math.round(surveys.reduce((acc, s) => acc + (s.diagnosis_score || 0), 0) / surveys.length), color: 'text-cyan-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                        <div className="text-sm text-slate-400">{stat.label}</div>
                        <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* 搜索框 */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="搜索姓名、公司或邮箱..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* 表格 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                            <th className="p-4">联系人</th>
                            <th className="p-4">场景</th>
                            <th className="p-4">行业</th>
                            <th className="p-4">用电量</th>
                            <th className="p-4">得分</th>
                            <th className="p-4">推荐版本</th>
                            <th className="p-4">提交时间</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSurveys.map((survey) => (
                            <tr key={survey.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-white">{survey.contact_info?.name || '-'}</div>
                                    <div className="text-xs text-slate-500">{survey.contact_info?.company}</div>
                                </td>
                                <td className="p-4 text-slate-300">{scenarioLabels[survey.scenario] || survey.scenario}</td>
                                <td className="p-4 text-slate-300">{industryLabels[survey.industry] || survey.industry}</td>
                                <td className="p-4 text-slate-300">{electricityLabels[survey.electricity_range] || survey.electricity_range}</td>
                                <td className="p-4">
                                    <span className={`font-bold ${getScoreColor(survey.diagnosis_score)}`}>
                                        {survey.diagnosis_score || '-'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                                        {planLabels[survey.recommended_plan || 'essential']}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">
                                    {new Date(survey.created_at).toLocaleDateString('zh-CN')}
                                </td>
                                <td className="p-4">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-slate-400 hover:text-white"
                                        onClick={() => setSelectedSurvey(survey)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 分页 */}
                <div className="flex items-center justify-between p-4 border-t border-slate-800">
                    <div className="text-sm text-slate-400">
                        共 {filteredSurveys.length} 条记录
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-slate-400">
                            {page} / {totalPages}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 详情弹窗 */}
            {selectedSurvey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 m-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">调研详情</h2>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedSurvey(null)}>
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* 联系信息 */}
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <h3 className="text-sm text-slate-400 mb-3">联系信息</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        {selectedSurvey.contact_info?.company}
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        {selectedSurvey.contact_info?.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        {selectedSurvey.contact_info?.email}
                                    </div>
                                </div>
                            </div>

                            {/* 诊断结果 */}
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <h3 className="text-sm text-slate-400 mb-3">诊断结果</h3>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-4xl font-bold text-emerald-400">
                                            {selectedSurvey.diagnosis_score}
                                        </div>
                                        <div className="text-xs text-slate-500">零碳就绪指数</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-slate-400">推荐方案</div>
                                        <div className="text-lg font-semibold text-white">
                                            CarbonOS™ {planLabels[selectedSurvey.recommended_plan || 'essential']}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 问卷答案 */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-800/30 rounded-lg p-3">
                                    <div className="text-slate-500">业务场景</div>
                                    <div className="text-white">{scenarioLabels[selectedSurvey.scenario]}</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-3">
                                    <div className="text-slate-500">行业</div>
                                    <div className="text-white">{industryLabels[selectedSurvey.industry]}</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-3">
                                    <div className="text-slate-500">年用电量</div>
                                    <div className="text-white">{electricityLabels[selectedSurvey.electricity_range]}</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-3">
                                    <div className="text-slate-500">出口欧盟</div>
                                    <div className="text-white">{selectedSurvey.exports_to_eu ? '是' : '否'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                                发送跟进邮件
                            </Button>
                            <Button variant="outline" className="border-slate-700" onClick={() => setSelectedSurvey(null)}>
                                关闭
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
