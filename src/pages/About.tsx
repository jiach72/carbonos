import { Users, GraduationCap, Building, Globe, ChevronRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

// 核心团队数据
const teamMembers = [
    {
        name: '李佳琛',
        role: 'CEO',
        title: '首席执行官',
        education: '挪威纳尔维克大学计算机 / 泰勒马克大学信息自动化双硕士',
        description: '连续创业者，"技术+金融"战略制定者',
        avatar: null, // 后续替换为实际头像
    },
    {
        name: '邓业林',
        role: 'CSO',
        title: '首席科学家',
        education: '全球前2%顶尖科学家，苏州大学博导',
        description: '大唐/正泰特聘专家，储能安全权威',
        avatar: null,
    },
    {
        name: '杨舒然',
        role: '数字孪生负责人',
        title: '技术总监',
        education: '瑞士巴塞尔大学博士',
        description: '负责工业元宇宙与高精度建模',
        avatar: null,
    },
    {
        name: '张文祥',
        role: '视觉算法负责人',
        title: '技术总监',
        education: '东南大学博士',
        description: '负责AI视觉安全监控系统',
        avatar: null,
    },
    {
        name: '杨家滔',
        role: '区块链负责人',
        title: '技术总监',
        education: '香港城市大学硕士',
        description: '前汇丰/汤森路透，负责RWA金融科技架构',
        avatar: null,
    },
]

// 发展历程
const timeline = [
    {
        year: '2022',
        title: '公司成立',
        description: '深耕BMS/EMS研发，奠定技术基础',
    },
    {
        year: '2023',
        title: '业务拓展',
        description: '布局工商业储能与充电站业务',
    },
    {
        year: '2024',
        title: '规模化发展',
        description: '服务企业突破50家，管理资产超500MWh',
    },
    {
        year: '2025',
        title: '战略升级',
        description: '全面启动"零碳园区"、"AI算力运维"与"RWA"三驾马车战略',
    },
]

export default function About() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero-about.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark-500/70" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-500 text-sm mb-6">
                            <Users className="w-4 h-4" />
                            关于我们
                        </div>
                        <h1 className="heading-1 text-white mb-6">
                            连接物理世界
                            <span className="text-gradient"> 与数字价值</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            苏州创电云是专业的新能源资产管理者，也是绿色算力的基础设施提供商、
                            零碳园区的建设者，以及数字资产的发行方。
                        </p>
                    </div>
                </div>
            </section>

            {/* 核心团队 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">核心团队</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            汇聚全球顶尖人才，跨界融合能源、AI、金融科技
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="glass-card p-6 group hover:border-primary-500/50 transition-all duration-300"
                            >
                                {/* 头像占位 */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-300 flex items-center justify-center mb-4">
                                    <span className="text-2xl font-bold text-white">{member.name[0]}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                                    <span className="px-2 py-0.5 bg-primary-500/20 text-primary-500 text-xs rounded">{member.role}</span>
                                </div>
                                <p className="text-primary-500 text-sm mb-3">{member.title}</p>

                                <div className="flex items-start gap-2 text-gray-400 text-sm mb-2">
                                    <GraduationCap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{member.education}</span>
                                </div>

                                <p className="text-gray-400 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 发展历程 */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">发展历程</h2>
                        <p className="text-gray-400">从技术深耕到产业布局，稳步前行</p>
                    </div>

                    <div className="relative">
                        {/* 时间线 */}
                        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-300 to-accent-300 hidden md:block" />

                        <div className="space-y-8">
                            {timeline.map((event, index) => (
                                <div
                                    key={event.year}
                                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* 内容卡片 */}
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                                        <div className="glass-card p-6 inline-block">
                                            <div className="text-2xl font-bold text-gradient mb-2">{event.year}</div>
                                            <h4 className="text-lg font-semibold text-white mb-2">{event.title}</h4>
                                            <p className="text-gray-400 text-sm">{event.description}</p>
                                        </div>
                                    </div>

                                    {/* 中间节点 */}
                                    <div className="hidden md:flex w-4 h-4 rounded-full bg-primary-500 border-4 border-dark-500 absolute left-1/2 -translate-x-1/2" />

                                    {/* 占位 */}
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 合作伙伴 */}
            <section className="section-padding bg-dark-400/50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="heading-2 text-white mb-4">合作伙伴</h2>
                        <p className="text-gray-400">与行业领军企业携手共进</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {['大唐集团', '正泰电器', '苏州大学', '宁德时代', '阳光电源', '华为'].map((partner) => (
                            <div
                                key={partner}
                                className="glass-card p-6 text-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
                            >
                                <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <span className="text-sm">{partner}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 联系我们 */}
            <section id="contact" className="section-padding bg-gradient-to-br from-primary-500/10 via-dark-500 to-secondary-300/10">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="heading-2 text-white mb-6">与我们取得联系</h2>
                        <p className="text-gray-400 mb-8">
                            无论您是潜在客户、合作伙伴还是有意加入我们，欢迎随时与我们联系
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <a
                                href="mailto:contact@scdc.cloud"
                                className="glass-card p-6 flex items-center justify-center gap-3 hover:border-primary-500/50 transition-all duration-300"
                            >
                                <Mail className="w-6 h-6 text-primary-500" />
                                <span className="text-white">contact@scdc.cloud</span>
                            </a>
                            <a
                                href="https://scdc.cloud"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card p-6 flex items-center justify-center gap-3 hover:border-primary-500/50 transition-all duration-300"
                            >
                                <Globe className="w-6 h-6 text-primary-500" />
                                <span className="text-white">scdc.cloud</span>
                            </a>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:contact@scdc.cloud" className="btn-primary">
                                发送邮件咨询
                            </a>
                            <Link to="/" className="btn-secondary">
                                返回首页 <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
