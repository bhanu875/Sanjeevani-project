import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/community";
const BACKEND_URL = "http://localhost:5000";

export default function CommunityPostCard({ post }) {
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  /* ================= IMAGE HANDLING ================= */
  const images = post.images?.length
    ? post.images
    : post.image
    ? [post.image]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= LIKE STATE ================= */
 const [liked, setLiked] = useState(
  post.likes?.some(
    (id) => id.toString() === userId
  )
);

  const [likesCount, setLikesCount] = useState(
    post.likes?.length || 0
  );

  /* ================= COMMENT STATE ================= */
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  /* ❤️ LIKE */
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${API}/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  /* 💬 COMMENT */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API}/${post._id}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  return (
    <div className="post-card">

      {/* ================= IMAGE ================= */}
      {images.length > 0 && (
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={`${BACKEND_URL}${images[currentIndex]}`}
            alt="post"
            className="w-full h-full object-cover"
          />

          {/* SLIDER CONTROLS */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentIndex((i) =>
                    i === 0 ? images.length - 1 : i - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2
                           bg-black/40 text-white px-2 py-1 rounded-full"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setCurrentIndex((i) =>
                    i === images.length - 1 ? 0 : i + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2
                           bg-black/40 text-white px-2 py-1 rounded-full"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <p className="mt-3 text-sm">
        {post.content}
      </p>

      {/* ================= ACTION BAR ================= */}
      <div className="post-actions">
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"}
        </button>

        <button
          className="text-xl"
          onClick={() => setShowComments(!showComments)}
        >
          💬
        </button>
      </div>

      <span className="likes-count">
        {likesCount} likes
      </span>

      {/* ================= COMMENTS (HIDDEN BY DEFAULT) ================= */}
      {showComments && (
        <>
          <div className="comments">
            {comments.map((c, index) => (
              <p key={index}>
                <strong>{c.user?.name || "User"}:</strong>{" "}
                {c.text}
              </p>
            ))}
          </div>

          <div className="comment-box">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleComment}>
              Post
            </button>
          </div>
        </>
      )}
    </div>
  );
}
