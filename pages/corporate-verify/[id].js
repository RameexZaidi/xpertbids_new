// pages/corporate/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CorporateVerificationForm from '@/components/CorporateVerificationForm';

export default function CorporateVerifyPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: session, status } = useSession();
  const [data, setData]           = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (status !== 'authenticated' || !id) return;

    const BASE = "https://admin.xpertbid.com/api";

    axios
      .get(`${BASE}/corporate-verifications/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      })
      .then(res => setData(res.data))
      .catch(err => setError(err));
  }, [status, id, session]);

  if (status === 'loading') return <p>Loading session…</p>;
  if (error)            return <p>Error loading verification data.</p>;
  if (!data)            return <p>Loading data…</p>;

  return (
    <CorporateVerificationForm
      initialData={data}
      isEdit={true}
    />
  );
}
