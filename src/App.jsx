import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './contexts/UserContext/UserProvider'
import { ResumeProvider } from './contexts/ResumeContext/ResumeProvider' // 1. Import
import Navbar from './components/navbarComponents/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <UserProvider>
      <ResumeProvider> {/* 2. Wrap Provider */}
        <BrowserRouter>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-sm shadow-xl',
              duration: 4000
            }} 
          />

          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
            <Navbar /> 
            <main className="flex-1 max-w-4xl mx-auto w-full px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ResumeProvider>
    </UserProvider>
  )
}

export default App