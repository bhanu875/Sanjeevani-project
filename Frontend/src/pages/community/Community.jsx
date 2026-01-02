import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../../components/CreatePostModal";

const BACKEND_URL = "http://localhost:5000";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState(null);
  const [imageUpdateTime, setImageUpdateTime] = useState(null);
  const navigate = useNavigate();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Create post modal
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  /* ================= AUTH ================= */
  const token = localStorage.getItem("token");

  const userId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  /* ================= CANVAS PARTICLES ================= */
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight - 64;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const COUNT = 1200;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 1.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mouse.current.x !== null) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.8;
            p.vy += (dy / dist) * force * 0.8;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(76,175,80,0.45)";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY - 64;
    };

    const onLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = () => {
    axios
      .get(`${BACKEND_URL}/api/community`)
      .then((res) => setPosts(res.data?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= SEARCH USERS ================= */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (!token) return;

    const searchUsers = async () => {
      setSearchLoading(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(res.data.users || []);
        setShowSearchResults(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, token]);

  /* ================= CLOSE SEARCH ON CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest('[data-search-container]')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

  /* ================= HANDLE POST CREATED ================= */
  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the list
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePostModal(false);
  };

  /* ================= LISTEN FOR PROFILE IMAGE UPDATES ================= */
  useEffect(() => {
    // Check for existing update timestamp on mount
    const storedTime = localStorage.getItem('profileImageUpdateTime');
    if (storedTime) {
      setImageUpdateTime(parseInt(storedTime));
    }

    // Listen for profile image updates from other components
    const handleProfileImageUpdate = (event) => {
      const updateTime = event.detail?.updateTime || 
                         parseInt(localStorage.getItem('profileImageUpdateTime') || '0');
      if (updateTime) {
        setImageUpdateTime(updateTime);
        // Refetch posts to get updated profile images
        axios
          .get(`${BACKEND_URL}/api/community`)
          .then((res) => setPosts(res.data?.data || []))
          .catch((err) => console.error("Failed to refetch posts:", err));
      }
    };
    
    // Listen for custom event
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    
    // Also listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'profileImageUpdateTime' && e.newValue) {
        setImageUpdateTime(parseInt(e.newValue));
        // Refetch posts to get updated profile images
        axios
          .get(`${BACKEND_URL}/api/community`)
          .then((res) => setPosts(res.data?.data || []))
          .catch((err) => console.error("Failed to refetch posts:", err));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /* ================= HELPER: GET PROFILE IMAGE WITH CACHE-BUSTING ================= */
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return "/avatar.png";
    
    // Add cache-busting parameter if image was recently updated
    if (imageUpdateTime) {
      const separator = profileImage.includes('?') ? '&' : '?';
      return `${BACKEND_URL}${profileImage}${separator}t=${imageUpdateTime}`;
    }
    
    return `${BACKEND_URL}${profileImage}`;
  };

  /* ================= LIKE / UNLIKE ================= */
  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/community/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.likes) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, likes: res.data.likes } : p
          )
        );
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  /* ================= COMMENT ================= */
  const handleComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/community/${postId}/comment`,
        { text: commentText[postId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.comments) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, comments: res.data.comments } : p
          )
        );
      }

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "64px" }} />

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background: "#f2ebe3",
        }}
      />

      <div style={styles.container}>
        {/* HEADER WITH SEARCH AND CREATE POST */}
        <div style={styles.header}>
          <h2 style={styles.heading}>🌿 Community</h2>
          
          {/* SEARCH BAR - INSTAGRAM STYLE */}
          <div style={styles.searchContainer} data-search-container>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  style={styles.clearSearch}
                >
                  ✕
                </button>
              )}
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            {showSearchResults && (
              <div style={styles.searchResults}>
                {searchLoading ? (
                  <div style={styles.searchLoading}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      style={styles.searchResultItem}
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >
                      <img
                        src={
                          user.profileImage
                            ? `${BACKEND_URL}${user.profileImage}`
                            : "/avatar.png"
                        }
                        alt={user.name}
                        style={styles.searchAvatar}
                      />
                      <div style={styles.searchUserInfo}>
                        <div style={styles.searchUserName}>{user.name}</div>
                        <div style={styles.searchUserEmail}>{user.email}</div>
                      </div>
                      {user.isFollowing && (
                        <span style={styles.followingBadge}>Following</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={styles.noResults}>No users found</div>
                )}
              </div>
            )}
          </div>

          {/* CREATE POST BUTTON */}
          {token && (
            <button
              onClick={() => setShowCreatePostModal(true)}
              style={styles.createPostBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(76,175,80,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(76,175,80,0.3)";
              }}
            >
              ➕ Create Post
            </button>
          )}
        </div>

        {loading && <p>Loading posts...</p>}

        {!loading &&
          posts
            .filter((post) => post && post.user)
            .map((post) => (
              <div key={post._id} style={styles.card}>
                <div style={styles.userRow}>
                  <img
                    src={getProfileImageUrl(post.user?.profileImage)}
                    alt="profile"
                    style={styles.avatar}
                  />
                  <span style={styles.userName}>
                    {post.user?.name || "Unknown User"}
                  </span>
                </div>

                <p style={styles.content}>{post.content}</p>

                {post.herbName && (
                  <div style={styles.herb}>🌱 {post.herbName}</div>
                )}

                {post.images?.length > 0 && (
                  <div style={styles.imageRow}>
                    {post.images.map((img, i) => (
                      <div key={i} style={styles.imageBox}>
                        <img
                          src={`${BACKEND_URL}${img}`}
                          alt=""
                          style={styles.image}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.footer}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>

                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenComments(
                        openComments === post._id ? null : post._id
                      )
                    }
                  >
                    💬 {post.comments?.length || 0}
                  </span>
                </div>

                {openComments === post._id && (
                  <div style={{ marginTop: "14px" }}>
                    {post.comments?.length > 0 && (
                      <div style={styles.commentsList}>
                        {post.comments.map((c, i) => {
                          if (!c || !c.text) return null;

                          const isYou =
                            c.user?._id === userId ||
                            c.user?.name === "You";

                          const displayName = isYou
                            ? "You"
                            : c.user?.name || "User";

                          const avatar = getProfileImageUrl(
                            c.user?.profileImage?.startsWith("/uploads")
                              ? c.user.profileImage
                              : null
                          );

                          return (
                            <div key={i} style={styles.commentItem}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (
                                    c.user?._id &&
                                    c.user._id !== userId
                                  ) {
                                    navigate(`/profile/${c.user._id}`);
                                  }
                                }}
                              >
                                <img
                                  src={avatar}
                                  alt="pfp"
                                  style={styles.commentAvatar}
                                />
                                <div>
                                  <strong>{displayName}</strong>
                                  <div>{c.text}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div style={styles.commentBox}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [post._id]: e.target.value,
                          })
                        }
                        style={styles.commentInput}
                      />
                      <button
                        style={styles.commentBtn}
                        onClick={() => handleComment(post._id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

        {/* CREATE POST MODAL */}
        {showCreatePostModal && (
          <CreatePostModal
            onClose={() => setShowCreatePostModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    </>
  );
};

export default Community;

/* ================= STYLES ================= */

const styles = {
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: "34px",
    marginBottom: "0",
    color: "#3e2a14",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "24px",
    padding: "10px 16px",
    border: "2px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  searchIcon: {
    fontSize: "18px",
    marginRight: "10px",
    color: "#666",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
    color: "#333",
  },
  clearSearch: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#999",
    padding: "0",
    marginLeft: "8px",
  },
  searchResults: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "8px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: 1000,
    border: "1px solid #e0e0e0",
  },
  searchResultItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.2s",
  },
  searchResultItemHover: {
    background: "#f5f5f5",
  },
  searchAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #e0e0e0",
  },
  searchUserInfo: {
    flex: 1,
  },
  searchUserName: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#333",
  },
  searchUserEmail: {
    fontSize: "12px",
    color: "#666",
    marginTop: "2px",
  },
  followingBadge: {
    fontSize: "12px",
    color: "#4caf50",
    fontWeight: 600,
  },
  searchLoading: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  noResults: {
    padding: "20px",
    textAlign: "center",
    color: "#999",
  },
  createPostBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
    color: "white",
    border: "none",
    borderRadius: "24px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
    transition: "all 0.3s",
  },
  createPostBtnHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(76,175,80,0.4)",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "18px",
    padding: "26px",
    marginBottom: "34px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.1)",
  },
  userRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
  },
  userName: {
    fontWeight: 600,
  },
  content: {
    marginTop: 12,
    lineHeight: 1.7,
  },
  herb: {
    marginTop: 10,
    padding: "6px 14px",
    borderRadius: "20px",
    background: "#e4f1e6",
    color: "#2e7d32",
    display: "inline-block",
  },
  imageRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginTop: "16px",
  },
  imageBox: {
    width: "100%",
    height: "160px",
    background: "#f5f5f5",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  footer: {
    marginTop: 18,
    display: "flex",
    gap: 30,
    color: "#6d5a43",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  commentBox: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  },
  commentInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #ddd",
  },
  commentBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  commentsList: {
    marginTop: "10px",
  },
  commentItem: {
    display: "flex",
    gap: "10px",
    padding: "8px 0",
    fontSize: "14px",
  },
  commentAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};
