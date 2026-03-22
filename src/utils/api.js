
import { dummyAnnouncements, dummyUsers, dummyOrganizations } from "./dummyData"

const REGISTERED_USERS_KEY = "ch_registered_users"
const APPROVED_ORGS_KEY    = "ch_approved_orgs"
const REJECTED_ORGS_KEY    = "ch_rejected_orgs"


const getRegisteredUsers = () => {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

const getApprovedOrgIds = () => {
  try {
    const stored = localStorage.getItem(APPROVED_ORGS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch { return new Set() }
}

const getRejectedOrgIds = () => {
  try {
    const stored = localStorage.getItem(REJECTED_ORGS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch { return new Set() }
}

const getRegisteredOrgUsers = () => {
  return getRegisteredUsers().filter((u) => u.role === "Organization")
}


export const loginUser = (email, password) => {
  const dummyUser = dummyUsers.find((u) => u.email === email)
  if (dummyUser) return { success: true, user: dummyUser }

  const registeredUsers = getRegisteredUsers()
  const registeredUser  = registeredUsers.find(
    (u) => u.email === email && u.password === password
  )
  if (registeredUser) {
    const { password: _, ...safeUser } = registeredUser
    return { success: true, user: safeUser }
  }

  const emailExists = registeredUsers.find((u) => u.email === email)
  if (emailExists) return { success: false, message: "Incorrect password" }

  return { success: false, message: "No account found with this email" }
}

export const registerUser = (data) => {
  const registeredUsers = getRegisteredUsers()

  const emailExistsInDummy      = dummyUsers.find((u) => u.email === data.email)
  const emailExistsInRegistered = registeredUsers.find((u) => u.email === data.email)

  if (emailExistsInDummy || emailExistsInRegistered) {
    return { success: false, message: "Email already registered" }
  }

  const newUser = {
    _id:        `u_${Date.now()}`,
    name:       data.name,
    email:      data.email,
    password:   data.password,
    role:       data.role,
    department: data.department || null,
  }

  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...registeredUsers, newUser]))
    return { success: true, message: "Registered successfully" }
  } catch {
    return { success: false, message: "Registration failed. Please try again." }
  }
}


export const getAnnouncements = () => dummyAnnouncements

export const getAnnouncementsByDept = (department) =>
  dummyAnnouncements.filter(
    (a) => a.targetAudience === "all" || a.department === department
  )

export const createAnnouncement = (data) => {
  console.log("New announcement:", data)
  return { success: true, message: "Announcement created" }
}

export const deleteAnnouncement = (id) => {
  console.log("Delete announcement:", id)
  return { success: true, message: "Announcement deleted" }
}


export const getAllUsers = () => {
  const registered = getRegisteredUsers().map(({ password: _, ...u }) => u)
  return [...dummyUsers, ...registered]
}

export const getUserById = (id) => getAllUsers().find((u) => u._id === id)



export const getOrganizations = () => dummyOrganizations

export const getPendingOrganizations = () => {
  
  const approvedIds = getApprovedOrgIds()
  const rejectedIds = getRejectedOrgIds()

  const dummyPending = dummyOrganizations
    .filter((o) => !o.isApproved && !approvedIds.has(o._id) && !rejectedIds.has(o._id))

  const registeredPending = getRegisteredOrgUsers()
    .filter((u) => !approvedIds.has(u._id) && !rejectedIds.has(u._id))
    .map((u) => ({
      _id:              u._id,
      name:             u.name,
      email:            u.email,
      description:      `New organisation registration — ${u.email}`,
      isApproved:       false,
      fromRegistration: true,
    }))

  return [...dummyPending, ...registeredPending]
}

export const approveOrganization = (id) => {
  try {
    const approvedIds = getApprovedOrgIds()
    approvedIds.add(id)
    localStorage.setItem(APPROVED_ORGS_KEY, JSON.stringify([...approvedIds]))
    return { success: true, message: "Organization approved" }
  } catch {
    return { success: false, message: "Approval failed" }
  }
}

export const rejectOrganization = (id) => {
  try {
    const rejectedIds = getRejectedOrgIds()
    rejectedIds.add(id)
    localStorage.setItem(REJECTED_ORGS_KEY, JSON.stringify([...rejectedIds]))
    return { success: true, message: "Organization rejected" }
  } catch {
    return { success: false, message: "Rejection failed" }
  }
}


export const isOrgApproved = (orgName) => {
  const approvedIds = getApprovedOrgIds()

 
  const dummyOrg = dummyOrganizations.find((o) => o.name === orgName)
  if (dummyOrg) {
    if (dummyOrg.isApproved) return true
    return approvedIds.has(dummyOrg._id)
  }

  
  const registeredOrg = getRegisteredOrgUsers().find((u) => u.name === orgName)
  if (registeredOrg) return approvedIds.has(registeredOrg._id)

  return false
}


