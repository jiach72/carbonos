"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Building, Calendar, Users, Activity, Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantDetail {
    id: string;
    name: string;
    code: string;
    user_count: number;
    created_at: string;
    status: string;
    plan: string;
}

export default function TenantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [tenant, setTenant] = useState<TenantDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Dialog state
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDetail = useCallback(async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/v1/admin/tenants/${params.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("加载失败");
            const data = await res.json();
            setTenant(data);
            setSelectedPlan(data.plan); // 初始化套餐选择
        } catch (e) {
            toast.error("获取租户详情失败");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) fetchDetail();
    }, [params.id, fetchDetail]);

    const handleResetPassword = async () => {
        if (!newPassword) {
            toast.error("请输入新密码");
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/v1/admin/tenants/${params.id}/reset-password`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "操作失败");
            }
            toast.success("管理员密码已重置");
            setIsResetDialogOpen(false);
            setNewPassword("");
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "操作失败");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdatePlan = async () => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/v1/admin/tenants/${params.id}/plan`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ plan: selectedPlan })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "操作失败");
            }

            const updatedTenant = await res.json();
            setTenant(updatedTenant);
            toast.success("套餐已变更");
            setIsPlanDialogOpen(false);
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "操作失败");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
    }

    if (!tenant) {
        return <div className="text-center py-20 text-slate-300">租户不存在</div>;
    }

    const getPlanName = (plan: string) => {
        switch (plan) {
            case 'free': return 'Free Plan (免费版)';
            case 'pro': return 'Pro Plan (专业版)';
            case 'enterprise': return 'Enterprise (旗舰版)';
            default: return plan;
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-slate-300 hover:text-white" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {tenant.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                            {tenant.code}
                        </Badge>
                        <Badge variant={tenant.status === 'active' ? 'default' : 'destructive'}>
                            {tenant.status === 'active' ? '运营中' : '已停用'}
                        </Badge>
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                            {tenant.plan.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="space-x-2">
                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-slate-700">
                                <Lock className="mr-2 h-4 w-4" />
                                重置密码
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                                <DialogTitle>重置管理员密码</DialogTitle>
                                <DialogDescription>
                                    这将强制重置该租户主管理员账户的密码。建议在用户遗忘密码或安全紧急情况下使用。
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">新密码</Label>
                                    <Input
                                        id="new-password"
                                        type="text"
                                        placeholder="输入新密码"
                                        className="bg-slate-800 border-slate-700 text-white"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)}>取消</Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={handleResetPassword}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    确认重置
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <CreditCard className="mr-2 h-4 w-4" />
                                变更套餐
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                                <DialogTitle>变更订阅套餐</DialogTitle>
                                <DialogDescription>
                                    调整租户的订阅等级，这将立即影响其功能权限和资源配额。
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>选择套餐</Label>
                                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue placeholder="选择套餐" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectItem value="free">Free Plan (免费版)</SelectItem>
                                            <SelectItem value="pro">Pro Plan (专业版)</SelectItem>
                                            <SelectItem value="enterprise">Enterprise (旗舰版)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsPlanDialogOpen(false)}>取消</Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={handleUpdatePlan}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    保存变更
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building className="h-4 w-4 text-emerald-500" />
                            基础信息
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-300">租户 ID</span>
                            <span className="font-mono text-sm text-slate-300">{tenant.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-300">入驻时间</span>
                            <span className="text-slate-300">{new Date(tenant.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-300">当前套餐</span>
                            <span className="text-white font-medium">{getPlanName(tenant.plan)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            资源用量 ({tenant.plan.toUpperCase()})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-300 flex items-center gap-2">
                                <Users className="h-4 w-4" /> 注册用户数
                            </span>
                            <span className="text-2xl font-bold text-white">{tenant.user_count}</span>
                        </div>
                        <div className="pt-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">API 调用限额</span>
                                <span className="text-slate-300">
                                    {tenant.plan === 'enterprise' ? 'Unlimited' : (tenant.plan === 'pro' ? '45%' : '85%')}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${tenant.plan === 'enterprise' ? 'bg-emerald-500 w-[5%]' :
                                        (tenant.plan === 'pro' ? 'bg-emerald-500 w-[45%]' : 'bg-amber-500 w-[85%]')
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">存储空间</span>
                                <span className="text-slate-300">
                                    {tenant.plan === 'free' ? '0.5GB / 1GB' : '12GB / 1TB'}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[50%] rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
