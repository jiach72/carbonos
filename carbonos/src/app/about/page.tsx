import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Users, GraduationCap, Building, Globe, ChevronRight, Mail } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    const teamMembers = [
        { name: '李佳琛', role: 'CEO', title: '首席执行官', education: '挪威纳尔维克大学计算机 / 泰勒马克大学信息自动化双硕士', description: '连续创业者，"技术+金融"战略制定者' },
        { name: '邓业林', role: 'CSO', title: '首席科学家', education: '全球前2%顶尖科学家，苏州大学博导', description: '大唐/正泰特聘专家，储能安全权威' },
        { name: '杨舒然', role: '技术总监', title: '数字孪生负责人', education: '瑞士巴塞尔大学博士', description: '负责工业元宇宙与高精度建模' },
        { name: '张文祥', role: '技术总监', title: '视觉算法负责人', education: '东南大学博士', description: '负责AI视觉安全监控系统' },
        { name: '杨家滔', role: '技术总监', title: '区块链负责人', education: '香港城市大学硕士', description: '前汇丰/汤森路透，负责RWA金融科技架构' },
    ];

    const timeline = [
        { year: '2022', title: '公司成立', description: '深耕BMS/EMS研发，奠定技术基础' },
        { year: '2023', title: '业务拓展', description: '布局工商业储能与充电站业务' },
        { year: '2024', title: '规模化发展', description: '服务企业突破50家，管理资产超500MWh' },
        { year: '2025', title: '战略升级', description: '全面启动"零碳园区"、"AI算力运维"与"RWA"三驾马车战略' },
    ];

    const partners = ['大唐集团', '正泰电器', '苏州大学', '宁德时代', '阳光电源', '华为'];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-700/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6 font-medium">
                            <Users className="w-4 h-4" /> 关于我们
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
                            连接物理世界 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">与数字价值</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            苏州创电云是专业的新能源资产管理者，也是绿色算力的基础设施提供商、
                            零碳园区的建设者，以及数字资产的发行方。
                        </p>
                    </div>
                </section>

                {/* Team */}
                <section className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">核心团队</h2>
                            <p className="text-slate-400">汇聚全球顶尖人才，跨界融合能源、AI、金融科技</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="bg-slate-900 border border-white/5 p-8 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-lg">
                                        {member.name[0]}
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded font-medium">{member.role}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4 font-medium">{member.title}</p>
                                    <div className="flex items-start gap-2 text-slate-500 text-xs mb-3">
                                        <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                        <span>{member.education}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">发展历程</h2>
                        </div>
                        <div className="space-y-8 relative max-w-4xl mx-auto">
                            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent" />
                            {timeline.map((event, index) => (
                                <div key={event.year} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                                    <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                                        <div className="bg-slate-900 border border-white/5 p-6 rounded-xl inline-block w-full md:w-auto hover:bg-slate-800/50 transition-colors">
                                            <div className="text-2xl font-bold text-emerald-400 mb-1">{event.year}</div>
                                            <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                                            <p className="text-slate-400 text-sm">{event.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partners */}
                <section className="py-24 bg-slate-900/30 border-y border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-12">合作伙伴</h2>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            {partners.map((partner) => (
                                <div key={partner} className="p-6 bg-slate-900/50 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-default font-medium">
                                    <Building className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    {partner}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-900/10" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">与我们取得联系</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
                            无论您是潜在客户、合作伙伴还是有意加入我们，欢迎随时与我们联系
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
                            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-3">
                                <Mail className="w-5 h-5 text-emerald-500" />
                                <span className="text-white">contact@scdc.cloud</span>
                            </div>
                            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-3">
                                <Globe className="w-5 h-5 text-emerald-500" />
                                <span className="text-white">scdc.cloud</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
