// components/VehicleVerificationForm.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import SuccessPopup from '@/components/SuccessPopup'
import ErrorPopup from '@/components/ErrorPopup'

const API_BASE = "https://admin.xpertbid.com/api";

export default function VehicleVerificationForm({
  initialData = {},
  isEdit = false
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // --- Form fields (prefill when editing) ---
  const [vehicleMakeModel, setVehicleMakeModel] = useState(
    initialData.vehicle_make_model || ''
  )
  const [yearOfManufacture, setYearOfManufacture] = useState(
    initialData.year_of_manufacture || ''
  )
  const [chassisVin, setChassisVin] = useState(
    initialData.chassis_vin || ''
  )

  // files + previews
  const [vehicleDocs, setVehicleDocs] = useState([])
  const [previewUrls, setPreviewUrls] = useState(
    initialData.vehicle_documents
      ? initialData.vehicle_documents.map((p) =>
          `${API_BASE.replace(/\/api$/, '')}/${p}`
        )
      : []
  )
  const [fileCountError, setFileCountError] = useState('')

  // UI state
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // fetch countries on mount
  useEffect(() => {
    axios
      .get(`https://admin.xpertbid.com/api/get-countries`)
      .then((res) => setCountries(res.data.country || []))
      .catch(console.error)
  }, [])

  // handle file input (max 3)
  const onDocsChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 3) {
      setFileCountError('You can’t upload more than 3 documents.')
      e.target.value = ''
      return
    }
    setFileCountError('')
    setVehicleDocs(files)
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)))
  }

  // form submit
const handleSubmit = async (e) => {
  e.preventDefault()
  setErrors({})
  setShowError(false)
  setShowSuccess(false)
  setLoading(true)

  const fd = new FormData()
  fd.append('vehicle_make_model', vehicleMakeModel)
  fd.append('year_of_manufacture', yearOfManufacture)
  fd.append('chassis_vin', chassisVin)
  vehicleDocs.forEach((file) =>
  fd.append('vehicle_documents[]', file)
)

  try {
    if (isEdit) {
      // override to PUT for Laravel
      fd.append('_method', 'PUT')
      await axios.post(
        `https://admin.xpertbid.com/api/vehicle-verifications/${initialData.id}`,
        fd,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      )
    } else {
      await axios.post(
        `https://admin.xpertbid.com/api/vehicle-verifications`,
        fd,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      )
    }

    setSuccessMsg(
      isEdit
        ? 'Vehicle verification updated successfully.'
        : 'Vehicle verification submitted successfully.'
    )
    setShowSuccess(true)

  } catch (err) {
    console.error('🚨 API Error', err.response || err)
    const resp = err.response?.data || {}
    if (resp.errors) {
      setErrors(resp.errors)
      setErrorMsg(Object.values(resp.errors).flat().join(' '))
    } else {
      setErrorMsg(resp.message || 'Submission failed.')
    }
    setShowError(true)

  } finally {
    setLoading(false)
  }
}


  // wait for session
  if (status === 'loading') return <p>Loading session…</p>
  if (status !== 'authenticated')
    return <p>Please log in to submit.</p>

  return (
    <div className="container mt-5">
      {showSuccess && (
        <SuccessPopup
          isOpen={showSuccess}
          onClose={() => {
            if (isEdit) {
              router.push('/') // or wherever home
            } else {
              window.location.reload()
            }
          }}
          message={successMsg}
          SubMessage=""
        />
      )}
      {showError && (
        <ErrorPopup
          isOpen={showError}
          onClose={() => setShowError(false)}
          message={errorMsg}
        />
      )}

      <form
        onSubmit={handleSubmit}
        style={{ backgroundColor: 'white', padding: '20px' }}
      >
        <h4 className="mb-5 heading">
          {isEdit ? 'Edit Vehicle Verification' : 'Vehicle Verification'}
        </h4>

        {/* Make & Model */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Vehicle Make & Model
          </label>
          <input
            type="text"
            className="form-control verify_input"
            value={vehicleMakeModel}
            onChange={(e) => setVehicleMakeModel(e.target.value)}
            placeholder="Enter make and model"
            required
          />
          {errors.vehicle_make_model && (
            <div className="text-danger">
              {errors.vehicle_make_model}
            </div>
          )}
        </div>

        {/* Year */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Year of Manufacture
          </label>
          <input
            type="number"
            className="form-control verify_input"
            value={yearOfManufacture}
            onChange={(e) =>
              setYearOfManufacture(e.target.value)
            }
            placeholder="Enter year"
            required
          />
          {errors.year_of_manufacture && (
            <div className="text-danger">
              {errors.year_of_manufacture}
            </div>
          )}
        </div>

        {/* VIN */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Chassis / VIN Number
          </label>
          <input
            type="text"
            className="form-control verify_input"
            value={chassisVin}
            onChange={(e) => setChassisVin(e.target.value)}
            placeholder="Enter chassis or VIN"
            required
          />
          {errors.chassis_vin && (
            <div className="text-danger">
              {errors.chassis_vin}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="identity-upload-section mb-4">
          <h4 className="form-label fw-bold mb-3">
            Upload Vehicle Documents
          </h4>
          <ul className="liss mb-3">
            <li>PNG/JPEG/PDF only, up to 3 files.</li>
          </ul>
          <div
            className="upload-box"
            onClick={() =>
              document.getElementById('vehicleInput').click()
            }
          >
            {previewUrls.length > 0 ? (
              <div className="d-flex flex-wrap">
                {previewUrls.map((url, i) =>
                  url.toLowerCase().endsWith('.pdf') ? (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      className="m-1"
                      style={{
                        fontSize: '2rem',
                        color: '#e74c3c'
                      }}
                    >
                      <i className="fa-solid fa-file-pdf" />
                    </a>
                  ) : (
                    <img
                      key={i}
                      src={url}
                      className="upload-preview m-1"
                      style={{ maxHeight: 100 }}
                      alt={`Doc ${i + 1}`}
                    />
                  )
                )}
              </div>
            ) : (
              <button
                type="button"
                className="upload upload-btn button-style-3"
              >
                Upload Vehicle Documents
              </button>
            )}
            <input
              id="vehicleInput"
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              multiple
              style={{ display: 'none' }}
              onChange={onDocsChange}
              required={!isEdit}
            />
          </div>
          {fileCountError && (
            <div className="text-danger">{fileCountError}</div>
          )}
          {errors.vehicle_documents && (
            <div className="text-danger">
              {errors.vehicle_documents}
            </div>
          )}
        </div>

       
        {/* Submit */}
        <button
          type="submit"
          className="button-style-2"
          disabled={loading}
        >
          {loading
            ? isEdit
              ? 'Updating…'
              : 'Submitting…'
            : isEdit
            ? 'Update'
            : 'Submit'}
        </button>
      </form>
    </div>
  )
}
