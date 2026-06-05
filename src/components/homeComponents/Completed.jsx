import { useState } from 'react'
import { toast } from 'react-hot-toast'
import HistoryTable from './HistoryTable'
import { useResume } from '../../contexts/ResumeContext/ResumeProvider'

export default function Completed({ currentResume, resetResume, isFailed }) {
  // Destructured the new shared action
  const { fetchUserHistory, downloadPdfFormat } = useResume()

  const [historyPage, setHistoryPage] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 })
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleFetchHistory = async (pageIndex = 0) => {
    if (!currentResume?.email) return
    
    setIsFetchingHistory(true)
    try {
      const pageData = await fetchUserHistory(currentResume.email, pageIndex, 10)
      setHistoryPage(pageData)
      setShowHistory(true)
      
      if (pageIndex === 0) {
        toast.success(`Found ${pageData.totalElements} previous resume(s)`)
      }
    } catch (error) {
      toast.error('Network error while fetching history')
    } finally {
      setIsFetchingHistory(false)
    }
  }

  // Refactored download trigger utilizing Context Actions
  const handlePdfDownload = (type) => {
    if (!type || !currentResume?.id) return;
    downloadPdfFormat(currentResume.id, type);
  };

  if (isFailed) {
    return (
      <button 
        onClick={resetResume}
        className="block w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-6 rounded-xl transition shadow-md"
      >
        Try Again
      </button>
    )
  }

  return (
    <div className="animate-in fade-in zoom-in duration-500 mt-8 space-y-6">
      
      {/* Export Options Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Choose Export Format
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Plain Text */}
          <a 
            href={currentResume.contentUrl || currentResume.updatedURL} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center space-x-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <span>📄 Plain Text (.txt)</span>
          </a>

          {/* Option 2: Classic PDF */}
          <button 
            onClick={() => handlePdfDownload('TYPE_1')}
            className="flex items-center justify-center space-x-2 w-full bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium py-3 px-4 rounded-xl transition border border-indigo-200 dark:border-indigo-800/50 shadow-sm"
          >
            <span>📑 Classic PDF</span>
          </button>

          {/* Option 3: Modern PDF */}
          <button 
            onClick={() => handlePdfDownload('TYPE_2')}
            className="flex items-center justify-center space-x-2 w-full bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 font-medium py-3 px-4 rounded-xl transition border border-sky-200 dark:border-sky-800/50 shadow-sm"
          >
            <span>🎨 Modern PDF</span>
          </button>

          {/* Option 4: Creative PDF */}
          <button 
            onClick={() => handlePdfDownload('TYPE_3')}
            className="flex items-center justify-center space-x-2 w-full bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-medium py-3 px-4 rounded-xl transition border border-emerald-200 dark:border-emerald-800/50 shadow-sm"
          >
            <span>✨ Creative PDF</span>
          </button>
        </div>

        {/* Start Over Button */}
        <button 
          onClick={resetResume}
          className="block w-full mt-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-xl transition shadow-lg"
        >
          Optimize Another Role
        </button>
      </div>

      {/* History Button */}
      {currentResume.email && !showHistory && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <button
            onClick={() => handleFetchHistory(0)}
            disabled={isFetchingHistory}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium border border-indigo-100 dark:border-indigo-800/50 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isFetchingHistory ? 'Locating Records...' : 'Check Past Resumes'}</span>
          </button>
        </div>
      )}

      {showHistory && (
        <HistoryTable 
          pageData={historyPage} 
          onClose={() => setShowHistory(false)} 
          onPageChange={handleFetchHistory}
          isFetching={isFetchingHistory}
        />
      )}
    </div>
  )
}