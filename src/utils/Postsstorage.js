
import { dummyAnnouncements } from "./dummyData";

const POSTS_KEY = "ch_all_posts";

export const getSavedPosts = () => {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getAllPosts = () => {
  const saved = getSavedPosts();
  return [...saved, ...dummyAnnouncements];
};

export const getPostsByUser = (userId) => {
  return getAllPosts().filter((p) => p.postedBy._id === userId);
};

export const savePost = (post) => {
  try {
    const existing = getSavedPosts();
    const updated  = [post, ...existing]; // newest first
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

export const deletePost = (postId) => {
  try {
    const existing = getSavedPosts();
    const updated  = existing.filter((p) => p._id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

const DRAFT_KEY = (userId) => `ch_draft_${userId}`;

export const saveDraft = (userId, form) => {
  try { localStorage.setItem(DRAFT_KEY(userId), JSON.stringify(form)); } catch {
    console.log("Failed to save draft");
  }
};

export const loadDraft = (userId) => {
  try {
    const d = localStorage.getItem(DRAFT_KEY(userId));
    return d ? JSON.parse(d) : null;
  } catch { return null; }
};

export const clearDraft = (userId) => {
  try { localStorage.removeItem(DRAFT_KEY(userId)); } catch {
    console.log("Failed to clear draft");
  }
};