"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2, Building2, User, Phone, Mail, Lock } from "lucide-react";
import { GeekBackground } from "@/components/auth/GeekBackground";
import { TerminalWindow } from "@/components/auth/TerminalWindow";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 登录表单
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // 注册表单
    const [registerData, setRegisterData] = useState({
        company_name: "",
        admin_name: "",
        admin_email: "",
        phone: "",
        admin_password: "",
        confirmPassword: "",
    });

    // 处理登录
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "登录失败");
            }

            const data = await response.json();

            // 检查是否为超级管理员
            if (data.role === "admin" && !data.tenant_id) {
                localStorage.setItem("access_token", data.access_token);
                toast.success("欢迎回来，超级管理员", {
                    description: "正在进入管理后台...",
                });
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 500);
                return;
            }

            localStorage.setItem("access_token", data.access_token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err instanceof Error ? err.message : "登录失败");
        } finally {
            setIsLoading(false);
        }
    };

    // 处理注册
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.admin_password !== registerData.confirmPassword) {
            toast.error("两次输入的密码不一致");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_name: registerData.company_name,
                    admin_name: registerData.admin_name,
                    admin_email: registerData.admin_email,
                    phone: registerData.phone,
                    admin_password: registerData.admin_password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "注册失败");
            }

            toast.success("企业入驻成功！", {
                description: "您的租户环境已创建，请登录。",
            });

            // 切换到登录并填入邮箱
            setLoginData({ ...loginData, email: registerData.admin_email });
            setIsLogin(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "注册失败");
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
                                <span>v1.0 Stable</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                            ID: node-suzhou-sip-01 | Latency: 12ms
                        </p>
                    </div>
                </div>
            </div>

            {/* 右侧表单区 */}
            <div className="lg:p-8 relative z-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            {isLogin ? "登录账户" : "企业入驻"}
                        </h1>
                        <p className="text-sm text-muted-foreground text-slate-400">
                            {isLogin
                                ? "欢迎回来，请输入您的账户信息"
                                : "创建一个新的租户空间，开始您的零碳之旅"}
                        </p>
                    </div>

                    {isLogin ? (
                        // 登录表单
                        <form onSubmit={handleLogin}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="email">
                                        邮箱
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="email"
                                            placeholder="请输入邮箱"
                                            type="email"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="password">
                                        密码
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="请输入密码"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                )}

                                <Button
                                    disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-700 mt-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登录中
                                        </>
                                    ) : (
                                        "登录"
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        // 注册表单
                        <form onSubmit={handleRegister}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="company">
                                        企业/园区名称
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="company"
                                            placeholder="例如：苏州工业园区A区"
                                            type="text"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={registerData.company_name}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    company_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-slate-300" htmlFor="name">
                                            管理员姓名
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                id="name"
                                                placeholder="真实姓名"
                                                className="pl-9 bg-slate-900 border-slate-700 text-white"
                                                value={registerData.admin_name}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        admin_name: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-slate-300" htmlFor="phone">
                                            联系电话
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                id="phone"
                                                placeholder="手机号码"
                                                className="pl-9 bg-slate-900 border-slate-700 text-white"
                                                value={registerData.phone}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="regEmail">
                                        管理员邮箱 (作为登录账号)
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="regEmail"
                                            placeholder="name@example.com"
                                            type="email"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={registerData.admin_email}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    admin_email: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="regPassword">
                                        设置密码
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="regPassword"
                                            type="password"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={registerData.admin_password}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    admin_password: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-slate-300" htmlFor="confirmPassword">
                                        确认密码
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            className="pl-9 bg-slate-900 border-slate-700 text-white"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                )}

                                <Button
                                    disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-700 mt-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 创建中
                                        </>
                                    ) : (
                                        "确认入驻"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    <p className="px-8 text-center text-sm text-muted-foreground text-slate-400">
                        {isLogin ? "还没有账户？" : "已有账号？"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError("");
                            }}
                            className="underline underline-offset-4 hover:text-emerald-400"
                        >
                            {isLogin ? "立即入驻" : "立即登录"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
