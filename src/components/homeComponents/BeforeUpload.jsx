import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useUser } from '../../contexts/UserContext/UserProvider'
import { useResume } from '../../contexts/ResumeContext/ResumeProvider'

export default function BeforeUpload() {
  const { userData } = useUser()
  const { uploadPdf, uploadText } = useResume()

  const [activeTab, setActiveTab] = useState('upload')
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
      toast.success(`Selected file: ${e.target.files[0].name}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const metadata = {
      userId: userData?.id || 'anonymous-uuid-fallback',
      jobTitle: jobTitle,
      jobDescription: jobDescription,
      yearsOfExperience: 0
    }

    try {
      if (activeTab === 'upload') {
        const promise = uploadPdf(file, metadata)
        toast.promise(promise, {
          loading: 'Uploading PDF document...',
          success: 'Upload secured! Starting pipeline...',
          error: 'Failed to upload PDF.',
        })
      } else {
        const promise = uploadText(text, metadata)
        toast.promise(promise, {
          loading: 'Transmitting resume text...',
          success: 'Text secured! Starting pipeline...',
          error: 'Failed to upload text.',
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isSubmitDisabled = (activeTab === 'upload' ? !file : !text.trim()) || !jobDescription.trim() || !jobTitle.trim()

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transition-all duration-300">
      <label className="block text-left text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
        1. Provide Your Resume
      </label>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        <button type="button" onClick={() => { setActiveTab('upload'); setFile(null); }} className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'upload' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>📁 Upload File</button>
        <button type="button" onClick={() => { setActiveTab('paste'); setText(''); }} className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'paste' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>📝 Paste Text</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Selection */}
        {activeTab === 'upload' ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 bg-slate-50 dark:bg-slate-950 hover:border-emerald-400 transition group">
            <label className="cursor-pointer text-center w-full">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{file ? file.name : "Click to upload or drag & drop"}</span>
              <span className="text-xs text-slate-400 block mt-1">PDF, DOCX, or TXT up to 10MB</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <textarea rows="5" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste resume content here..." className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition"/>
        )}

        {/* Job Details Section */}
        <div className="flex flex-col text-left pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            2. Target Job Details
          </label>
          
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Target Job Title (e.g. Backend Engineer)" className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition"/>
          <textarea rows="5" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the requirements or role description here..." className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition"/>
        </div>

        <button type="submit" disabled={isSubmitDisabled} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
          Submit for Analysis
        </button>
      </form>
    </div>
  )
}