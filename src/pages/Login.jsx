import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFormError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields")
      return
    }

    const success = login(formData.email, formData.password)
    if (success) {
      navigate("/dashboard")
    } else {
      setFormError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-8">
            <span className="text-white text-2xl font-bold">CH</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to CollegeHub</h1>
          <p className="text-gray-500 text-sm mt-1">Your campus information hub</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Error message */}
            {(formError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                {formError || error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Quick login hint for demo */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-800 mb-2">Demo accounts — use any of these:</p>
            <div className="flex flex-col gap-1">
              {[
                { email: "yagna@college.com",   role: "Student"  },
                { email: "ramesh@college.com",  role: "Faculty"  },
                { email: "priya@college.com",   role: "HOD"      },
                { email: "sharma@college.com",  role: "Dean"     },
                { email: "admin@college.com",   role: "Admin"    },
                { email: "mitra@college.com",   role: "Org"      },
              ].map((u) => (
                <button
                  key={u.email}
                  onClick={() => setFormData({ email: u.email, password: "demo123" })}
                  className="text-left text-xs text-yellow-700 hover:text-yellow-900 hover:underline"
                >
                  {u.role} → {u.email}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6 mb-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login