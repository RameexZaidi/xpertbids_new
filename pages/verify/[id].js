import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import IndividualVerificationForm from '@/components/IndividualVerificationForm'

export default function VerifyPage() {
  const { query: { id } } = useRouter()
  const { data: session } = useSession()
  const [data, setData]   = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
 
    if (!id) return

  const BASE = "https://admin.xpertbid.com/api";
    const headers = session?.user?.token
      ? { Authorization: `Bearer ${session.user.token}` }
      : {}

    axios.get(`${BASE}/individual-verifications/${id}`, { headers })
      .then(res => setData(res.data))
      .catch(err => setError(err))
  }, [id, session])

  if (error)      return <p>Error loading data: {error.message}</p>
  if (!data)      return <p>Loading data…</p>

  return <IndividualVerificationForm initialData={data} isEdit />
}
