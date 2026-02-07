"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
            const body = isLogin
                ? { email, password }
                : { email, password, full_name: fullName };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "请求失败");
            }

            const data = await response.json();

            if (isLogin) { // 登录成功
                // 检查是否为超级管理员 (无租户ID且角色为admin)
                if (data.role === 'admin' && !data.tenant_id) {
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
            } else {
                // 注册成功，切换到登录
                setIsLogin(true);
                setError("");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "请求失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">
                        CarbonOS™
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {isLogin ? "登录您的账户" : "创建新账户"}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-300">
                                    姓名
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="请输入姓名"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                邮箱
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="请输入邮箱"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-700/50 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">
                                密码
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="请输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-700/50 border-slate-600 text-white"
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-6 pt-6">
                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                            disabled={loading}
                        >
                            {loading ? "处理中..." : isLogin ? "登录" : "注册"}
                        </Button>
                        <p className="text-slate-400 text-sm text-center">
                            {isLogin ? "还没有账户？" : "已有账户？"}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-emerald-500 hover:text-emerald-400 ml-1"
                            >
                                {isLogin ? "立即注册" : "立即登录"}
                            </button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
