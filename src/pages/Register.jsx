import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../utils/api"
import { dummyDepartments } from "../utils/dummyData"


const roles = [
  { value: "Student",      label: "Student"                  },
  { value: "Faculty",      label: "Faculty"                  },
  { value: "HOD",          label: "HOD (Head of Department)" },
  { value: "Dean",         label: "Dean Academics"           },
  { value: "Cell",         label: "Cell (Exam/CDP/Library)"  },
  { value: "Organization", label: "Organization / Club"      },
 
]

const rolesWithDept = ["Student", "Faculty", "HOD"]

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes chRise {
      from { opacity:0; transform:translateY(28px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes chUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes chOrbit {
      from { transform:rotate(0deg) translateX(38px) rotate(0deg); }
      to   { transform:rotate(360deg) translateX(38px) rotate(-360deg); }
    }
    @keyframes chOrbit2 {
      from { transform:rotate(0deg) translateX(54px) rotate(0deg); }
      to   { transform:rotate(360deg) translateX(54px) rotate(-360deg); }
    }
    @keyframes chPulseGlow {
      0%,100% { opacity:0.4; transform:scale(1); }
      50%     { opacity:0.85; transform:scale(1.12); }
    }
    @keyframes chWave {
      0%,100% { transform:translateY(0) rotate(0deg); }
      33%     { transform:translateY(-5px) rotate(2deg); }
      66%     { transform:translateY(3px) rotate(-1deg); }
    }
    @keyframes chBobBook {
      0%,100% { transform:translateY(0) rotate(-8deg); }
      50%     { transform:translateY(-8px) rotate(-8deg); }
    }
    @keyframes chBobCap {
      0%,100% { transform:translateY(0) rotate(6deg); }
      50%     { transform:translateY(-10px) rotate(6deg); }
    }
    @keyframes chBobAtom {
      0%,100% { transform:translateY(0) rotate(-4deg); }
      50%     { transform:translateY(-7px) rotate(-4deg); }
    }
    @keyframes chBobPencil {
      0%,100% { transform:translateY(0) rotate(15deg); }
      50%     { transform:translateY(-8px) rotate(15deg); }
    }
    @keyframes chBobBulb {
      0%,100% { transform:translateY(0); }
      50%     { transform:translateY(-9px); }
    }
    @keyframes chTwinkle {
      0%,100% { opacity:0.18; }
      50%     { opacity:0.7; }
    }
    @keyframes chPillFloat {
      0%,100% { transform:translateY(0); }
      50%     { transform:translateY(-5px); }
    }

    .ch-card   { animation: chRise 0.85s cubic-bezier(0.16,1,0.3,1) both; }
    .ch-up-1   { animation: chUp 0.5s ease both 0.1s; }
    .ch-up-2   { animation: chUp 0.5s ease both 0.2s; }
    .ch-pill-a { animation: chPillFloat 3.6s ease-in-out infinite; }
    .ch-pill-b { animation: chPillFloat 3.6s ease-in-out 1.8s infinite; }

    .ch-field { transition: border-color .25s, box-shadow .25s, background .25s; }
    .ch-field:focus-within {
      border-color: #7c5cbf !important;
      background: rgba(124,92,191,0.1) !important;
      box-shadow: 0 0 0 3px rgba(124,92,191,0.15);
    }

    .ch-btn { transition: transform .2s, box-shadow .2s, filter .2s; }
    .ch-btn:hover { transform:translateY(-2px); filter:brightness(1.1); box-shadow:0 10px 28px rgba(124,92,191,0.55) !important; }
    .ch-btn:active { transform:translateY(0); }

    input, select {
      font-family:'DM Sans',sans-serif !important;
      color:#d4cde8 !important;
    }
    input::placeholder { color:#5a5475 !important; }
    input:focus, select:focus { outline:none; }
    select option { background: #2a2240; color: #d4cde8; }
  `}</style>
)


const AcademicIllustration = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width:"100%", maxWidth:"340px", display:"block", margin:"0 auto" }}>
    <defs>
      <radialGradient id="rCG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7c5cbf" stopOpacity="0.28"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <linearGradient id="rCapG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9b7dd4"/><stop offset="100%" stopColor="#7c5cbf"/>
      </linearGradient>
      <linearGradient id="rAtomG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a78bda"/><stop offset="100%" stopColor="#7c5cbf"/>
      </linearGradient>
      <linearGradient id="rBulbG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c4aff0"/><stop offset="100%" stopColor="#9b7dd4"/>
      </linearGradient>
      <linearGradient id="rPencilG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ddd5f5"/><stop offset="100%" stopColor="#b8a5e8"/>
      </linearGradient>
      <filter id="rGlow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="rSoftGlow">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {[[18,18],[50,38],[330,25],[375,48],[12,100],[385,88],[28,240],[370,220],[195,14],[95,285],[305,290]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%2===0?1.3:0.9} fill="rgba(180,160,230,0.4)"
        style={{ animation:`chTwinkle ${2+i*0.4}s ease-in-out ${i*0.3}s infinite` }}/>
    ))}
    <circle cx="200" cy="152" r="80" fill="url(#rCG)"/>
    <circle cx="200" cy="152" r="62"  stroke="rgba(124,92,191,0.13)" strokeWidth="1" strokeDasharray="6 4"/>
    <circle cx="200" cy="152" r="88"  stroke="rgba(155,125,212,0.08)" strokeWidth="1" strokeDasharray="4 6"/>
    <circle cx="200" cy="152" r="114" stroke="rgba(180,160,230,0.05)" strokeWidth="1" strokeDasharray="3 8"/>
    <circle cx="200" cy="152" r="2.8" fill="#9b7dd4" opacity="0.7"
      style={{ transformOrigin:"200px 152px", animation:"chOrbit 8s linear infinite" }}/>
    <circle cx="200" cy="152" r="2.2" fill="#b8a5e8" opacity="0.6"
      style={{ transformOrigin:"200px 152px", animation:"chOrbit2 12s linear infinite reverse" }}/>
    <g style={{ transformOrigin:"200px 106px", animation:"chBobCap 3.2s ease-in-out infinite" }}>
      <rect x="168" y="92" width="64" height="8" rx="3" fill="url(#rCapG)" filter="url(#rGlow)"/>
      <rect x="194" y="82" width="12" height="12" rx="2" fill="url(#rCapG)"
        style={{ transformOrigin:"200px 88px", transform:"rotate(45deg)" }}/>
      <line x1="232" y1="97" x2="241" y2="116" stroke="#9b7dd4" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="241" cy="119" r="3.5" fill="#9b7dd4" filter="url(#rGlow)"/>
      <path d="M176 100 Q200 122 224 100" stroke="rgba(155,125,212,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>
    <g style={{ transformOrigin:"92px 210px", animation:"chBobBook 3.8s ease-in-out 0.5s infinite" }}>
      <rect x="62" y="220" width="58" height="12" rx="3" fill="#2a2040" stroke="rgba(124,92,191,0.5)" strokeWidth="1"/>
      <rect x="62" y="220" width="7"  height="12" rx="2" fill="#5c3fa0"/>
      <rect x="58" y="206" width="54" height="15" rx="3" fill="#3d2e6e" stroke="rgba(124,92,191,0.6)" strokeWidth="1"/>
      <rect x="58" y="206" width="8"  height="15" rx="2" fill="#7c5cbf" filter="url(#rGlow)"/>
      <rect x="64" y="190" width="50" height="17" rx="3" fill="#5c3fa0" stroke="rgba(155,125,212,0.7)" strokeWidth="1"/>
      <rect x="64" y="190" width="9"  height="17" rx="2" fill="#9b7dd4" filter="url(#rGlow)"/>
    </g>
    <g style={{ transformOrigin:"298px 212px", animation:"chBobAtom 4.1s ease-in-out 1s infinite" }}>
      <circle cx="298" cy="212" r="9"  fill="url(#rAtomG)" filter="url(#rGlow)"/>
      <circle cx="298" cy="212" r="4.5" fill="#c4aff0"/>
      <ellipse cx="298" cy="212" rx="30" ry="12" stroke="#7c5cbf" strokeWidth="1.4" fill="none" opacity="0.7"/>
      <ellipse cx="298" cy="212" rx="30" ry="12" stroke="#9b7dd4" strokeWidth="1.4" fill="none" opacity="0.45"
        style={{ transform:"rotate(60deg)", transformOrigin:"298px 212px" }}/>
      <ellipse cx="298" cy="212" rx="30" ry="12" stroke="#b8a5e8" strokeWidth="1.4" fill="none" opacity="0.38"
        style={{ transform:"rotate(-60deg)", transformOrigin:"298px 212px" }}/>
    </g>
    <g style={{ transformOrigin:"76px 82px", animation:"chBobPencil 3.5s ease-in-out 0.8s infinite" }}>
      <rect x="68" y="54" width="14" height="50" rx="3" fill="url(#rPencilG)"/>
      <rect x="68" y="50" width="14" height="7"  rx="2" fill="#ddd5f5" opacity="0.65"/>
      <path d="M68 104 L75 120 L82 104 Z" fill="#ede8fa"/>
      <path d="M72 112 L75 120 L78 112 Z" fill="#5c3fa0"/>
    </g>
    <g style={{ transformOrigin:"314px 76px", animation:"chBobBulb 3.9s ease-in-out 1.4s infinite" }}>
      <circle cx="314" cy="70" r="26" fill="rgba(124,92,191,0.07)" filter="url(#rSoftGlow)"/>
      <path d="M299 70 Q299 48 314 44 Q329 48 329 70 Q329 82 321 88 L307 88 Q299 82 299 70Z"
        fill="url(#rBulbG)" opacity="0.9" filter="url(#rGlow)"/>
      <rect x="307" y="88" width="14" height="3.5" rx="1" fill="#c4aff0" opacity="0.75"/>
      <rect x="308" y="92" width="12" height="3.5" rx="1" fill="#9b7dd4" opacity="0.65"/>
      <rect x="310" y="96" width="8"  height="3"   rx="1" fill="#7c5cbf" opacity="0.55"/>
    </g>
    <text x="148" y="62" fontSize="18" fontWeight="bold" fill="rgba(155,125,212,0.52)"
      style={{ animation:"chWave 6s ease-in-out 0.5s infinite", transformOrigin:"156px 55px" }}>π</text>
    <text x="222" y="258" fontSize="17" fontWeight="bold" fill="rgba(124,92,191,0.42)"
      style={{ animation:"chWave 5s ease-in-out 1.5s infinite", transformOrigin:"231px 251px" }}>Σ</text>
    <text x="138" y="274" fontSize="15" fill="rgba(180,160,230,0.36)"
      style={{ animation:"chWave 7s ease-in-out 2.5s infinite", transformOrigin:"148px 268px" }}>∞</text>
    {[[158,42],[238,38],[352,142],[32,202],[162,284],[326,268]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(124,92,191,0.2)"
        style={{ animation:`chPulseGlow ${2.5+i*0.5}s ease-in-out ${i*0.4}s infinite` }}/>
    ))}
  </svg>
)


const Field = ({ label, children }) => (
  <div className="relative">
    <label style={{
      position:"absolute", top:"-8px", left:"13px", padding:"0 4px",
      fontSize:"0.63rem", fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase",
      color:"rgba(155,125,212,0.85)", zIndex:1, background:"#221c38"
    }}>
      {label}
    </label>
    <div className="ch-field flex items-center rounded-xl"
      style={{ border:"1.5px solid rgba(124,92,191,0.25)", background:"rgba(255,255,255,0.04)" }}>
      {children}
    </div>
  </div>
)

const Register = () => {
  
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "", department: "",
  })
  const [formError,  setFormError]  = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" ? { department: "" } : {}),
    }))
    setFormError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setFormError("Please fill in all required fields"); return
    }
    if (rolesWithDept.includes(formData.role) && !formData.department) {
      setFormError("Please select your department"); return
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters"); return
    }
    const result = registerUser(formData)
    if (result.success) {
      setSuccessMsg("Registration successful! Redirecting to login…")
      setTimeout(() => navigate("/login"), 2000)
    } else {
      setFormError(result.message || "Registration failed. Please try again.")
    }
  }
  

  const iconColor   = "#7c5cbf"
  const inputStyle  = { padding:"11px 12px 11px 0", fontSize:"0.84rem" }

  return (
    <>
      <GlobalStyles />

      <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
        style={{ fontFamily:"'DM Sans',sans-serif", background:"#4a4560" }}>

       
        <div className="fixed pointer-events-none" style={{ borderRadius:"50%", filter:"blur(120px)", width:"500px", height:"500px", top:"-150px", left:"-120px", background:"rgba(80,60,120,0.4)" }}/>
        <div className="fixed pointer-events-none" style={{ borderRadius:"50%", filter:"blur(140px)", width:"460px", height:"460px", bottom:"-130px", right:"-100px", background:"rgba(60,45,100,0.4)" }}/>

      
        <div className="ch-card flex w-full overflow-hidden relative z-10"
          style={{ maxWidth:"960px", minHeight:"580px", borderRadius:"18px",
            boxShadow:"0 0 0 1px rgba(124,92,191,0.15), 0 28px 70px rgba(0,0,0,0.5)" }}>

        
          <div className="relative flex flex-col overflow-hidden"
            style={{ flex:"1", padding:"32px 30px 0",
              background:"linear-gradient(155deg,#2d2250 0%,#231a42 55%,#1a1232 100%)" }}>

            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage:"linear-gradient(rgba(124,92,191,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,191,0.07) 1px,transparent 1px)",
              backgroundSize:"44px 44px"
            }}/>
            <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 60% 50% at 50% 60%, rgba(124,92,191,0.16) 0%, transparent 70%)" }}/>

            <div className="relative z-10 flex-shrink-0">
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width:"40px", height:"40px", background:"linear-gradient(135deg,#5c3fa0,#7c5cbf)", boxShadow:"0 4px 18px rgba(124,92,191,0.55)" }}>
                  <svg viewBox="0 0 24 24" style={{ width:"20px", height:"20px" }} fill="white">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:700, color:"#e8e0f8", lineHeight:1 }}>
                    College<span style={{ color:"#9b7dd4" }}>Hub</span>
                  </div>
                  <div style={{ fontSize:"0.6rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(155,125,212,0.55)", marginTop:"2px" }}>
                    Campus Portal
                  </div>
                </div>
              </div>

              <div style={{ width:"44px", height:"2px", borderRadius:"2px", marginBottom:"14px", background:"linear-gradient(90deg,#7c5cbf,rgba(124,92,191,0))" }}/>

              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.7rem", fontWeight:700, color:"#e8e0f8", lineHeight:1.3, marginBottom:"8px", maxWidth:"260px" }}>
                Join us and{" "}
                <em style={{ fontStyle:"italic", color:"#9b7dd4" }}>unlock</em>{" "}
                your campus
              </h2>

              <p style={{ fontSize:"0.76rem", fontWeight:300, color:"rgba(180,160,230,0.5)", lineHeight:1.65, maxWidth:"255px", marginBottom:"14px" }}>
                Create your account to access announcements, events, clubs, and your full academic community.
              </p>

              <div className="flex gap-2 flex-wrap">
                {[{label:"5,000+ Students",cls:"ch-pill-a"},{label:"Live Events",cls:"ch-pill-b"}].map(({label,cls})=>(
                  <div key={label} className={`${cls} flex items-center gap-2 rounded-full`}
                    style={{ background:"rgba(124,92,191,0.2)", border:"1px solid rgba(124,92,191,0.3)", padding:"5px 12px" }}>
                    <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#9b7dd4", boxShadow:"0 0 6px rgba(155,125,212,0.7)", flexShrink:0 }}/>
                    <span style={{ fontSize:"0.67rem", fontWeight:500, color:"rgba(180,160,230,0.9)", whiteSpace:"nowrap" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-end justify-center" style={{ marginTop:"8px" }}>
              <AcademicIllustration />
            </div>
          </div>

       
          <div className="flex flex-col justify-center relative overflow-hidden"
            style={{ flex:"1", padding:"32px 40px",
              background:"linear-gradient(160deg,#2a2240 0%,#221c38 55%,#1a152c 100%)" }}>

            <div className="absolute top-0 right-0 pointer-events-none" style={{ width:"200px", height:"200px", background:"radial-gradient(circle at top right, rgba(124,92,191,0.1) 0%, transparent 70%)" }}/>
            <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width:"160px", height:"160px", background:"radial-gradient(circle at bottom left, rgba(92,63,160,0.08) 0%, transparent 70%)" }}/>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage:"linear-gradient(rgba(124,92,191,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,191,0.04) 1px,transparent 1px)",
              backgroundSize:"44px 44px"
            }}/>

           
            <div className="ch-up-1" style={{ marginBottom:"16px" }}>
              <div style={{ fontSize:"0.62rem", fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:"#7c5cbf", marginBottom:"4px" }}>
                Student Portal
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.2rem", fontWeight:700, color:"#e8e0f8", lineHeight:1, marginBottom:"6px" }}>
                Create Account
              </h1>
              <div style={{ width:"34px", height:"2px", borderRadius:"2px", background:"linear-gradient(90deg,#5c3fa0,#9b7dd4)", marginBottom:"6px" }}/>
              <p style={{ fontSize:"0.74rem", color:"rgba(180,160,230,0.43)", fontWeight:300 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color:"#9b7dd4", fontWeight:600, textDecoration:"none", borderBottom:"1px solid rgba(155,125,212,0.35)" }}>
                  Sign in
                </Link>
              </p>
            </div>

            
            <form onSubmit={handleSubmit} className="ch-up-2">
              <div className="flex flex-col gap-3">

              
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name">
                    <div className="flex items-center justify-center flex-shrink-0" style={{ width:"38px", color:iconColor }}>
                      <svg viewBox="0 0 24 24" style={{ width:"15px", height:"15px" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Your full name"
                      className="flex-1 border-none bg-transparent" style={inputStyle}/>
                  </Field>

                  <Field label="Email Id">
                    <div className="flex items-center justify-center flex-shrink-0" style={{ width:"38px", color:iconColor }}>
                      <svg viewBox="0 0 24 24" style={{ width:"15px", height:"15px" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="you@college.com"
                      className="flex-1 border-none bg-transparent" style={inputStyle}/>
                  </Field>
                </div>

               
                <Field label="Password">
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width:"38px", color:iconColor }}>
                    <svg viewBox="0 0 24 24" style={{ width:"15px", height:"15px" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="flex-1 border-none bg-transparent" style={inputStyle}/>
                </Field>

                
                <div className={`grid gap-3 ${rolesWithDept.includes(formData.role) ? "grid-cols-2" : "grid-cols-1"}`}>
                  <Field label="Register As">
                    <div className="flex items-center justify-center flex-shrink-0" style={{ width:"38px", color:iconColor }}>
                      <svg viewBox="0 0 24 24" style={{ width:"15px", height:"15px" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <select name="role" value={formData.role} onChange={handleChange}
                      className="flex-1 border-none bg-transparent appearance-none cursor-pointer" style={inputStyle}>
                      <option value="">Select your role</option>
                      {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </Field>

                  
                  {rolesWithDept.includes(formData.role) && (
                    <Field label="Department">
                      <div className="flex items-center justify-center flex-shrink-0" style={{ width:"38px", color:iconColor }}>
                        <svg viewBox="0 0 24 24" style={{ width:"15px", height:"15px" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <select name="department" value={formData.department} onChange={handleChange}
                        className="flex-1 border-none bg-transparent appearance-none cursor-pointer" style={inputStyle}>
                        <option value="">Select department</option>
                        {dummyDepartments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                      </select>
                    </Field>
                  )}
                </div>

                
                {formData.role === "Organization" && (
                  <div style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"10px", padding:"9px 13px" }}>
                    <p style={{ fontSize:"0.71rem", color:"rgba(232,201,122,0.75)", lineHeight:1.5 }}>
                      Organisation accounts require <strong>admin approval</strong> before posting. You will be notified once approved.
                    </p>
                  </div>
                )}

                
                {formData.role === "Cell" && (
                  <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"10px", padding:"9px 13px" }}>
                    <p style={{ fontSize:"0.71rem", color:"rgba(147,197,253,0.75)", lineHeight:1.5 }}>
                      Cell accounts can post directly to all students without approval.
                    </p>
                  </div>
                )}

                
                {formError && (
                  <div style={{ background:"rgba(220,38,38,0.09)", border:"1px solid rgba(220,38,38,0.28)", borderRadius:"10px", padding:"9px 14px" }}>
                    <p style={{ fontSize:"0.79rem", color:"#fca5a5", margin:0 }}>{formError}</p>
                  </div>
                )}

                
                {successMsg && (
                  <div style={{ background:"rgba(34,197,94,0.09)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"10px", padding:"9px 14px" }}>
                    <p style={{ fontSize:"0.79rem", color:"#86efac", margin:0 }}>{successMsg}</p>
                  </div>
                )}

                
                <button type="submit"
                  className="ch-btn w-full rounded-xl text-white relative overflow-hidden"
                  style={{ padding:"13px", fontSize:"0.79rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                    letterSpacing:"2.5px", textTransform:"uppercase", border:"none", cursor:"pointer",
                    background:"linear-gradient(135deg,#5c3fa0 0%,#7c5cbf 50%,#6a4db0 100%)",
                    boxShadow:"0 5px 22px rgba(124,92,191,0.5)" }}>
                  <span className="relative z-10">Create Account</span>
                  <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)" }}/>
                </button>

              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}

export default Register
