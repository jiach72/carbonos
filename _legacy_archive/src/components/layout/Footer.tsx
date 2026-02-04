import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const footerLinks = {
    产品服务: [
        { name: '核心技术', path: '/core-tech' },
        { name: '能源解决方案', path: '/energy-solutions' },
        { name: '零碳园区', path: '/zero-carbon' },
        { name: 'AI算力服务', path: '/ai-computing' },
    ],
    关于我们: [
        { name: '公司介绍', path: '/about' },
        { name: '数字资产', path: '/digital-assets' },
        { name: '联系我们', path: '/about#contact' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-dark-400 border-t border-white/10">
            <div className="container-custom section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* 品牌区 */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-300 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">创电云</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            绿色能源驱动智算未来
                            <br />
                            数字资产链接全球价值
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* 链接区 */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-semibold mb-4">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 text-sm hover:text-primary-500 transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* 联系方式 */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">联系我们</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <span>苏州市工业园区</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                <a href="mailto:contact@scdc.cloud" className="hover:text-primary-500 transition-colors">
                                    contact@scdc.cloud
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                <a href="tel:+86-512-12345678" className="hover:text-primary-500 transition-colors">
                                    +86-512-12345678
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 版权区 */}
            <div className="border-t border-white/5">
                <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} 苏州创电云科技有限公司 版权所有
                    </p>
                    <p className="text-gray-500 text-sm">
                        <a href="#" className="hover:text-primary-500 transition-colors">隐私政策</a>
                        <span className="mx-2">|</span>
                        <a href="#" className="hover:text-primary-500 transition-colors">使用条款</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
