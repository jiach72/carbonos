
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const passwordFormSchema = z.object({
    oldPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少需要6位"),
    confirmPassword: z.string().min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: PasswordFormValues) {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("/api/v1/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    old_password: data.oldPassword,
                    new_password: data.newPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "修改失败");
            }

            toast.success("密码修改成功", {
                description: "请使用新密码重新登录",
            });

            // 登出并跳转
            setTimeout(() => {
                localStorage.removeItem("access_token");
                router.push("/login");
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error("修改失败", {
                description: error instanceof Error ? error.message : "未知错误",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500 py-6">
            <div>
                <h3 className="text-2xl font-medium text-white mb-2">系统设置</h3>
                <p className="text-sm text-muted-foreground">
                    管理您的账户设置和安全首选项。
                </p>
            </div>
            <Separator className="bg-slate-800" />

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-emerald-500" />
                        <CardTitle className="text-white">修改密码</CardTitle>
                    </div>
                    <CardDescription>
                        定期修改密码可以保护您的账户安全。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">当前密码</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="输入当前使用的密码" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">新密码</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="输入新密码" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">确认新密码</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="再次输入新密码" {...field} className="bg-slate-950 border-slate-800 text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            提交中
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            保存更改
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
