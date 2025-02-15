'use client'
import { useRouter } from 'next/navigation'

const BackLink = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }

  return <div onClick={handleBack}>{children}</div>
}

export default BackLink
