"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUp, Leaf, Zap, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import apiClient from "@/lib/api-client";

// 动态导入图表组件以避免 SSR Hydration Mismatch
const EmissionTrendChart = dynamic(
    () => import("@/components/dashboard/charts/Charts").then((mod) => mod.EmissionTrendChart),
    { ssr: false }
);
const EmissionDistributionChart = dynamic(
    () => import("@/components/dashboard/charts/Charts").then((mod) => mod.EmissionDistributionChart),
    { ssr: false }
);

const distributionData = [
    { name: "范围一", value: 400, color: "#3b82f6" },
    { name: "范围二", value: 700, color: "#10b981" },
    { name: "范围三", value: 300, color: "#f59e0b" },
];

export default function DashboardPage() {
    // 实时概览数据
    const [summary, setSummary] = useState({
        total_emission: 0,
        emission_trend: -12.5, // 模拟值
        total_cost: 0,
        year_progress: 35.6,
        // 新增实时指标
        current_load: 0,
        solar_power: 0,
        realtime_carbon: 0
    });

    interface TrendPoint {
        name: string;
        value: number;
    }

    // 趋势图表数据
    const [trendData, setTrendData] = useState<TrendPoint[]>([]);

    // 获取实时数据 (每 3 秒刷新)
    useEffect(() => {
        const fetchRealtime = async () => {
            try {
                const data = await apiClient.get<{
                    carbon: { today_total: number; realtime_emission: number };
                    power: { load: number; solar: number };
                }>("/api/v1/simulation/realtime");

                setSummary(prev => ({
                    ...prev,
                    total_emission: data.carbon.today_total,
                    current_load: data.power.load,
                    solar_power: data.power.solar,
                    realtime_carbon: data.carbon.realtime_emission,
                    total_cost: Math.round(data.carbon.today_total * 45.5),
                }));
            } catch (error) {
                console.error("实时数据获取失败", error);
            }
        };

        fetchRealtime();
        const interval = setInterval(fetchRealtime, 3000);
        return () => clearInterval(interval);
    }, []);

    // 获取历史趋势 (加载时一次)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await apiClient.get<{ time: string; value: number }[]>("/api/v1/simulation/history?days=1");
                const formatted: TrendPoint[] = data.map((item) => ({
                    name: item.time.split(" ")[1],
                    value: item.value
                }));
                formatted.sort((a, b) => parseInt(a.name) - parseInt(b.name));
                setTrendData(formatted);
            } catch (error) {
                console.error("历史数据获取失败", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <PageHeader
                    title="仪表盘"
                    description="实时监控园区碳排放与能源消耗情况"
                    badge={
                        <span className="text-sm font-normal text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-800 animate-pulse">
                            ● 实时监控中
                        </span>
                    }
                />

                {/* 核心指标卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">今日累计碳排</p>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-3xl font-bold text-white">
                                            {summary.total_emission.toLocaleString()}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-500">kgCO₂e</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                    <Leaf className="h-6 w-6 text-indigo-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-slate-400">
                                实时排放速率: <span className="text-white ml-1 font-bold">{summary.realtime_carbon}</span> kg/h
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">实时负荷</p>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-3xl font-bold text-white">
                                            {summary.current_load.toLocaleString()}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-500">kW</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-amber-400" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-slate-500">
                                光伏发电: <span className="text-emerald-400 font-bold">{summary.solar_power}</span> kW
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">预估能源费用</p>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-3xl font-bold text-white">
                                            {summary.total_cost.toLocaleString()}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-500">CNY</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-emerald-400" />
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-slate-700 rounded-full h-1.5">
                                <div
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${summary.year_progress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">能耗强度</p>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-3xl font-bold text-white">0.45</span>
                                        <span className="ml-2 text-xs text-slate-500">tCO₂e/万元</span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <Target className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-emerald-400">
                                优于行业水平 12%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 图表区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 排放趋势（面积图） */}
                    <Card className="col-span-2 bg-slate-800/50 border-slate-700 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">24小时负荷趋势 (Real-time)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EmissionTrendChart data={trendData} />
                        </CardContent>
                    </Card>

                    {/* 排放构成（环形图） */}
                    <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">排放范围分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EmissionDistributionChart data={distributionData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
