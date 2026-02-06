
"use client";

import { useState } from "react";
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
import { ShieldAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is installed as per previous steps

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "登录失败");
            }

            const data = await response.json();

            // Check if user is admin (Backend doesn't strictly separate endpoints yet, but we assume admin credentials)
            // Ideally backend would return role and we check it here.
            // For now, just login. logic is same.

            localStorage.setItem("access_token", data.access_token);

            toast.success("管理员登录成功", {
                description: "欢迎回来，超级管理员。",
            });

            setTimeout(() => {
                router.push("/admin");
            }, 500);

        } catch (err) {
            toast.error("登录失败", {
                description: err instanceof Error ? err.message : "请求失败",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 relative z-10 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <ShieldAlert className="h-8 w-8 text-rose-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">
                        CarbonOS Super Admin
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        仅限系统管理员访问
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                管理员账号
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="请输入管理员邮箱"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950 border-slate-800 text-white focus:ring-rose-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">
                                密码
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950 border-slate-800 text-white focus:ring-rose-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "验证权限..." : "进入控制台"}
                        </Button>
                        <Button
                            variant="link"
                            className="text-slate-500 text-sm"
                            type="button"
                            onClick={() => router.push("/")}
                        >
                            返回租户登录入口
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
