"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// 模拟数据
const mockOrganizations = [
    { id: "1", name: "苏州零碳产业园", code: "SZLC", type: "park", address: "苏州工业园区" },
    { id: "2", name: "光伏科技有限公司", code: "GFKJ", type: "enterprise", parentName: "苏州零碳产业园" },
    { id: "3", name: "生产一车间", code: "SC01", type: "workshop", parentName: "光伏科技有限公司" },
];

const typeLabels: Record<string, string> = {
    park: "园区",
    enterprise: "企业",
    workshop: "车间",
};

export default function OrganizationsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: "park",
        address: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log("创建组织:", formData);
        setIsDialogOpen(false);
        // TODO: 调用 API 创建组织
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="组织管理"
                    description="多租户组织架构与权限管理"
                    className="mb-8"
                >
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                + 新建组织
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                                <DialogTitle className="text-white">新建组织</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">组织类型</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                            <SelectValue placeholder="选择类型" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-700 border-slate-600">
                                            <SelectItem value="park">园区</SelectItem>
                                            <SelectItem value="enterprise">企业</SelectItem>
                                            <SelectItem value="workshop">车间</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">组织名称</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="请输入组织名称"
                                        className="bg-slate-700 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">组织代码</Label>
                                    <Input
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="请输入唯一代码"
                                        className="bg-slate-700 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">地址</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="请输入地址"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    创建
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PageHeader>

                {/* 组织列表 */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-slate-700/50">
                                <TableHead className="text-slate-400">名称</TableHead>
                                <TableHead className="text-slate-400">代码</TableHead>
                                <TableHead className="text-slate-400">类型</TableHead>
                                <TableHead className="text-slate-400">上级组织</TableHead>
                                <TableHead className="text-slate-400">地址</TableHead>
                                <TableHead className="text-slate-400 text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockOrganizations.map((org) => (
                                <TableRow key={org.id} className="border-slate-700 hover:bg-slate-700/50">
                                    <TableCell className="text-white font-medium">{org.name}</TableCell>
                                    <TableCell className="text-slate-300">{org.code}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${org.type === "park" ? "bg-emerald-600/20 text-emerald-400" :
                                            org.type === "enterprise" ? "bg-blue-600/20 text-blue-400" :
                                                "bg-amber-600/20 text-amber-400"
                                            }`}>
                                            {typeLabels[org.type]}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-300">
                                        {org.parentName || "-"}
                                    </TableCell>
                                    <TableCell className="text-slate-300">{org.address || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                            编辑
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                            删除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    );
}
