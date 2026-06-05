import { useResume } from '../../contexts/ResumeContext/ResumeProvider'

export default function HistoryTable({ pageData, onClose, onPageChange, isFetching }) {
  // NEW: Pull the centralized download handler from context
  const { downloadPdfFormat } = useResume()

  // Safely extract pagination metadata from Spring's Page object
  const { content: history, totalElements, totalPages, number: currentPage } = pageData || { content: [], totalElements: 0, totalPages: 0, number: 0 };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const baseStyles = "px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider";
    if (status === 'COMPLETED') return `${baseStyles} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
    if (status === 'FAILED') return `${baseStyles} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
    return `${baseStyles} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`;
  }

  return (
    <div className="p-1 animate-in slide-in-from-top-4 duration-500 w-full relative">
      
      {/* Loading Overlay */}
      {isFetching && (
        <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
           <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300 flex flex-col max-h-[80vh]">
        
        {/* Header Controls */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 transition-colors duration-300 sticky top-0 z-20">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-left flex items-center flex-wrap gap-2">
            Optimization History 
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2.5 rounded-full transition-colors duration-300 border border-slate-200 dark:border-slate-700">
              {totalElements} {totalElements === 1 ? 'Record' : 'Records'} Total
            </span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
          >
            Close
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* 📱 MOBILE VIEW: Floating Cards */}
          <div className="md:hidden flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-900/30">
            {history.length > 0 ? history.map((record) => (
              <div key={record.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-4 transition-colors">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-700/50">
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDate(record.createTime)}
                  </div>
                  <span className={getStatusBadge(record.status)}>
                    {record.status}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Source Document:</span>
                    {record.originalURL ? (
                      <a href={record.originalURL} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">View Original</a>
                    ) : <span className="text-slate-400 dark:text-slate-500 italic">N/A</span>}
                  </div>
                  <div>
                    <span className="block text-slate-500 dark:text-slate-400 font-medium text-sm mb-2">Export Formats:</span>
                    {record.status === 'COMPLETED' ? (
                      <div className="grid grid-cols-2 gap-2">
                        {record.updatedURL && (
                          <a href={record.updatedURL} target="_blank" rel="noreferrer" className="flex justify-center items-center px-3 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm">📄 TXT</a>
                        )}
                        <button onClick={() => downloadPdfFormat(record.id, 'TYPE_1')} className="flex justify-center items-center px-3 py-2 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 transition shadow-sm">📑 Classic</button>
                        <button onClick={() => downloadPdfFormat(record.id, 'TYPE_2')} className="flex justify-center items-center px-3 py-2 text-xs font-bold rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 hover:bg-sky-100 transition shadow-sm">🎨 Modern</button>
                        <button onClick={() => downloadPdfFormat(record.id, 'TYPE_3')} className="flex justify-center items-center px-3 py-2 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition shadow-sm">✨ Creative</button>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic text-sm">Processing in background...</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                No previous records found.
              </div>
            )}
          </div>

          {/* 💻 DESKTOP VIEW: Standard Table */}
          <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-900/20">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold transition-colors duration-300">
                <tr>
                  <th className="px-6 py-4">Date Created</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Original</th>
                  <th className="px-6 py-4">Export Optimized Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {history.length > 0 ? history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors duration-200">
                    <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">{formatDate(record.createTime)}</td>
                    <td className="px-6 py-4"><span className={getStatusBadge(record.status)}>{record.status}</span></td>
                    <td className="px-6 py-4">
                      {record.originalURL ? (
                        <a href={record.originalURL} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">View Source</a>
                      ) : <span className="text-slate-400 dark:text-slate-500 italic">N/A</span>}
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'COMPLETED' ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                          <button onClick={() => downloadPdfFormat(record.id, 'TYPE_1')} className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">📑 Classic</button>
                          <button onClick={() => downloadPdfFormat(record.id, 'TYPE_2')} className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors shadow-sm">🎨 Modern</button>
                          <button onClick={() => downloadPdfFormat(record.id, 'TYPE_3')} className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-sm">✨ Creative</button>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Processing...</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No previous records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky bottom-0 z-20">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0 || isFetching}
              className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || isFetching}
              className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  )
}