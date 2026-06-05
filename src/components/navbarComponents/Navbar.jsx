import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext/UserProvider' // Import global user context hook

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { userData, loading } = useUser() // Access global user data state

  // Initialize from localStorage or default to true (Night mode)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  // Watch for theme changes and update the root HTML element
  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="font-bold text-xl text-slate-900 dark:text-white tracking-wider">
          ResumeHelper
        </Link>

        {/* Action Controls Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* UNIVERSAL PROFILE CHIP: Now adaptively renders on all screens */}
          {!loading && userData && (
            <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/50 text-xs font-semibold select-none transition-colors">
              {/* Shows full profile details on desktop, drops the name icon path on narrow panels */}
              <span className="hidden sm:inline text-slate-700 dark:text-slate-300">👤 {userData.name}</span>
              <span className="hidden sm:inline h-3 w-[1px] bg-slate-300 dark:bg-slate-600 mx-1"></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🪙 {userData.token} <span className="hidden xs:inline">Left</span></span>
            </div>
          )}
          
          {/* Day / Night Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition"
            aria-label="Toggle Light/Dark Theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0 5 5 0 01-7.072 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation Menu Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition">Home</Link>
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition">About</Link>
            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition">Contact</Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Layout */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-4 px-2">
          {/* Note: Profile chip removed from here since it sits permanently on the header row above */}
          <Link to="/" onClick={closeMenu} className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition py-1">Home</Link>
          <Link to="/about" onClick={closeMenu} className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition py-1">About</Link>
          <Link to="/contact" onClick={closeMenu} className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition py-1">Contact</Link>
        </div>
      )}
    </nav>
  )
}