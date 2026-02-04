import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
    { name: '首页', path: '/' },
    { name: '核心技术', path: '/core-tech' },
    { name: '能源方案', path: '/energy-solutions' },
    { name: '零碳园区', path: '/zero-carbon' },
    { name: 'AI算力', path: '/ai-computing' },
    { name: '数字资产', path: '/digital-assets' },
    { name: '行业动态', path: '/news' },
    { name: '关于我们', path: '/about' },
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // 路由变化时关闭移动端菜单
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-dark-500/90 backdrop-blur-lg shadow-lg shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <div className="container-custom">
                <nav className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-300 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:flex items-center">
                            <span className="text-xl font-bold text-primary-500">创电云</span>
                            <span className="text-gray-500 mx-2">|</span>
                            <span className="text-lg font-medium text-gray-300">scdc.cloud</span>
                        </div>
                    </Link>

                    {/* 桌面端导航 */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                    ? 'text-primary-500 bg-primary-500/10'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA 按钮 */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="http://localhost:3000/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Zap className="w-4 h-4" />
                            CarbonOS™
                        </a>
                    </div>

                    {/* 移动端菜单按钮 */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </nav>
            </div>

            {/* 移动端菜单 */}
            <div
                className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
                    }`}
            >
                <div className="bg-dark-500/95 backdrop-blur-lg border-t border-white/10 px-4 py-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === link.path
                                ? 'text-primary-500 bg-primary-500/10'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-4 px-4">
                        <a href="#contact" className="btn-primary w-full text-center">
                            联系我们
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
