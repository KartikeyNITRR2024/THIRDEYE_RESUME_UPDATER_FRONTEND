import { useResume } from '../../contexts/ResumeContext/ResumeProvider'
import BeforeUpload from './BeforeUpload'
import LoadingBar from './LoadingBar'
import Working from './Working'
import Completed from './Completed'

export default function ResumeInput() {
  const { currentResume, resetResume } = useResume()

  // STATE 1: STANDARD INPUT FORM
  if (!currentResume) {
    return <BeforeUpload />
  }

  // STATE 2: ACTIVE PROCESSING & COMPLETED UI
  const isInitialProcessing = ['UPLOADED', 'EXTRACTING_TEXT', 'PROCESSING_WITH_AI'].includes(currentResume.status)
  const isWorking = currentResume.status === 'WORKING'
  const isCompleted = currentResume.status === 'COMPLETED'
  const isFailed = currentResume.status === 'FAILED'

  // Format JSON beautifully if present
  let parsedContent = currentResume.content
  if (typeof parsedContent === 'string') {
    try { parsedContent = JSON.parse(parsedContent) } catch (e) { /* ignore */ }
  }

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center transition-all duration-500">
      
      {/* Shared Back / Cancel Button */}
      <button 
        onClick={resetResume}
        className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition flex items-center space-x-1 text-sm font-semibold"
        title={isCompleted ? "Go back" : "Cancel processing"}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Shared Dynamic Header */}
      <div className="mt-4 sm:mt-0 mb-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {currentResume.name ? `Profile: ${currentResume.name}` : '⚙️ Processing Resume'}
        </h2>
        {currentResume.email && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span>{currentResume.email}</span>
          </p>
        )}
      </div>
      
      {/* Shared ID & Status Pill */}
      <div className="flex justify-center items-center space-x-3 mb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
          ID: {currentResume.id.substring(0, 8)}...
        </p>
        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
          isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
          isFailed ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
          'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 animate-pulse'
        }`}>
          {currentResume.status}
        </span>
      </div>

      {/* Shared Original URL Tab */}
      {currentResume.originalURL && (
        <div className="mb-8">
          <a 
            href={currentResume.originalURL} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition underline underline-offset-4"
          >
            <span>📄 View Original Upload</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      )}

      {/* --- RENDER SPECIFIC PHASES --- */}
      {isInitialProcessing && <LoadingBar />}
      
      {isWorking && parsedContent && <Working parsedContent={parsedContent} />}
      
      {(isCompleted || isFailed) && (
        <Completed 
          currentResume={currentResume} 
          resetResume={resetResume} 
          isFailed={isFailed} 
        />
      )}

    </div>
  )
}