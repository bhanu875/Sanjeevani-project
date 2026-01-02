import { useState } from "react";
import { createCommunityPost } from "../api/communityApi";

const CreateCommunityPost = ({ plant, plantPart, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [application, setApplication] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please share your experience.");
      return;
    }

    if (!plant || !plantPart) {
      alert("Plant and plant part are required.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("plant", plant);
    formData.append("plantPart", plantPart);

    if (application.trim()) {
      formData.append("application", application.trim());
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);
      const res = await createCommunityPost(formData, token);

      setContent("");
      setApplication("");
      setImages([]);

      onPostCreated(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 mb-8">
      <h3 className="text-lg font-semibold mb-3">
        Share your experience using{" "}
        <span className="text-green-700 font-medium">
          {plantPart}
        </span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* OPTIONAL APPLICATION */}
        <input
          type="text"
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          placeholder="Application (e.g. Skin care, Digestion)"
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Describe how this plant part helped you…"
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {/* IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm"
        >
          {loading ? "Posting..." : "Post Experience"}
        </button>
      </form>
    </div>
  );
};

export default CreateCommunityPost;
