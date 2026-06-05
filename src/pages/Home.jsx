import { useUser } from '../contexts/UserContext/UserProvider' // Import global user context hook
import ResumeInput from '../components/homeComponents/ResumeInput'

export default function Home() {
  const { userData, loading } = useUser()

  // Safely fallback if data is loading or missing
  const displayName = !loading && userData?.name ? userData.name : 'Candidate'

  return (
    <div className="py-10 md:py-16 px-4">
      {/* Render the upload/paste component beneath your header */}
      <div className="transition-all duration-300">
        <ResumeInput />
      </div>

    </div>
  )
}