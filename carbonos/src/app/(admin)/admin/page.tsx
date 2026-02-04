"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, Leaf, Activity, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Stats {
    total_tenants: number;
    active_tenants: number;
    total_users: number;
    total_emissions: number;
}

interface TrendData {
    date: string;
    count: number;
}

interface PlanDistribution {
    name: string;
    value: number;
}

interface DashboardCharts {
    trends: TrendData[];
    distribution: PlanDistribution[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [charts, setCharts] = useState<DashboardCharts | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { "Authorization": `Bearer ${token}` };

                // Fetch stats
                const resStats = await fetch("http://localhost:8000/api/v1/admin/stats", { headers });
                if (resStats.ok) {
                    setStats(await resStats.json());
                }

                // Fetch charts
                const resCharts = await fetch("http://localhost:8000/api/v1/admin/stats/trend", { headers });
                if (resCharts.ok) {
                    setCharts(await resCharts.json());
                }

            } catch (e) {
                console.error("Failed to load dashboard data");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">运营概览</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">入驻企业总数</CardTitle>
                        <Building2 className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.total_tenants || 0}</div>
                        <p className="text-xs text-slate-300">
                            活跃企业: <span className="text-emerald-400">{stats?.active_tenants || 0}</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">平台总用户</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.total_users || 0}</div>
                        <p className="text-xs text-slate-300">SaaS 注册用户</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">总碳排放管理量</CardTitle>
                        <Leaf className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {(stats?.total_emissions || 0).toLocaleString()}
                            <span className="text-sm font-normal text-slate-300 ml-1">tCO₂e</span>
                        </div>
                        <p className="text-xs text-slate-300">跨租户聚合数据</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">系统状态</CardTitle>
                        <Activity className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">健康</div>
                        <p className="text-xs text-slate-300">所有服务正常运行中</p>
                    </CardContent>
                </Card>
            </div>

            {/* 图表可视化 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">租户增长趋势 (近6个月)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={charts?.trends || []} />
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">活跃度分布</CardTitle>
                        <CardDescription className="text-slate-300">各套餐版本占比</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlanDistributionChart data={charts?.distribution || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Recharts Components
import {
    Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

function OverviewChart({ data }: { data: TrendData[] }) {
    if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-slate-300">暂无数据</div>;

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => str.slice(5)} // Show MM only if needed, or YYYY-MM
                />
                <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    cursor={{ stroke: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

function PlanDistributionChart({ data }: { data: PlanDistribution[] }) {
    if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-slate-300">暂无数据</div>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                />
            </PieChart>
        </ResponsiveContainer>
    )
}

