import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import FloatingPostButton from "../../components/FloatingPostButton";
import CreatePostModal from "../../components/CreatePostModal";
import PostViewerModal from "../../components/PostViewerModal";
import { useParams } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

const UserDashboard = () => {
  const { userId: profileUserId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPfpModal, setShowPfpModal] = useState(false);

  // Profile image preview
  const [pfpPreview, setPfpPreview] = useState(null);
  const [imageUpdateTime, setImageUpdateTime] = useState(null);
  const previewUrlRef = useRef(null); // Track object URL for cleanup

  // Selected post
  const [selectedPost, setSelectedPost] = useState(null);

  const token = localStorage.getItem("token");

  const loggedInUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  // WHOSE DASHBOARD
  const dashboardUserId = profileUserId || loggedInUserId;

  // OWNER OR VISITOR
  const isOwner = dashboardUserId === loggedInUserId;

  const getProfileImage = () => {
    if (pfpPreview) return pfpPreview;
    if (user?.profileImage) {
      // Add cache-busting parameter to force image refresh when updated
      // This is especially important for images with long filenames that browsers cache aggressively
      if (imageUpdateTime) {
        const separator = user.profileImage.includes('?') ? '&' : '?';
        return `${BACKEND_URL}${user.profileImage}${separator}t=${imageUpdateTime}`;
      }
      return `${BACKEND_URL}${user.profileImage}`;
    }
    return null;
  };

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          isOwner
            ? `${BACKEND_URL}/api/auth/me`
            : `${BACKEND_URL}/api/users/${dashboardUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("User fetch failed");

        const data = await res.json();
        const normalizedUser = data.user || data;
        setUser(normalizedUser);
        
        // Set follower/following counts if available
        if (normalizedUser.followersCount !== undefined) {
          setFollowersCount(normalizedUser.followersCount);
        }
        if (normalizedUser.followingCount !== undefined) {
          setFollowingCount(normalizedUser.followingCount);
        }
        if (normalizedUser.isFollowing !== undefined) {
          setIsFollowing(normalizedUser.isFollowing);
        }
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          isOwner
            ? `${BACKEND_URL}/api/community/my-posts`
            : `${BACKEND_URL}/api/community/user/${dashboardUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        console.warn("Posts fetch failed (non-blocking)");
      }
    };

    fetchUser()
      .then(fetchPosts)
      .finally(() => setLoading(false));
  }, []);

  const updatePostInState = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setSelectedPost(updatedPost);
  };

  /* ================= FOLLOW/UNFOLLOW FUNCTIONS ================= */
  const handleFollow = async () => {
    if (!token || !dashboardUserId || isOwner) return;

    setFollowLoading(true);
    try {
      const endpoint = isFollowing
        ? `${BACKEND_URL}/api/users/${dashboardUserId}/unfollow`
        : `${BACKEND_URL}/api/users/${dashboardUserId}/follow`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update follow status");
        setFollowLoading(false);
        return;
      }

      // Update state immediately for real-time effect
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
      setFollowingCount(data.followingCount);

      // Also update user object
      setUser((prev) => ({
        ...prev,
        followersCount: data.followersCount,
        followingCount: data.followingCount,
        isFollowing: data.isFollowing,
      }));
    } catch (err) {
      console.error("Follow/unfollow error:", err);
      alert("Failed to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <p className="pt-32 text-center text-gray-700 text-lg">
          Loading dashboard…
        </p>
      </>
    );
  }

  /* ================= USER FAIL SAFE ================= */
  if (!user) {
    const cachedUser = localStorage.getItem("user");

    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser(parsedUser);
        return null;
      } catch (err) {
        console.error("Failed to parse cached user:", err);
      }
    }

    return (
      <>
        <Navbar />
        <p className="pt-32 text-center text-gray-600 text-lg">
          Unable to load profile information.
        </p>
      </>
    );
  }


  return (
    <>
      <Navbar />

      {/* BACKGROUND LAYERS */}
      <div className="dashboard-bg" />
      <div className="dashboard-noise" />

      {/* ================= DASHBOARD ================= */}
      <div className="relative min-h-screen pt-28 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">

          {/* ================= PROFILE CARD ================= */}
          <div
            className="flex flex-col sm:flex-row items-center gap-40 mb-14
                       bg-white/90 backdrop-blur-md
                       border-2 border-green-700
                       rounded-2xl p-8 shadow-xl"
          >
            {/* LEFT */}
            <div className="flex items-center gap-6">
              <div
                onClick={() => isOwner && setShowPfpModal(true)}
                className={`relative w-28 h-28 rounded-full
                  border-4 border-green-700
                  bg-white overflow-hidden
                  ${isOwner ? "cursor-pointer" : "cursor-default"}`}
              >
                {getProfileImage() ? (
                  <img
                    key={`profile-${imageUpdateTime || user?.profileImage}`}
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-gray-500 flex items-center justify-center h-full">
                    PFP
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-green-900">
                  {user.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {user.email}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-8">
              {/* Follow Button (only show if viewing someone else's profile) */}
              {!isOwner && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105
                    ${
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                    }
                    ${followLoading ? "opacity-50 cursor-not-allowed" : ""}
                    shadow-md hover:shadow-lg`}
                >
                  {followLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                      {isFollowing ? "Unfollowing..." : "Following..."}
                    </span>
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}

              {/* Stats */}
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-900">
                    {posts.length}
                  </span>
                  <span className="text-sm text-gray-600">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-900">
                    {followersCount}
                  </span>
                  <span className="text-sm text-gray-600">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-900">
                    {followingCount}
                  </span>
                  <span className="text-sm text-gray-600">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= POSTS GRID ================= */}
          <h3 className="text-2xl font-bold mb-6 text-white">Posts</h3>

          {posts.length === 0 ? (
            <p className="text-gray-600">
              You haven’t posted anything yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => {
                const image = post.images?.[0] || post.image;
                if (!image) return null;

                return (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    className="aspect-square bg-black cursor-pointer overflow-hidden post-card"
                  >
                    <img
                      src={`${BACKEND_URL}${image}`}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= CREATE POST MODAL ================= */}
      {showPostModal && (
        <CreatePostModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={(newPost) =>
            setPosts((prev) => [newPost, ...prev])
          }
        />
      )}

      {isOwner && (
        <FloatingPostButton onClick={() => setShowPostModal(true)} />
      )}

      {/* ================= PFP CHANGE MODAL ================= */}
      {isOwner && showPfpModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50
                     flex items-center justify-center"
          onClick={() => {
            setShowPfpModal(false);
            setPfpPreview(null);
            if (previewUrlRef.current) {
              URL.revokeObjectURL(previewUrlRef.current);
              previewUrlRef.current = null;
            }
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <div
              className="relative w-[320px] h-[320px]
                         rounded-full bg-white
                         flex items-center justify-center"
            >
              {getProfileImage() ? (
                <img
                  key={`modal-profile-${imageUpdateTime || user?.profileImage}`}
                  src={getProfileImage()}
                  alt="PFP"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                    }}
                />
              ) : (
                <span className="text-gray-400 text-lg">PFP</span>
              )}

              <label
                className="absolute -bottom-2 -right-2
                           bg-green-600 text-white
                           p-3 rounded-full cursor-pointer
                           shadow-lg hover:bg-green-700"
              >
                ✎
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Validate file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      alert("File size must be less than 5MB");
                      e.target.value = ""; // Reset input
                      return;
                    }

                    // Validate file type
                    if (!file.type.startsWith("image/")) {
                      alert("Please select an image file");
                      e.target.value = ""; // Reset input
                      return;
                    }

                    // Clean up previous preview URL if exists
                    if (previewUrlRef.current) {
                      URL.revokeObjectURL(previewUrlRef.current);
                    }
                    
                    const previewUrl = URL.createObjectURL(file);
                    previewUrlRef.current = previewUrl;
                    setPfpPreview(previewUrl);

                    const formData = new FormData();
                    formData.append("profileImage", file);

                    try {
                      const res = await fetch(
                        `${BACKEND_URL}/api/auth/profile-image`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        }
                      );

                      let data;
                      try {
                        data = await res.json();
                      } catch (parseError) {
                        console.error("Failed to parse response:", parseError);
                        alert("Upload failed: Invalid server response");
                        setPfpPreview(null);
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                          previewUrlRef.current = null;
                        }
                        return;
                      }

                      if (!res.ok) {
                        const errorMsg = data.message || data.error || "Upload failed";
                        alert(errorMsg);
                        setPfpPreview(null);
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                          previewUrlRef.current = null;
                        }
                        e.target.value = ""; // Reset input
                        return;
                      }

                      // Update user state with new profile image (handle both response formats)
                      const updatedUser = data.user || data.data || data;
                      if (!updatedUser) {
                        alert("Upload failed: Invalid response data");
                        setPfpPreview(null);
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                          previewUrlRef.current = null;
                        }
                        return;
                      }

                      setUser(updatedUser);
                      
                      // Set cache-busting timestamp to force browser to reload the new image
                      // Use a unique timestamp to ensure cache-busting works even for long filenames
                      const updateTimestamp = Date.now();
                      setImageUpdateTime(updateTimestamp);
                      
                      // Store timestamp in localStorage to notify other components (like Navbar)
                      localStorage.setItem('profileImageUpdateTime', updateTimestamp.toString());
                      
                      // Dispatch custom event to notify other components
                      window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                        detail: { updateTime: updateTimestamp }
                      }));
                      
                      // Clear preview after upload completes to switch to server URL
                      // The delay ensures the server has processed the image
                      setTimeout(() => {
                        setPfpPreview(null);
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                          previewUrlRef.current = null;
                        }
                      }, 300);
                      
                      setShowPfpModal(false);
                      e.target.value = ""; // Reset input for next upload
                    } catch (err) {
                      console.error("Upload failed:", err);
                      alert(`Upload failed: ${err.message || "Network error. Please try again."}`);
                      setPfpPreview(null);
                      if (previewUrlRef.current) {
                        URL.revokeObjectURL(previewUrlRef.current);
                        previewUrlRef.current = null;
                      }
                      e.target.value = ""; // Reset input
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= POST VIEWER ================= */}
      {selectedPost && (
        <PostViewerModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdate={updatePostInState}
        />
      )}
    </>
  );
};

export default UserDashboard;
