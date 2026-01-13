import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import CoreTech from './pages/CoreTech'
import EnergySolutions from './pages/EnergySolutions'
import ZeroCarbonPark from './pages/ZeroCarbonPark'
import AIComputing from './pages/AIComputing'
import DigitalAssets from './pages/DigitalAssets'
import About from './pages/About'

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-dark-500 flex flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/core-tech" element={<CoreTech />} />
                        <Route path="/energy-solutions" element={<EnergySolutions />} />
                        <Route path="/zero-carbon" element={<ZeroCarbonPark />} />
                        <Route path="/ai-computing" element={<AIComputing />} />
                        <Route path="/digital-assets" element={<DigitalAssets />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
