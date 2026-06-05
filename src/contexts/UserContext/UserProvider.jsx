import { createContext, useContext, useState, useEffect } from 'react'
import ApiCaller from "../../properties/Apicaller";

const UserContext = createContext(null)

// Initialize the ApiCaller instance
const api = new ApiCaller()

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user_session')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(!userData)

  // Base path config (ApiCaller automatically prefixes the host domain)
  const TOKEN_ENDPOINT = 'tokenmanager/v1/users'

  // --------------------------------------------------------
  // EFFECT 1: Register first-time users
  // --------------------------------------------------------
  useEffect(() => {
    if (userData) return

    async function registerFirstTimeUser() {
      try {
        const { response, data } = await api.call(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'User' }),
        })

        if (!response.ok) throw new Error('Failed to fetch initial profile')

        localStorage.setItem('user_session', JSON.stringify(data))
        setUserData(data)
      } catch (error) {
        console.error('User registration error:', error)
      } finally {
        setLoading(false)
      }
    }

    registerFirstTimeUser()
  }, [userData])

  // --------------------------------------------------------
  // EFFECT 2: Poll for live Token updates every 15 seconds
  // --------------------------------------------------------
  useEffect(() => {
    if (!userData?.id) return

    const intervalId = setInterval(async () => {
      try {
        const { response, data: liveTokenCount } = await api.call(`${TOKEN_ENDPOINT}/${userData.id}/token`)
        
        if (response.ok) {
          setUserData((prevData) => {
            // Prevent state re-renders if token count has not changed
            if (prevData?.token === liveTokenCount) return prevData

            const updatedUser = { ...prevData, token: liveTokenCount }
            localStorage.setItem('user_session', JSON.stringify(updatedUser))
            return updatedUser
          })
        }
      } catch (error) {
        console.error('Error fetching live token updates:', error)
      }
    }, 20000)

    return () => clearInterval(intervalId)
  }, [userData?.id])

  // --------------------------------------------------------
  // ACTION: Fetch full user profile (Name, Email, Token)
  // --------------------------------------------------------
  const getUserInfo = async () => {
    if (!userData?.id) return null

    try {
      const { response, data: fullData } = await api.call(`${TOKEN_ENDPOINT}/${userData.id}`)
      
      if (!response.ok) throw new Error('Failed to retrieve full user profile')
      
      // Update state and local storage with fresh server data
      setUserData(fullData)
      localStorage.setItem('user_session', JSON.stringify(fullData))
      
      return fullData
    } catch (error) {
      console.error('Error fetching full user info:', error)
      return null
    }
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, getUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be initialized within a global <UserProvider>')
  }
  return context
}