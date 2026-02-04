"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Database, Building2, Settings, LogOut, ChevronRight, Footprints, BrainCircuit, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

const navItems = [
    {
        title: "仪表盘",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "AI 智算分析",
        href: "/ai-analysis",
        icon: BrainCircuit,
    },
    {
        title: "产品碳足迹",
        href: "/pcf",
        icon: Footprints,
    },
    {
        title: "碳核算",
        href: "/carbon",
        icon: Leaf,
    },
    {
        title: "AI 碳排诊断",
        href: "/carbon/diagnostic",
        icon: Zap,
    },
    {
        title: "数据接入",
        href: "/data-input",
        icon: Database,
    },
    {
        title: "组织管理",
        href: "/organizations",
        icon: Building2,
    },
];

import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ... (navItems definition)

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        toast("正在退出登录...", {
            description: "安全断开连接",
        });
        setTimeout(() => {
            router.push("/"); // 模拟退出到首页
            toast.success("已安全退出");
        }, 1000);
    };

    // 获取用户数据
    const { user } = useUser();

    // 生成用户缩写 (例如: "Zhang San" -> "ZS", "admin@..." -> "AD")
    const getInitials = () => {
        if (!user) return "";
        if (user.name) {
            // 尝试提取姓名首字母
            const parts = user.name.split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return user.name.substring(0, 2).toUpperCase();
        }
        return user.email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64">
            {/* Header ... */}
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    CarbonOS<span className="text-emerald-500">™</span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 mb-1 font-medium",
                                    isActive
                                        ? "bg-slate-800 text-emerald-400 hover:bg-slate-800 hover:text-emerald-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <Link href="/settings">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 mb-2",
                            pathname === "/settings"
                                ? "bg-slate-800 text-emerald-400"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        系统设置
                    </Button>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 mt-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-sm">
                        {getInitials()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate" title={user?.email}>
                            {user?.email}
                        </p>
                    </div>
                    <LogOut
                        className="h-4 w-4 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}
