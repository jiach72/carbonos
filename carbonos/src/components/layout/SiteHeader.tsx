"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const pathname = usePathname();

    const navItems = [
        { href: "/solutions/zero-carbon-park", label: "零碳园区", icon: Leaf, highlight: true },
        { href: "/core-tech", label: "核心技术" },
        { href: "/energy-solutions", label: "能源解决方案" },
        { href: "/ai-computing", label: "AI 算力" },
        { href: "/ai-models", label: "AI 模型" },
        { href: "/digital-assets", label: "数字资产" },
        { href: "/about", label: "关于我们" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-white hover:opacity-90 transition-opacity">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                        {/* 换个 Logo 色调区分官网和产品？还是保持一致？保持一致但用蓝色代表科技 */}
                        <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <span className="flex items-baseline gap-1.5">
                        <span>创电云</span>
                        <span className="text-slate-500 text-lg font-normal">|</span>
                        <span className="text-blue-400 text-lg font-medium tracking-wide">scdc.cloud</span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative py-2 transition-colors",
                                    isActive ? "text-white font-semibold" : "hover:text-white",
                                    item.highlight && !isActive && "text-emerald-400 hover:text-emerald-300 font-bold",
                                    item.highlight && isActive && "text-emerald-400 font-bold"
                                )}
                            >
                                <span className="flex items-center gap-1">
                                    {item.icon && <item.icon className="w-4 h-4" />}
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full animate-in fade-in zoom-in duration-300" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-0">
                            CarbonOS™
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
