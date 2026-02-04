"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Lock, User, Globe } from "lucide-react";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [allowSelfRegistration, setAllowSelfRegistration] = useState(true);

    // 模拟数据 (V2.1 暂时不调后端，因为 User Update API 还没专门给 Admin 写)
    const [formData, setFormData] = useState({
        email: "admin@scdc.cloud",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [aiConfig, setAiConfig] = useState({
        ai_api_key: "",
        ai_api_base: "",
        ai_model: ""
    });
    const [aiSaving, setAiSaving] = useState(false);

    // ... (existing state)

    // 加载平台设置
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:8000/api/v1/admin/settings", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllowSelfRegistration(data.allow_self_registration);
                    setAiConfig({
                        ai_api_key: data.ai_api_key || "",
                        ai_api_base: data.ai_api_base || "https://api.openai.com/v1",
                        ai_model: data.ai_model || "gpt-4"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setSettingsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // 更新平台设置
    const handleToggleRegistration = async (checked: boolean) => {
        setAllowSelfRegistration(checked);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:8000/api/v1/admin/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ allow_self_registration: checked })
            });

            if (response.ok) {
                toast.success(checked ? "已开放自助注册" : "已关闭自助注册");
            } else {
                toast.error("更新失败");
                setAllowSelfRegistration(!checked); // Revert
            }
        } catch (error) {
            toast.error("网络错误");
            setAllowSelfRegistration(!checked); // Revert
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 模拟 API 调用
        setTimeout(() => {
            setIsLoading(false);
            toast.success("个人信息已更新");
        }, 1000);
    };

    const handleSaveAiConfig = async () => {
        setAiSaving(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:8000/api/v1/admin/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(aiConfig)
            });

            if (response.ok) {
                toast.success("AI 配置已保存");
            } else {
                toast.error("保存失败");
            }
        } catch (error) {
            toast.error("网络错误");
        } finally {
            setAiSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold">系统设置</h2>
                <p className="text-slate-300">管理您的管理员账户与全平台配置</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-emerald-500" />
                        <span className="text-white">管理员资料</span>
                    </CardTitle>
                    <CardDescription>更新您的登录凭证</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">管理员邮箱</Label>
                            <Input
                                disabled
                                value={formData.email}
                                className="bg-slate-800 border-slate-700 text-slate-300"
                            />
                        </div>

                        <div className="grid gap-4 pt-4 border-t border-slate-800">
                            <div className="space-y-2">
                                <Label className="text-slate-300">当前密码</Label>
                                <Input
                                    type="password"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    placeholder="输入当前密码以验证"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">新密码</Label>
                                    <Input
                                        type="password"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">确认新密码</Label>
                                    <Input
                                        type="password"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存中</> : "保存更改"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <span className="text-white">平台开放性设置</span>
                    </CardTitle>
                    <CardDescription>控制注册与入驻审核策略</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                        <div>
                            <div className="font-medium text-white">开放自助注册</div>
                            <div className="text-sm text-slate-300">允许企业通过 /register 页面自助入驻</div>
                        </div>
                        {settingsLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : (
                            <Switch
                                checked={allowSelfRegistration}
                                onCheckedChange={handleToggleRegistration}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 text-purple-500" />
                        <span className="text-white">AI 模型配置</span>
                    </CardTitle>
                    <CardDescription>配置全局 AI 能力 (LLM) 接口参数</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={aiConfig.ai_api_key}
                                    onChange={(e) => setAiConfig({ ...aiConfig, ai_api_key: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    placeholder="sk-..."
                                />
                                <Button
                                    onClick={() => handleSaveAiConfig()}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    disabled={aiSaving}
                                >
                                    {aiSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "保存"}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500">用于调用 OpenAI / Azure / DeepSeek 等兼容接口的密钥</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Base URL</Label>
                                <Input
                                    value={aiConfig.ai_api_base}
                                    onChange={(e) => setAiConfig({ ...aiConfig, ai_api_base: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    placeholder="https://api.openai.com/v1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Model Name</Label>
                                <Input
                                    value={aiConfig.ai_model}
                                    onChange={(e) => setAiConfig({ ...aiConfig, ai_model: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    placeholder="gpt-4"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

