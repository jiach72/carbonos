export function SiteFooter() {
    return (
        <footer className="py-8 border-t border-white/5 bg-slate-950">
            <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                <p>© 2026 苏州创电云 CarbonOS. All rights reserved.</p>
                <p className="mt-2 text-slate-600">
                    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">
                        苏ICP备2026007801号-1
                    </a>
                </p>
            </div>
        </footer>
    );
}
