import { dummyAnnouncements, dummyUsers, dummyOrganizations } from "./dummyData"

// ─── Auth ───────────────────────────────────────────
export const loginUser = (email, password) => {
  const user = dummyUsers.find((u) => u.email === email)
  if (user) return { success: true, user }
  return { success: false, message: "Invalid email or password" }
}

export const registerUser = (data) => {
  console.log("Register payload:", data)
  return { success: true, message: "Registered successfully" }
}

// ─── Announcements ──────────────────────────────────
export const getAnnouncements = () => {
  return dummyAnnouncements
}

export const getAnnouncementsByDept = (department) => {
  return dummyAnnouncements.filter(
    (a) => a.targetAudience === "all" || a.department === department
  )
}

export const createAnnouncement = (data) => {
  console.log("New announcement:", data)
  return { success: true, message: "Announcement created" }
}

export const deleteAnnouncement = (id) => {
  console.log("Delete announcement:", id)
  return { success: true, message: "Announcement deleted" }
}

// ─── Users ──────────────────────────────────────────
export const getAllUsers = () => {
  return dummyUsers
}

export const getUserById = (id) => {
  return dummyUsers.find((u) => u._id === id)
}

// ─── Organizations ───────────────────────────────────
export const getOrganizations = () => {
  return dummyOrganizations
}

export const getPendingOrganizations = () => {
  return dummyOrganizations.filter((o) => !o.isApproved)
}

export const approveOrganization = (id) => {
  console.log("Approve org:", id)
  return { success: true, message: "Organization approved" }
}

// ─── NOTE FOR BACKEND INTEGRATION ───────────────────
// When backend is ready, replace each function body with
// an axios call. Example:
//
// export const getAnnouncements = () =>
//   axios.get('/api/announcements').then(res => res.data)
//
// Nothing in components needs to change — only this file.