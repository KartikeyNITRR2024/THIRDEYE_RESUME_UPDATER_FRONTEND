import React, { useState } from 'react';
// Import the hook to access context
import { useResume } from '../../contexts/ResumeContext/ResumeProvider';

export default function Working({ parsedContent }) {
  // Pull currentResume and submitResume from Context
  const { currentResume, submitResume } = useResume();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle the final submit action
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!currentResume?.id) return;
    
    setIsSubmitting(true);
    await submitResume(currentResume.id);
    setIsSubmitting(false); // Only reached if submission fails (success unmounts component)
  };

  // --------------------------------------------------------------------------
  // RECURSIVE TOON RENDERER
  // --------------------------------------------------------------------------
  const renderToonNode = (node, pathId) => {
    if (!Array.isArray(node) || node.length !== 3) return null;
    
    const [name, type, content] = node;

    if (type === 'string') {
      const isLongText = typeof content === 'string' && content.length > 100;
      
      return (
        <div key={pathId} className="mb-4 w-full">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            {name}
          </label>
          {isLongText ? (
            <textarea
              readOnly
              value={content}
              rows={4}
              className="w-full p-3 text-sm rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors custom-scrollbar"
            />
          ) : (
            <input
              type="text"
              readOnly
              value={content}
              className="w-full p-3 text-sm rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          )}
        </div>
      );
    }

    if (type === 'object' || type === 'array') {
      return (
        <div key={pathId} className="mb-6 p-4 rounded-xl border border-slate-700/60 bg-slate-800/20 shadow-sm">
          <h3 className="text-sm font-bold text-emerald-400 mb-4 border-b border-slate-700/60 pb-2 flex items-center">
            {type === 'array' ? '📄 ' : '📦 '} {name}
          </h3>
          
          <div className="pl-2 sm:pl-4 border-l-2 border-slate-700/30">
            {Array.isArray(content) && content.map((childNode, index) => 
              renderToonNode(childNode, `${pathId}-${index}`)
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const isToonFormat = Array.isArray(parsedContent);

  return (
    <div className="mt-6 mb-8 text-left animate-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <span>Live AI Draft Form</span>
          <span className="flex h-3 w-3 relative ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </span>
      </div>

      {/* Dynamic Form Container */}
      <div className="bg-slate-900 p-5 rounded-2xl shadow-inner border border-slate-800 overflow-y-auto max-h-[600px] custom-scrollbar mb-6">
        {isToonFormat ? (
          <form className="space-y-2">
            {parsedContent.map((node, index) => renderToonNode(node, `root-${index}`))}
          </form>
        ) : (
          <div className="text-amber-400 text-sm font-mono text-center py-10">
            Waiting for structural data...
          </div>
        )}
      </div>

      {/* NEW: Submit Action Area */}
      {isToonFormat && (
        <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-6">
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finalizing...</span>
              </>
            ) : (
              <>
                <span>Approve & Generate PDF</span>
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
      
    </div>
  );
}