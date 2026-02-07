"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

export default function SystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useUser();
    const router = useRouter();

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
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <DashboardSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950 relative">
                {/* Mobile Sidebar Trigger could go here */}
                {children}
            </main>
        </div>
    );
}
