"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Sheet 组件 - 移动端抽屉式菜单
 * 使用 Dialog 作为基础，添加侧边滑入动画
 */

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

function SheetOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="sheet-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
            )}
            {...props}
        />
    )
}

const sheetVariants = cva(
    cn(
        "fixed z-50 gap-4 bg-slate-950 shadow-xl transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:duration-300 data-[state=open]:duration-300"
    ),
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
                right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
    showCloseButton?: boolean
}

function SheetContent({
    side = "right",
    className,
    children,
    showCloseButton = true,
    ...props
}: SheetContentProps) {
    return (
        <SheetPortal>
            <SheetOverlay />
            <DialogPrimitive.Content
                data-slot="sheet-content"
                className={cn(sheetVariants({ side }), className)}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="sheet-close"
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-slate-950 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none"
                    >
                        <XIcon className="h-5 w-5 text-white" />
                        <span className="sr-only">关闭</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </SheetPortal>
    )
}

function SheetHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="sheet-header"
            className={cn("flex flex-col gap-2 p-6 text-left border-b border-slate-800", className)}
            {...props}
        />
    )
}

function SheetFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="sheet-footer"
            className={cn("flex flex-col gap-2 p-6 border-t border-slate-800", className)}
            {...props}
        />
    )
}

function SheetTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="sheet-title"
            className={cn("text-lg font-semibold text-white", className)}
            {...props}
        />
    )
}

function SheetDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="sheet-description"
            className={cn("text-sm text-slate-400", className)}
            {...props}
        />
    )
}

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
