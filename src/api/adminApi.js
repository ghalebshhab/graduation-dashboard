import axiosClient from "./axiosClient";

export const getAdminStats = async () => {
  const response = await axiosClient.get("/api/admin/dashboard/stats");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await axiosClient.get("/api/admin/users");
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await axiosClient.put(`/api/admin/users/${userId}/block`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await axiosClient.put(`/api/admin/users/${userId}/unblock`);
  return response.data;
};

export const getPendingPlaces = async () => {
  const response = await axiosClient.get("/api/admin/places/pending");
  return response.data;
};

export const getAllPlaces = async () => {
  const response = await axiosClient.get("/api/admin/places/all");
  return response.data;
};

export const approvePlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/places/${placeId}/approve`
  );
  return response.data;
};

export const rejectPlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/places/${placeId}/reject`
  );
  return response.data;
};

export const deactivatePlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/places/${placeId}/deactivate`
  );
  return response.data;
};

export const getAdminPosts = async () => {
  const response = await axiosClient.get("/api/admin/posts");
  return response.data;
};

export const deletePostByAdmin = async (postId) => {
  const response = await axiosClient.put(`/api/admin/posts/${postId}/delete`);
  return response.data;
};

export const getReports = async () => {
  const response = await axiosClient.get("/api/admin/reports");
  return response.data;
};

export const resolveReport = async (reportId) => {
  const response = await axiosClient.put(
    `/api/admin/reports/${reportId}/resolve`
  );
  return response.data;
};

// =========================
// EVENTS
// =========================

export const getAdminEvents = async () => {
  const response = await axiosClient.get("/api/admin/events");
  return response.data;
};

export const approveEvent = async (eventId) => {
  const response = await axiosClient.put(
    `/api/admin/events/${eventId}/approve`
  );
  return response.data;
};

export const rejectEvent = async (eventId) => {
  const response = await axiosClient.put(
    `/api/admin/events/${eventId}/reject`
  );
  return response.data;
};
