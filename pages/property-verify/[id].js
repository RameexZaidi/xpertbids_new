import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PropertyVerificationForm from "@/components/PropertyVerificationForm";
import ErrorPopup from "@/components/ErrorPopup";
import axios                from "axios";
 const BASE = "https://admin.xpertbid.com/api";
export default function EditProperty() {
  const { data: session } = useSession();
  const router           = useRouter();
  const { id }           = router.query;

  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  if (!id || !session?.user?.token) return;
  axios.get(`${BASE}/property-verifications/${id}`, {
    headers: { Authorization: `Bearer ${session.user.token}` }
  })
  .then(res => setData(res.data))
  .catch(() => setError("Failed to load"))
  .finally(() => setLoading(false));
}, [id, session]);

  if (loading) return <p>Loading…</p>;
  if (error) return <ErrorPopup isOpen message={error} onClose={() => router.push("/")} />;

  return <PropertyVerificationForm initialData={data} isEdit />;
}
