

const REQUESTS_KEY      = "ch_requests";
const NOTIF_KEY = (uid) => `ch_notifications_${uid}`;


export const getAllRequests = () => {
  try {
    const s = localStorage.getItem(REQUESTS_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

export const getRequestsByDept = (department) => {
  return getAllRequests().filter((r) => r.department === department);
};

export const getRequestsByUser = (userId) => {
  return getAllRequests().filter((r) => r.requestedBy._id === userId);
};

export const submitRequest = (requestData) => {
  try {
    const existing = getAllRequests();
    const newReq = {
      _id:         `req_${Date.now()}`,
      ...requestData,
      status:      "pending",
      reason:      "",
      createdAt:   new Date().toISOString().split("T")[0],
      resolvedAt:  null,
    };
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([newReq, ...existing]));
    return newReq;
  } catch { return null; }
};

export const approveRequest = (requestId, hodName) => {
  try {
    const all = getAllRequests();
    const req = all.find((r) => r._id === requestId);
    if (!req) return false;

    const updated = all.map((r) =>
      r._id === requestId
        ? { ...r, status: "approved", resolvedAt: new Date().toISOString().split("T")[0] }
        : r
    );
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));

    addNotification(req.requestedBy._id, {
      message: `✅ Your request "${req.title}" was approved by ${hodName}.`,
      type:    "success",
    });
    return true;
  } catch { return false; }
};

export const rejectRequest = (requestId, hodName, reason = "") => {
  try {
    const all = getAllRequests();
    const req = all.find((r) => r._id === requestId);
    if (!req) return false;

    const updated = all.map((r) =>
      r._id === requestId
        ? { ...r, status: "rejected", reason, resolvedAt: new Date().toISOString().split("T")[0] }
        : r
    );
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));

    addNotification(req.requestedBy._id, {
      message: `❌ Your request "${req.title}" was rejected${reason ? `: ${reason}` : ""}.`,
      type:    "error",
    });
    return true;
  } catch { return false; }
};


export const addNotification = (userId, { message, type = "info" }) => {
  try {
    const existing = getNotifications(userId);
    const newNotif = {
      _id:       `notif_${Date.now()}`,
      message,
      type,
      read:      false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem(NOTIF_KEY(userId), JSON.stringify([newNotif, ...existing]));
    return newNotif;
  } catch { return null; }
};

export const getNotifications = (userId) => {
  try {
    const s = localStorage.getItem(NOTIF_KEY(userId));
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

export const getUnreadCount = (userId) => {
  return getNotifications(userId).filter((n) => !n.read).length;
};

export const markAllRead = (userId) => {
  try {
    const notifs  = getNotifications(userId);
    const updated = notifs.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(updated));
  } catch {}
};

export const clearNotifications = (userId) => {
  try { localStorage.removeItem(NOTIF_KEY(userId)); } catch {}
};
