"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Globe, Cpu, Coins, ShieldCheck, Activity, Server, Users } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function CorporateHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <SiteHeader />

      <main className="flex-1">
        {/* === Hero Section === */}
        <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-0">
          {/* Background Video Simulator */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 opacity-90" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
          </div>

          <div className="container relative z-10 px-4 sm:px-6 mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 animate-gradient-x">
                绿色能源驱动智算未来
              </span>
              <span className="block text-lg sm:text-2xl md:text-4xl mt-3 sm:mt-4 font-light text-slate-300">
                数字资产链接全球价值
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-12 leading-relaxed px-2">
              苏州创电云 (SCDC) —— 连接物理能源世界与数字价值世界的桥梁。
              <br className="hidden md:block" />
              我们提供从 <strong>新能源管理</strong>、<strong>零碳园区</strong> 到 <strong>AI算力基建</strong> 的全栈解决方案。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
              <Link href="/solutions/zero-carbon-park">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/25">
                  探索零碳业务 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/ai-computing">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-slate-700 text-slate-300 bg-transparent hover:text-white hover:bg-slate-800 rounded-full backdrop-blur-sm">
                  了解 AI 算力
                </Button>
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">500+ <span className="text-xs sm:text-sm font-sans text-slate-500">MWh</span></div>
                <div className="text-xs text-slate-400 mt-1">管理资产规模</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">12W+ <span className="text-xs sm:text-sm font-sans text-slate-500">吨</span></div>
                <div className="text-xs text-slate-400 mt-1">累计减排二氧化碳</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">50+ <span className="text-xs sm:text-sm font-sans text-slate-500">家</span></div>
                <div className="text-xs text-slate-400 mt-1">服务园区/企业</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">99.9%</div>
                <div className="text-xs text-slate-400 mt-1">SLA 在线率</div>
              </div>
            </div>
          </div>
        </section>

        {/* === Business Matrix (Quad) === */}
        <section className="py-16 sm:py-24 bg-slate-900">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">云-边-端全栈布局</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <MatrixCard
                icon={Cpu}
                title="软件引擎"
                desc="EMS / BMS 边缘智能控制，虚拟电厂(VPP)聚合响应。"
                color="text-blue-400"
              />
              <MatrixCard
                icon={Globe}
                title="零碳园区"
                desc="源网荷储一体化建设，CarbonOS 碳足迹全流程追踪。"
                color="text-emerald-400"
                link="/solutions/zero-carbon-park"
              />
              <MatrixCard
                icon={Server}
                title="AI 基建"
                desc="AIOps 绿色算力运维，InfiniBand 高性能组网。"
                color="text-purple-400"
                link="/ai-computing"
              />
              <MatrixCard
                icon={Coins}
                title="金融赋能"
                desc="数据资产入表 (RDA)，RWA 实物资产通证化链接全球。"
                color="text-amber-400"
              />
            </div>
          </div>
        </section>

        {/* === Core Tech === */}
        <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">硬核科技证明</h2>
                <div className="space-y-8">
                  <TechItem
                    title="BMS 电池管理系统"
                    desc="三级架构，毫秒级安全响应。智能调节电芯一致性，延长寿命 20%。"
                    icon={ShieldCheck}
                  />
                  <TechItem
                    title="EMS 能源管理系统"
                    desc="边缘智能，离网自治。极端环境下依然保障微网稳定运行。"
                    icon={Activity}
                  />
                  <TechItem
                    title="VPP 虚拟电厂"
                    desc="聚沙成塔。聚合光储充资源参与电网调峰调频，创造第二份收益。"
                    icon={Zap}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <h3 className="font-mono text-slate-300">SCADA_Status_Monitor.exe</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-4 font-mono text-sm text-emerald-400">
                    <p>&gt; System check initiating...</p>
                    <p>&gt; Connecting to Edge_Node_01 [OK]</p>
                    <p>&gt; Connecting to Edge_Node_02 [OK]</p>
                    <p>&gt; Battery Cluster A: <span className="text-white">Voltage Stable (3.45V)</span></p>
                    <p>&gt; Grid Frequency: <span className="text-white">50.02 Hz</span></p>
                    <p>&gt; AI Model: <span className="text-blue-400">Load Prediction Optimizing...</span></p>
                    <div className="h-32 bg-slate-950 rounded border border-slate-800 flex items-end p-2 gap-1 mt-4">
                      {[40, 60, 45, 70, 85, 60, 75, 50, 65, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/50 hover:bg-emerald-400 transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === About Us === */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">关于我们</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <TeamCard name="李佳琛" role="CEO & 创始人" desc="挪威纳尔维克大学/泰勒马克大学双硕士。「技术+金融」战略制定者。" />
              <TeamCard name="邓业林" role="CSO & 首席科学家" desc="全球前 2% 顶尖科学家。大唐/正泰特聘专家，储能安全权威。" />
              <TeamCard name="核心团队" role="R&D Team" desc="汇聚来自瑞士巴塞尔大学、东南大学、香港城市大学的硕博精英。" />
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}

function MatrixCard({ icon: Icon, title, desc, color, link }: any) {
  const CardContent = (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:bg-slate-800 transition-all cursor-pointer group h-full">
      <div className={`w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );

  return link ? <Link href={link}>{CardContent}</Link> : CardContent;
}

function TechItem({ title, desc, icon: Icon }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TeamCard({ name, role, desc }: any) {
  return (
    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800">
      <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="text-slate-500 w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white">{name}</h3>
      <div className="text-sm text-blue-400 mb-4">{role}</div>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  )
}
