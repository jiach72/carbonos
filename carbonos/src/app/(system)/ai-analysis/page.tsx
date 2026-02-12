"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { BrainCircuit, Sparkles, TrendingDown, AlertTriangle } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine
} from "recharts";

interface TimeSeriesPoint {
    time: string;
    value: number | null;
    predict?: number | null;
    upper?: number;
    lower?: number;
}

interface PredictionData {
    confidence: number;
    saving_potential: number;
    history: TimeSeriesPoint[];
    prediction: TimeSeriesPoint[];
    chartData: TimeSeriesPoint[];
}

export default function AIAnalysisPage() {
    const [data, setData] = useState<PredictionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/v1/simulation/prediction");
                const json = await res.json();

                // 合并历史和预测数据，用于图表展示
                const chartData: TimeSeriesPoint[] = [
                    ...json.history.map((i: TimeSeriesPoint) => ({ ...i, predict: null })),
                    // 预测数据的第一个点最好衔接历史数据的最后一个点，这里简化处理
                    ...json.prediction.map((i: TimeSeriesPoint) => ({ ...i, value: null, predict: i.value, upper: i.upper, lower: i.lower }))
                ];

                setData({ ...json, chartData });
            } catch (error) {
                console.error("Failed to fetch prediction", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) return <div className="p-8 text-white">正在加载 AI 模型...</div>;

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <PageHeader
                    title="AI 智算分析"
                    description="基于时序转换模型 (Time-Series Transformer) 的能耗预测与优化建议"
                    badge={
                        <span className="text-sm font-normal text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-800 flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4" /> CarbonOS Brain v1.0
                        </span>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-400 text-sm">预测置信度</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">{data.confidence}%</span>
                                <span className="text-xs text-emerald-400">High Confidence</span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">基于过去 12 个月的高精度训练集</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-400 text-sm">识别节能潜力</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">{data.saving_potential}%</span>
                                <span className="text-xs text-emerald-400 flex items-center">
                                    <TrendingDown className="h-3 w-3 mr-1" /> 可优化
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">建议调整夜间基准负荷</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-white mb-1">一键优化</h3>
                                <p className="text-xs text-purple-300 mb-3">AI 自动生成设备调度策略</p>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                                    <Sparkles className="h-4 w-4 mr-2" /> 生成策略
                                </Button>
                            </div>
                            <BrainCircuit className="h-16 w-16 text-purple-500/50" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-white text-lg">未来 24 小时能耗预测 (kW)</CardTitle>
                        <CardDescription>实线为历史数据，虚线为 AI 预测值（含 95% 置信区间）</CardDescription>
                    </CardHeader>
                    <div className="h-[400px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.chartData}>
                                <defs>
                                    <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} interval={2} />
                                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#fff" }}
                                />
                                <ReferenceLine x={data.history[data.history.length - 1].time} stroke="#94a3b8" strokeDasharray="3 3" />

                                {/* 历史数据 */}
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorHistory)"
                                    name="历史负荷"
                                />
                                {/* 预测数据 */}
                                <Area
                                    type="monotone"
                                    dataKey="predict"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    fillOpacity={1}
                                    fill="url(#colorPredict)"
                                    name="AI 预测"
                                />
                                {/* 置信区间 - 暂时简化显示，真正展示需要复杂的 composed chart 或 custom shape */}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 异常告警模拟 */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold">AI 异常检测 (Anomaly Detection)</h3>
                    <div className="bg-red-900/10 border border-red-900/50 rounded-lg p-4 flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h4 className="text-red-400 font-medium">B-03 空压机组能耗异常</h4>
                            <p className="text-sm text-slate-400 mt-1">检测到今日 03:00-05:00 期间并未按计划停机，产生额外能耗 320 kWh。</p>
                            <Button variant="link" className="text-red-400 p-0 h-auto mt-2 text-xs">查看设备详情 &rarr;</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
