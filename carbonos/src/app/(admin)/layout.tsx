"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ShieldAlert,
    Menu,
    FileText,
    ToggleRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "运营概览",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "租户管理",
        href: "/admin/tenants",
        icon: Users,
    },
    {
        title: "调研管理",
        href: "/admin/surveys",
        icon: FileText,
    },
    {
        title: "功能开关",
        href: "/admin/feature-flags",
        icon: ToggleRight,
    },
    {
        title: "系统设置",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in
                router.replace("/sys-portal");
            } else if (user.role !== 'admin' || user.tenant_id) {
                // Logged in but not SUPER admin (Tenant Admins have tenant_id)
                toast.error("权限不足", {
                    description: "您没有权限访问管理后台",
                });
                router.replace("/dashboard");
            } else {
                // Authorized
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        router.push("/sys-portal");
    };

    if (loading || !isAuthorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-emerald-500" />
                    <p className="text-sm text-slate-500">正在验证权限...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-rose-500 font-bold text-xl">
                    <ShieldAlert className="h-6 w-6" />
                    CarbonOS Admin
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-rose-500" : "text-slate-300 group-hover:text-white")} />
                                <span className={cn(pathname === item.href ? "text-white font-medium" : "")}>{item.title}</span>
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                        退出管理后台
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/50 backdrop-blur">
                    <h1 className="text-lg font-medium text-slate-200">超级管理员控制台</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
