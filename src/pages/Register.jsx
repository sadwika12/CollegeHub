import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../utils/api"
import { dummyDepartments } from "../utils/dummyData"

const roles = [
  { value: "student",      label: "Student"                  },
  { value: "faculty",      label: "Faculty"                  },
  { value: "hod",          label: "HOD (Head of Department)" },
  { value: "dean",         label: "Dean Academics"           },
  { value: "cell",         label: "Cell (Exam/CDP/Library)"  },
  { value: "organization", label: "Organization / Club"      },
]

// These roles need a department selection
const rolesWithDept = ["student", "faculty", "hod"]

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name:       "",
    email:      "",
    password:   "",
    role:       "",
    department: "",
  })

  const [formError,   setFormError]   = useState("")
  const [successMsg,  setSuccessMsg]  = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset department when role changes
      ...(name === "role" ? { department: "" } : {}),
    }))
    setFormError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setFormError("Please fill in all required fields")
      return
    }
    if (rolesWithDept.includes(formData.role) && !formData.department) {
      setFormError("Please select your department")
      return
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }

    const result = registerUser(formData)
    if (result.success) {
      setSuccessMsg("Registration successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CH</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join CollegeHub today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Register as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">Select your role</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Department — only shows for student, faculty, hod */}
            {rolesWithDept.includes(formData.role) && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your department</option>
                  {dummyDepartments.map((d) => (
                    <option key={d._id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Organization note */}
            {formData.role === "organization" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                Organization accounts require admin approval before you can post announcements.
                You will be notified once approved.
              </div>
            )}

            {/* Error */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                {formError}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">
                {successMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition"
            >
              Create account
            </button>

          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register