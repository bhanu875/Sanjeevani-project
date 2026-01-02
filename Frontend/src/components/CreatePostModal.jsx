import { useState } from "react";

const BACKEND_URL = "http://localhost:5000";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [content, setContent] = useState("");
  const [herbName, setHerbName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // ✅ FIX
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("content", content);
    if (herbName.trim()) {
      formData.append("herbName", herbName);
    }

    // ✅ APPEND MULTIPLE IMAGES
    selectedImages.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/community`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Post failed");
        return;
      }

      onPostCreated(data.data);
      onClose();
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white w-[420px] rounded-xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Create Post</h3>

        <textarea
          className="w-full border rounded p-2 mb-3"
          placeholder="Share your thoughts…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="Herb name (optional)"
          value={herbName}
          onChange={(e) => setHerbName(e.target.value)}
        />

        {/* ✅ MULTI IMAGE INPUT */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setSelectedImages(Array.from(e.target.files))
          }
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
