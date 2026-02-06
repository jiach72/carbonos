
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Zap, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

interface OptimizationSuggestion {
    id: string;
    title: string;
    description: string;
    impact: string;
    cost: string;
    type: string;
    score_uplift: number;
}

interface DiagnosticReport {
    health_score: number;
    analysis_date: string;
    scope_analysis: {
        scope_1: number;
        scope_2: number;
        scope_3: number;
        total: number;
    };
    top_emissions: {
        source: string;
        amount: number;
        percent: number;
    }[];
    suggestions: OptimizationSuggestion[];
    ai_summary: string;
}

export default function DiagnosticPage() {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<DiagnosticReport | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch("/api/v1/diagnostic/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    start_date: "2025-01-01",
                    end_date: "2025-01-31" // Mock range
                })
            });

            if (res.ok) {
                const data = await res.json();
                setReport(data);
                toast.success("诊断完成", {
                    description: `健康评分: ${data.health_score}`,
                });
            } else {
                toast.error("诊断失败", {
                    description: "无法连接到 AI 诊断服务",
                });
            }
        } catch (e) {
            console.error(e);
            toast.error("请求错误", {
                description: "网络连接异常",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                <PageHeader
                    title="AI 碳排诊断"
                    description="基于规则引擎与 AI 大模型，全方位分析园区碳排放健康度。"
                >
                    <Button
                        size="lg"
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        {loading ? "正在深度分析..." : "立即开始诊断"}
                    </Button>
                </PageHeader>

                {report && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in slide-in-from-bottom-5 duration-700">
                        {/* 左侧：核心指标 */}
                        <Card className="col-span-4 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>诊断综述</CardTitle>
                                <CardDescription>分析时间: {new Date(report.analysis_date).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex items-center space-x-8">
                                    <div className="relative flex items-center justify-center w-32 h-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                                            <circle
                                                cx="64" cy="64" r="60"
                                                stroke={report.health_score > 80 ? "#10b981" : report.health_score > 60 ? "#f59e0b" : "#ef4444"}
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={377}
                                                strokeDashoffset={377 - (377 * report.health_score) / 100}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-bold text-white">{report.health_score}</span>
                                            <span className="text-xs text-slate-400">健康分</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <h4 className="font-semibold text-lg text-white">AI 洞察</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                            {report.ai_summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">总排放量</p>
                                        <p className="text-2xl font-bold text-white">{report.scope_analysis.total.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO2e</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">最大排放源</p>
                                        <p className="text-lg font-medium text-white truncate">
                                            {report.top_emissions[0]?.source || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 右侧：排放结构 */}
                        <Card className="col-span-3 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>排放结构分布</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Scope 1', value: report.scope_analysis.scope_1 },
                                                    { name: 'Scope 2', value: report.scope_analysis.scope_2 },
                                                    { name: 'Scope 3', value: report.scope_analysis.scope_3 },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill={COLORS[0]} />
                                                <Cell fill={COLORS[1]} />
                                                <Cell fill={COLORS[2]} />
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(val: number | undefined) => (val ?? 0).toFixed(2)}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 底部：优化建议 */}
                        <div className="col-span-7 space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                                智能优化建议
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {report.suggestions.map((suggestion) => (
                                    <Card key={suggestion.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base text-emerald-400">{suggestion.title}</CardTitle>
                                                <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                                    +{suggestion.score_uplift}分
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-400 mb-4 h-12 line-clamp-2">
                                                {suggestion.description}
                                            </p>
                                            <div className="flex gap-2 text-xs">
                                                <span className={`px-2 py-1 rounded border ${suggestion.impact === 'High' ? 'border-red-900/50 text-red-400 bg-red-900/20' : 'border-blue-900/50 text-blue-400 bg-blue-900/20'
                                                    }`}>
                                                    影响: {suggestion.impact}
                                                </span>
                                                <span className="px-2 py-1 rounded border border-slate-700 text-slate-400 bg-slate-800/50">
                                                    成本: {suggestion.cost}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!report && !loading && (
                    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                        <Zap className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg">点击“立即开始诊断”启动 AI 分析引擎</p>
                    </div>
                )}
            </div>
        </div>
    );
}
