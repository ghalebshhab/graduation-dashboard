import axiosClient from "./axiosClient";

const unwrapApiResponse = (response) => response.data;

const normalizeLocation = (location) => ({
  ...location,
  id: location.id ?? location.locationId,
  imageUrl: location.imageUrl ?? location.logoUrl ?? location.coverUrl,
  governorate: location.governorate ?? location.governorateName,
  approved: location.approved ?? location.isApproved ?? location.status === "PUBLISHED",
  active: location.active ?? location.isActive,
});

const getActivityStatus = (activity) => {
  if (activity.status) return activity.status;

  const statusMap = {
    1: "PENDING",
    2: "APPROVED",
    3: "REJECTED",
    4: "CANCELLED",
    5: "COMPLETED",
    6: "POSTPONED",
  };

  return statusMap[Number(activity.statusId)] || "PENDING";
};

const getFirstSchedule = (activity) => {
  if (!Array.isArray(activity.schedules) || activity.schedules.length === 0) {
    return null;
  }

  return activity.schedules[0];
};

const normalizeActivity = (activity) => {
  const firstSchedule = getFirstSchedule(activity);

  return {
    ...activity,
    id: activity.id,
    status: getActivityStatus(activity),
    governorate: activity.governorate ?? activity.governorateName,
    date: activity.date ?? firstSchedule?.date,
    time: activity.time ?? firstSchedule?.startTime,
    locationName:
      activity.locationName ?? activity.activityLocation ?? "Not specified",
  };
};

const normalizeListResponse = (response, normalizer) => {
  const data = unwrapApiResponse(response);

  if (data?.success && Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.map(normalizer),
    };
  }

  if (Array.isArray(data)) {
    return data.map(normalizer);
  }

  return data;
};

export const getAdminStats = async () => {
  const response = await axiosClient.get("/api/admin/dashboard/stats");
  return unwrapApiResponse(response);
};

export const getAdminUsers = async () => {
  const response = await axiosClient.get("/api/admin/users");
  return unwrapApiResponse(response);
};

export const blockUser = async (userId) => {
  const response = await axiosClient.put(`/api/admin/users/${userId}/block`);
  return unwrapApiResponse(response);
};

export const unblockUser = async (userId) => {
  const response = await axiosClient.put(`/api/admin/users/${userId}/unblock`);
  return unwrapApiResponse(response);
};

export const getPendingPlaces = async () => {
  const response = await axiosClient.get("/api/admin/locations/pending");
  return normalizeListResponse(response, normalizeLocation);
};

export const getAllPlaces = async () => {
  const response = await axiosClient.get("/api/admin/locations/all");
  return normalizeListResponse(response, normalizeLocation);
};

export const approvePlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/locations/${placeId}/approve`
  );
  return unwrapApiResponse(response);
};

export const rejectPlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/locations/${placeId}/reject`
  );
  return unwrapApiResponse(response);
};

export const deactivatePlace = async (placeId) => {
  const response = await axiosClient.put(
    `/api/admin/locations/${placeId}/deactivate`
  );
  return unwrapApiResponse(response);
};

export const getAdminPosts = async () => {
  const response = await axiosClient.get("/api/admin/posts");
  return unwrapApiResponse(response);
};

export const deletePostByAdmin = async (postId) => {
  const response = await axiosClient.put(`/api/admin/posts/${postId}/delete`);
  return unwrapApiResponse(response);
};

export const getReports = async () => {
  const response = await axiosClient.get("/api/admin/reports");
  return unwrapApiResponse(response);
};

export const resolveReport = async (reportId) => {
  const response = await axiosClient.put(
    `/api/admin/reports/${reportId}/resolve`
  );
  return unwrapApiResponse(response);
};

// =========================
// ACTIVITIES
// =========================

export const getAdminEvents = async () => {
  const response = await axiosClient.get("/api/admin/Activities");
  return normalizeListResponse(response, normalizeActivity);
};

export const approveEvent = async (eventId) => {
  const response = await axiosClient.put(
    `/api/admin/Activities/${eventId}/approve`
  );
  return unwrapApiResponse(response);
};

export const rejectEvent = async (eventId) => {
  const response = await axiosClient.put(
    `/api/admin/Activities/${eventId}/reject`
  );
  return unwrapApiResponse(response);
};
