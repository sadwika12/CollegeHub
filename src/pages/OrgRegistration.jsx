import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

const orgTypes = [
  { value: "technical",  label: "Technical Club"    },
  { value: "cultural",   label: "Cultural Club"     },
  { value: "social",     label: "Social Service"    },
  { value: "literary",   label: "Literary Club"     },
  { value: "sports",     label: "Sports Club"       },
  { value: "other",      label: "Other"             },
]

const OrgRegistration = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "organization") return <Navigate to="/dashboard" replace />

  const [formData, setFormData] = useState({
    name:        "",
    type:        "",
    description: "",
    email:       "",
    phone:       "",
    founded:     "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFormError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.description || !formData.email) {
      setFormError("Please fill in all required fields")
      return
    }

    console.log("Org registration payload:", formData)
    setSubmitted(true)
  }

  // ── Success screen ───────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Registration submitted!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Your organization <span className="font-medium text-gray-700">"{formData.name}"</span> has
                been submitted for admin approval. You will be notified once approved.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 text-left">
                <p className="font-medium mb-1">What happens next?</p>
                <p>1. Admin reviews your request</p>
                <p>2. You get notified on approval</p>
                <p>3. You can start posting announcements</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // ── Registration form ────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-2xl">

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Register your organization</h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below. Your request will be reviewed by the admin.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Org name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Organization name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tech Innovation Club"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Org type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Organization type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select type</option>
                    {orgTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What does your organization do? What are its goals?"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Two column row */}
                <div className="grid grid-cols-2 gap-4">

                  {/* Contact email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Contact email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="org@college.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Contact phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9XXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                </div>

                {/* Founded year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Founded year
                  </label>
                  <input
                    type="number"
                    name="founded"
                    value={formData.founded}
                    onChange={handleChange}
                    placeholder="e.g. 2019"
                    min="1990"
                    max="2026"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Logo upload — UI only */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Organization logo
                  </label>
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-center hover:border-purple-400 transition cursor-pointer">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload logo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    <p className="text-xs text-amber-500 mt-1">(File upload connects when backend is ready)</p>
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                    {formError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition"
                >
                  Submit for approval
                </button>

              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default OrgRegistration