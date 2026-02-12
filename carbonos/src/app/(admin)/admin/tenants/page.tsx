"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Tenant {
    id: string;
    name: string;
    code: string;
    user_count: number;
    created_at: string;
    status: string;
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTenants = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch("/api/v1/admin/tenants", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 403) {
                toast.error("权限不足", { description: "您不是超级管理员" });
                return;
            }
            if (!res.ok) throw new Error("加载失败");

            const data = await res.json();
            setTenants(data);
        } catch (e) {
            toast.error("无法加载租户列表");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/v1/admin/tenants/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("操作失败");

            toast.success(`已${newStatus === 'active' ? '启用' : '停用'}租户`);
            fetchTenants(); // Refresh
        } catch (e) {
            toast.error("操作失败，请重试");
        }
    };

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">租户管理 ({tenants.length})</h2>
                <Button onClick={fetchTenants} variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
                    <RefreshCw className="mr-2 h-4 w-4" /> 刷新
                </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">已入驻企业</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                <TableHead className="text-slate-300">公司名称</TableHead>
                                <TableHead className="text-slate-300">租户代码</TableHead>
                                <TableHead className="text-slate-300">用户数</TableHead>
                                <TableHead className="text-slate-300">入驻时间</TableHead>
                                <TableHead className="text-slate-300">状态</TableHead>
                                <TableHead className="text-slate-300 text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-500" />
                                    </TableCell>
                                </TableRow>
                            ) : tenants.map((tenant) => (
                                <TableRow key={tenant.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">{tenant.name}</TableCell>
                                    <TableCell className="font-mono text-slate-300 text-xs">{tenant.code}</TableCell>
                                    <TableCell className="text-slate-200">{tenant.user_count}</TableCell>
                                    <TableCell className="text-slate-300">
                                        {new Date(tenant.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tenant.status === "active" ? "default" : "destructive"} className="bg-emerald-600 text-white">
                                            {tenant.status === "active" ? "运营中" : "已停用"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950"
                                            onClick={() => window.location.href = `/admin/tenants/${tenant.id}`}
                                        >
                                            详情
                                        </Button>
                                        {tenant.status === 'active' ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-950"
                                                onClick={() => updateStatus(tenant.id, 'suspended')}
                                            >
                                                停用
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950"
                                                onClick={() => updateStatus(tenant.id, 'active')}
                                            >
                                                启用
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

