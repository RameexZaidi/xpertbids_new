// pages/vehicle-verify/[id].js
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import VehicleVerificationForm from '@/components/VehicleVerificationForm'

axios.defaults.withCredentials = true

export default function VehicleVerifyEdit() {
  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()

  const [verification, setVerification] = useState(null)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (status !== 'authenticated' || !id) return
    axios
      .get(`https://admin.xpertbid.com/api/vehicle-verifications/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      })
      .then(res => setVerification(res.data))
      .catch(err => setError(err))
  }, [status, id, session])

  if (status === 'loading') return <p>Loading session…</p>
  if (error)            return <p>Error loading data: {error.message}</p>
  if (!verification)    return <p>Loading data…</p>

  return (
    <VehicleVerificationForm
      initialData={verification}
      isEdit={true}
    />
  )
}
