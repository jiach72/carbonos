"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Loader2, Building2, User, Phone, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { GeekBackground } from "@/components/auth/GeekBackground";
import { TerminalWindow } from "@/components/auth/TerminalWindow";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        admin_name: "",
        admin_email: "",
        phone: "",
        admin_password: "",
        confirmPassword: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.admin_password !== formData.confirmPassword) {
            toast.error("两次输入的密码不一致");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_name: formData.company_name,
                    admin_name: formData.admin_name,
                    admin_email: formData.admin_email,
                    phone: formData.phone,
                    admin_password: formData.admin_password
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "注册失败");
            }

            toast.success("企业入驻成功！", {
                description: "您的租户环境已创建，请登录。",
            });

            // 延迟跳转到登录页
            setTimeout(() => {
                router.push("/login?email=" + encodeURIComponent(formData.admin_email));
            }, 1000);

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-slate-950">
            {/* 左侧宣传区 */}
            <div className="relative hidden h-full flex-col bg-slate-900 p-10 text-white dark:border-r lg:flex border-r border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950" />

                {/* 极客动画背景 */}
                <GeekBackground />

                {/* 渐变遮罩，保证文字可读性 */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90" />

                <div className="relative z-20 flex flex-col h-full justify-between pt-10 pb-10">
                    {/* Header Group */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 backdrop-blur-xl">
                                <Leaf className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                CarbonOS<span className="text-emerald-500">™</span>
                            </span>
                        </div>

                        <h2 className="text-4xl font-extrabold tracking-tight leading-tight max-w-md">
                            <span className="block text-slate-100 mb-2">数字化零碳引擎</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient-x">
                                实时感知 · 智能决策
                            </span>
                        </h2>
                    </div>

                    {/* Central Terminal Display */}
                    <div className="relative w-full max-w-2xl mx-auto my-12 group">
                        {/* Glow effect behind terminal */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-lg blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                        <TerminalWindow />

                        {/* Connecting lines decoration */}
                        <div className="absolute -left-12 top-1/2 h-[1px] w-12 bg-gradient-to-r from-transparent to-emerald-500/50 hidden lg:block" />
                        <div className="absolute -right-12 top-1/2 h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500/50 hidden lg:block" />
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>系统运行中</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span>v2.0.4 Stable</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                            ID: node-suzhou-sip-01 | Latency: 12ms
                        </p>
                    </div>
                </div>
            </div>

            {/* 右侧注册表单 */}
            <div className="lg:p-8 relative z-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            企业入驻
                        </h1>
                        <p className="text-sm text-muted-foreground text-slate-400">
                            创建一个新的租户空间，开始您的零碳之旅
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-slate-300" htmlFor="company">企业/园区名称</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="company"
                                        placeholder="例如：苏州工业园区A区"
                                        type="text"
                                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="name">管理员姓名</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="name"
                                            placeholder="真实姓名"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={formData.admin_name}
                                            onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="phone">联系电话</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="phone"
                                            placeholder="手机号码"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-slate-300" htmlFor="email">管理员邮箱 (作为登录账号)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                                        value={formData.admin_email}
                                        onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-slate-300" htmlFor="password">设置密码</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                                        value={formData.admin_password}
                                        onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-slate-300" htmlFor="confirmPassword">确认密码</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="pl-9 bg-slate-900 border-slate-700 text-white"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 mt-2">
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 创建中</>
                                ) : (
                                    "确认入驻"
                                )}
                            </Button>
                        </div>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground text-slate-400">
                        已有账号？{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-emerald-400"
                        >
                            立即登录
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureRow({ title, desc }: { title: string, desc: string }) {
    return (
        <li className="flex gap-4 items-start group">
            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div>
                <h3 className="font-bold text-white text-base mb-1 group-hover:text-emerald-300 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </li>
    )
}
