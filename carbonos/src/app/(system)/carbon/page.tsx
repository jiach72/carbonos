"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

// 模拟数据
const mockSummary = {
    total: 12345.67,
    scope1: 4500.12,
    scope2: 6789.00,
    scope3: 1056.55,
};

const mockBreakdown = [
    { type: "电力消耗", emission: 6789.00, percentage: 55 },
    { type: "固定燃烧", emission: 3200.12, percentage: 26 },
    { type: "移动燃烧", emission: 1300.00, percentage: 11 },
    { type: "制程排放", emission: 1056.55, percentage: 8 },
];

export default function CarbonAccountingPage() {
    const [generating, setGenerating] = useState(false);

    const handleGenerateReport = () => {
        setGenerating(true);
        toast.info("正在生成排放清单报告...", {
            description: "正在聚合范围 1/2/3 数据，请稍候。",
        });

        // 模拟 API 调用延迟
        setTimeout(() => {
            setGenerating(false);
            toast.success("报告生成成功！", {
                description: "ISO 14064 格式报告已保存至文档中心。",
                action: {
                    label: "立即下载",
                    onClick: () => toast("正在下载 CarbonOS_Rep_2026.pdf ...")
                },
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="碳核算"
                    description="全流程碳排放核算与报告生成"
                    className="mb-8"
                >
                    <Button
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className="bg-emerald-600 hover:bg-emerald-700 w-40"
                    >
                        {generating ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 计算中</>
                        ) : (
                            <><FileDown className="mr-2 h-4 w-4" /> 生成盘查报告</>
                        )}
                    </Button>
                </PageHeader>

                {/* 总览卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-emerald-700/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-emerald-400 text-sm">总排放量</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white">{mockSummary.total.toLocaleString()}</p>
                            <p className="text-emerald-400 text-sm">tCO₂e</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-400 text-sm">范围一（直接排放）</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-white">{mockSummary.scope1.toLocaleString()}</p>
                            <p className="text-slate-400 text-sm">tCO₂e</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-purple-400 text-sm">范围二（间接排放）</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-white">{mockSummary.scope2.toLocaleString()}</p>
                            <p className="text-slate-400 text-sm">tCO₂e</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-amber-400 text-sm">范围三（价值链）</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-white">{mockSummary.scope3.toLocaleString()}</p>
                            <p className="text-slate-400 text-sm">tCO₂e</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 排放构成 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white">排放构成</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockBreakdown.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white">{item.type}</span>
                                            <span className="text-slate-400">
                                                {item.emission.toLocaleString()} tCO₂e ({item.percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white">计算说明</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-300">
                            <div className="p-4 bg-slate-700/50 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-2">范围一（直接排放）</h4>
                                <p className="text-sm">来自企业拥有或控制的排放源，如燃料燃烧、生产过程排放</p>
                            </div>
                            <div className="p-4 bg-slate-700/50 rounded-lg">
                                <h4 className="font-semibold text-purple-400 mb-2">范围二（间接排放）</h4>
                                <p className="text-sm">来自外购电力、热力、蒸汽等能源的生产排放</p>
                            </div>
                            <div className="p-4 bg-slate-700/50 rounded-lg">
                                <h4 className="font-semibold text-amber-400 mb-2">范围三（价值链排放）</h4>
                                <p className="text-sm">来自价值链上下游的其他间接排放，如采购、运输、废弃物处理</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
