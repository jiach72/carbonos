"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { Leaf, Menu } from "lucide-react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

export default function SystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
                return;
            }

            // Guard: Block Super Admin from System Dashboard
            if (user.role === 'admin' && !user.tenant_id) {
                toast.error("非法访问", {
                    description: "超级管理员请移步管理后台",
                });
                router.replace("/sys-portal");
            }
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-emerald-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col md:flex-row bg-slate-950 overflow-hidden">
            {/* 移动端顶部导航栏 */}
            <header className="md:hidden flex items-center justify-between h-14 px-4 bg-slate-900 border-b border-slate-800 flex-shrink-0">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-slate-800 transition-colors"
                    aria-label="打开菜单"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <span>CarbonOS</span>
                </Link>
                {/* 右侧占位，保持居中 */}
                <div className="w-10" />
            </header>

            {/* 移动端抽屉侧边栏 */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64" showCloseButton={false}>
                    <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* 桌面端固定侧边栏 */}
            <aside className="hidden md:block w-64 flex-shrink-0 h-screen">
                <DashboardSidebar />
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 overflow-y-auto bg-slate-950 relative">
                {children}
            </main>
        </div>
    );
}

