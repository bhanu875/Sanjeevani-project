import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/community";
const BACKEND_URL = "http://localhost:5000";

/* ================= SAFE LIKE CHECK ================= */
const hasUserLiked = (likes, userId) => {
  if (!likes || !userId) return false;
  return likes.some((like) =>
    typeof like === "string"
      ? like === userId
      : like?._id?.toString() === userId
  );
};

export default function PostViewerModal({ post, onClose, onPostUpdate }) {
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  /* ================= IMAGES ================= */
  const images = post.images?.length
    ? post.images
    : post.image
    ? [post.image]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  /* ================= LIKE ================= */
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  /* ================= HEART ================= */
  const [showHeart, setShowHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  /* ================= COMMENTS ================= */
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  /* 🔒 LOCK BACKGROUND SCROLL */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* 🔁 SYNC POST */
  useEffect(() => {
    setComments(post.comments || []);
    setLikesCount(post.likes?.length || 0);
    setLiked(hasUserLiked(post.likes, userId));
    setCurrentIndex(0);
    setDirection(0);
  }, [post, userId]);

  /* ================= IMAGE NAV ================= */
  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  };

  const goToIndex = (i) => {
    if (i === currentIndex) return;
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  /* ⌨️ KEYBOARD SUPPORT */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, images.length]);

  /* ❤️ LIKE */
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${API}/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
      onPostUpdate?.({ ...post, likes: res.data.likes });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  /* DOUBLE TAP / CLICK */
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!liked) handleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 600);
    }
    setLastTap(now);
  };

  const handleDesktopDoubleClick = () => {
    if (!liked) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
  };

  /* 💬 COMMENT */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API}/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res.data.comments);
      setCommentText("");
      onPostUpdate?.({ ...post, comments: res.data.comments });
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center pt-20"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[900px] h-[600px] rounded-xl overflow-hidden flex"
      >
        {/* ================= IMAGE SECTION ================= */}
        <div className="w-2/3 bg-black flex flex-col items-center justify-center">
          <div
            className="relative w-full h-full overflow-hidden flex items-center justify-center"
            onClick={handleDoubleTap}
            onDoubleClick={handleDesktopDoubleClick}
          >
            <img
              key={currentIndex}
              src={`${BACKEND_URL}${images[currentIndex]}`}
              className={`max-w-full max-h-full object-contain
                transition-transform duration-500 ease-in-out
                ${
                  direction === 1
                    ? "animate-slide-left"
                    : direction === -1
                    ? "animate-slide-right"
                    : ""
                }
              `}
              draggable={false}
              alt="post"
            />

            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2
                           bg-black/50 text-white text-3xl px-3 py-1
                           rounded-full hover:bg-black/70 z-10"
              >
                ‹
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           bg-black/50 text-white text-3xl px-3 py-1
                           rounded-full hover:bg-black/70 z-10"
              >
                ›
              </button>
            )}

            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-6xl">❤️</span>
              </div>
            )}
          </div>

          {/* 🔘 SMALL DOT INDICATORS */}
          {images.length > 1 && (
            <div className="flex gap-2 py-3">
              {images.map((_, i) => (
                <span
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all
                    ${
                      i === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-1/3 flex flex-col p-4">
          <button
            onClick={handleLike}
            className="text-2xl mb-1 self-start"
          >
            {liked ? "❤️" : "🤍"}
          </button>

          <span className="text-sm text-gray-600 mb-2">
            {likesCount} likes
          </span>

          {post.herbName?.trim() && (
            <p className="text-lg font-semibold text-green-800 mb-1">
              Plant: {post.herbName}
            </p>
          )}

          <p className="text-sm text-gray-800 mb-3">
            {post.content?.trim() || (
              <span className="text-gray-400 italic">
                No description provided
              </span>
            )}
          </p>

          <div className="border-t border-gray-200 mb-3" />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet</p>
            ) : (
              comments.map((c, i) => (
                <p key={i} className="text-sm">
                  <strong>{c.user?.name || "User"}:</strong> {c.text}
                </p>
              ))
            )}
          </div>

          <div className="flex mt-2 border-t pt-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border px-2 py-1 text-sm rounded resize-none"
              placeholder="Add a comment..."
              rows={2}
            />
            <button
              onClick={handleComment}
              className="ml-2 text-green-700 font-semibold text-sm"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
