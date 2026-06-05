import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useUser } from '../UserContext/UserProvider' 
import ApiCaller from "../../properties/Apicaller";

const ResumeContext = createContext(null)

const api = new ApiCaller()

export function ResumeProvider({ children }) {
  const [currentResume, setCurrentResume] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const pollingTimerRef = useRef(null)
  
  const lastNotifiedStatusRef = useRef(null) 
  const { getUserInfo } = useUser()

  const RESUME_ENDPOINT = 'resumemanager/v1/resumes'
  // NEW: PDF Generator base route mapping
  const PDF_ENDPOINT = 'pdfgenerater/v1/resumes'

  const startPolling = (resumeId) => {
    setIsPolling(true)
    lastNotifiedStatusRef.current = null 
    
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)

    pollingTimerRef.current = setInterval(async () => {
      try {
        const { response, data: rawData } = await api.call(`${RESUME_ENDPOINT}/${resumeId}`)
        
        if (response.ok) {
          let data = rawData

          if (data.status === 'WORKING' || data.status === 'COMPLETED') {
            if (lastNotifiedStatusRef.current !== data.status) {
              lastNotifiedStatusRef.current = data.status
              
              if (getUserInfo) {
                getUserInfo().catch(err => console.error('Failed to update user context:', err))
              }
            }

            try {
              const { response: contentResponse, data: contentData } = await api.call(`${RESUME_ENDPOINT}/${resumeId}/content`)
              if (contentResponse.ok) {
                data = { ...data, ...contentData }
              }
            } catch (err) {
              console.error('Failed to fetch resume content data', err)
            }
          }

          setCurrentResume(data)

          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            clearInterval(pollingTimerRef.current)
            setIsPolling(false)
            
            if (data.status === 'COMPLETED') {
              toast.success('Resume successfully optimized! ✨')
            } else {
              toast.error('AI Processing failed. Please try again.')
            }
          }
        }
      } catch (error) {
        console.error('Error fetching resume status:', error)
      }
    }, 10000)
  }

  const uploadPdf = async (file, metadata) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'metadata', 
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    )

    const { response, data } = await api.call(`${RESUME_ENDPOINT}/upload/pdf`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('PDF Upload Failed')
    
    setCurrentResume(data)
    startPolling(data.id)
    return data
  }

  const uploadText = async (text, metadata) => {
    const { response, data } = await api.call(`${RESUME_ENDPOINT}/upload/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        resumeText: text, 
        metadata: metadata 
      }),
    })

    if (!response.ok) throw new Error('Text Upload Failed')
    
    setCurrentResume(data)
    startPolling(data.id)
    return data
  }

  const fetchUserHistory = async (email, page = 0, size = 10) => {
    try {
      const { response, data } = await api.call(`${RESUME_ENDPOINT}/email/${email}?page=${page}&size=${size}&sort=createTime,desc`)
      if (!response.ok) throw new Error('Failed to retrieve history')
      
      return data 
    } catch (error) {
      console.error('Error fetching history:', error)
      throw error 
    }
  }

  const submitResume = async (resumeId) => {
    const loadingToast = toast.loading('Finalizing your resume...')
    
    setIsPolling(false)
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)

    try {
      const { response, data } = await api.call(`${RESUME_ENDPOINT}/${resumeId}/submit`, {
        method: 'PATCH' 
      })
      
      if (!response.ok) throw new Error('Failed to submit resume')
      
      setCurrentResume(data)
      toast.success('Resume finalized!', { id: loadingToast })
      
      return data
    } catch (error) {
      console.error('Error submitting resume:', error)
      toast.error('Failed to submit resume. Please try again.', { id: loadingToast })
      startPolling(resumeId)
    }
  }

  // --- NEW: Download PDF Action via ApiCaller ---
  const downloadPdfFormat = async (resumeId, formatType) => {
    const downloadUrl = `${api.getBaseUrl()}${PDF_ENDPOINT}/${resumeId}/${formatType}/download`;
    window.open(downloadUrl, '_blank');
  }

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)
    }
  }, [])

  const resetResume = () => {
    setCurrentResume(null)
    setIsPolling(false)
    lastNotifiedStatusRef.current = null
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)
  }

  return (
    <ResumeContext.Provider value={{ 
      currentResume, 
      isPolling, 
      uploadPdf, 
      uploadText, 
      fetchUserHistory,
      submitResume,
      downloadPdfFormat,
      resetResume 
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) throw new Error('useResume must be used within a ResumeProvider')
  return context
}