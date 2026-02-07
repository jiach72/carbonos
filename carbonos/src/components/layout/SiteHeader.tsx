"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export function SiteHeader() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

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
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
                <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 font-bold text-xl md:text-2xl tracking-tight text-white hover:opacity-90 transition-opacity">
                        <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                            <Leaf className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <span className="flex items-baseline gap-1 md:gap-1.5">
                            <span>创电云</span>
                            <span className="hidden sm:inline text-slate-500 text-base md:text-lg font-normal">|</span>
                            <span className="hidden sm:inline text-blue-400 text-sm md:text-lg font-medium tracking-wide">scdc.cloud</span>
                        </span>
                    </Link>

                    {/* 桌面端导航 */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-400">
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

                    {/* 右侧操作区 */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/login" className="hidden sm:block">
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-0">
                                CarbonOS™
                            </Button>
                        </Link>

                        {/* 移动端汉堡菜单按钮 */}
                        <button
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-slate-800 transition-colors"
                            onClick={() => setIsOpen(true)}
                            aria-label="打开菜单"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* 移动端抽屉导航 */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetHeader className="p-6 border-b border-slate-800">
                        <SheetTitle className="flex items-center gap-3 text-white">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <Leaf className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">创电云</span>
                        </SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col py-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-6 py-3.5 text-base transition-colors",
                                        isActive
                                            ? "bg-slate-800 text-white font-semibold border-l-2 border-blue-500"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                                        item.highlight && !isActive && "text-emerald-400"
                                    )}
                                >
                                    {item.icon && <item.icon className="w-5 h-5" />}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 底部登录按钮 */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                进入 CarbonOS™
                            </Button>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

