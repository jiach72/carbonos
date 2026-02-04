"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { Leaf, Box, ArrowRight, Battery, Server, Sun } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    model: string;
    category: string;
    total_footprint: number;
    unit: string;
    status: string;
}

const categoryIcons: Record<string, any> = {
    "Battery": Battery,
    "Server": Server,
    "Solar": Sun,
    "default": Box
};

export default function PCFPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/v1/pcf/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <PageHeader
                    title="产品碳足迹"
                    description="基于 ISO 14067 的全生命周期碳排计算与管理"
                    badge={
                        <span className="text-sm font-normal text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            PCF Simulator
                        </span>
                    }
                >
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        + 新建产品模型
                    </Button>
                </PageHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const Icon = categoryIcons[product.category] || categoryIcons["default"];
                        return (
                            <Card key={product.id} className="bg-slate-800/60 border-slate-700 backdrop-blur-sm hover:border-emerald-500/50 transition-colors group">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                                            <Icon className="h-6 w-6 text-slate-300 group-hover:text-emerald-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                                            <CardDescription className="text-slate-500 mt-1">{product.model}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={
                                        product.status === "Certified" ? "border-emerald-500 text-emerald-400" :
                                            product.status === "Verified" ? "border-blue-500 text-blue-400" :
                                                "border-slate-500 text-slate-400"
                                    }>
                                        {product.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm text-slate-400">碳足迹总量</p>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-3xl font-bold text-white">{product.total_footprint}</span>
                                                    <span className="text-xs text-slate-500">kgCO₂e / {product.unit}</span>
                                                </div>
                                            </div>
                                            <Link href={`/pcf/${product.id}`}>
                                                <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950 px-0">
                                                    查看详情 <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>原材料阶段</span>
                                            <span>生产阶段</span>
                                            <span>运输阶段</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
