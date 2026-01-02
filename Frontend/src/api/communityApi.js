import axios from "axios";

const API = "http://localhost:5000/api/community";

/* =========================
   FETCH POSTS BY PLANT + PART
========================= */
/**
 * @param {string} plantId - MongoDB Plant _id
 * @param {string} part - Plant part (Leaves, Root, Bark, etc.)
 */
export const getPostsByPlant = (plantId, part) => {
  if (!plantId) {
    throw new Error("plantId is required");
  }

  const url = part
    ? `${API}/plant/${plantId}?part=${encodeURIComponent(part)}`
    : `${API}/plant/${plantId}`;

  return axios.get(url);
};

/* =========================
   CREATE COMMUNITY POST
========================= */
/**
 * formData must include:
 * - content
 * - plant
 * - plantPart
 * - optional images[]
 */
export const createCommunityPost = (formData, token) => {
  return axios.post(`${API}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================
   LIKE / UNLIKE POST
========================= */
export const likePost = (postId, token) => {
  return axios.put(
    `${API}/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/* =========================
   ADD COMMENT
========================= */
export const addComment = (postId, text, token) => {
  return axios.post(
    `${API}/${postId}/comment`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
