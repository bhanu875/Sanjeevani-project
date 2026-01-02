import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import UserMenu from "./UserMenu";

const BACKEND_URL = "http://localhost:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  /* ================= INDICATOR ================= */
  const [indicator, setIndicator] = useState({
    x: 0,
    width: 8,
    visible: false,
  });

  /* ================= AUTH ================= */
  const [user, setUser] = useState(null);
  const [imageUpdateTime, setImageUpdateTime] = useState(null);
  const token = localStorage.getItem("token");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    // Stop everything if token is invalid
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Token expired / invalid
        if (res.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || data); // supports both API formats
      } catch (err) {
        console.error("Navbar user fetch failed", err);
        setUser(null);
      }
    };

    fetchUser();
    
    // Check for existing update timestamp on mount
    const storedTime = localStorage.getItem('profileImageUpdateTime');
    if (storedTime) {
      setImageUpdateTime(parseInt(storedTime));
    }
  }, [token]);

  /* ================= LISTEN FOR PROFILE IMAGE UPDATES ================= */
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        console.error("Navbar user fetch failed", err);
      }
    };

    // Listen for profile image updates from other components
    const handleProfileImageUpdate = (event) => {
      const updateTime = event.detail?.updateTime || 
                         parseInt(localStorage.getItem('profileImageUpdateTime') || '0');
      if (updateTime) {
        setImageUpdateTime(updateTime);
        // Refetch user to get updated profile image
        fetchUser();
      }
    };
    
    // Listen for custom event
    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    
    // Also listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'profileImageUpdateTime' && e.newValue) {
        setImageUpdateTime(parseInt(e.newValue));
        fetchUser();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  /* ================= NAV INDICATOR ================= */
  const handleNavEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    setIndicator({
      x: rect.left - navRect.left + rect.width / 2,
      width: rect.width * 0.65,
      visible: true,
    });
  };

  const handleNavLeave = () => {
    setIndicator((prev) => ({ ...prev, visible: false }));
  };

  /* ================= PROFILE ================= */
  const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    if (!user) return null;

    const getProfileImageSrc = () => {
      if (!user.profileImage) return "/default-avatar.png";
      
      // Add cache-busting parameter if image was recently updated
      if (imageUpdateTime) {
        const separator = user.profileImage.includes('?') ? '&' : '?';
        return `${BACKEND_URL}${user.profileImage}${separator}t=${imageUpdateTime}`;
      }
      
      return `${BACKEND_URL}${user.profileImage}`;
    };
    
    const profileSrc = getProfileImageSrc();

    return (
      <div className="relative">
        <img
          src={profileSrc}
          alt="Profile"
          onClick={() => setOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full cursor-pointer
                     border-2 border-[#9bcfb4]
                     shadow-md object-cover"
        />

        {open && (
          <UserMenu
            user={user}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  };

  /* ================= RENDER ================= */
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-[#3a342e]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-[14px]">
        <div className="grid grid-cols-3 items-center">

          {/* LEFT: LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src={logo} alt="Logo" className="w-[34px] h-[34px]" />
            <span className="text-[18px] font-semibold tracking-widest text-white">
              SANJEEVANI
            </span>
          </div>

          {/* CENTER: NAV */}
          <nav
            ref={navRef}
            onMouseLeave={handleNavLeave}
            className="relative hidden md:flex items-center justify-center gap-14
                       text-[14px] font-medium text-white/90"
          >
            {/* Indicator */}
            <span
              className="absolute -bottom-[6px] h-[3px] rounded-full"
              style={{
                left: indicator.x,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg, #cfe8d6, #9bcfb4)",
                boxShadow: "0 0 8px rgba(155,207,180,0.8)",
                transition:
                  "left 0.55s cubic-bezier(0.22,1,0.36,1), width 0.45s, opacity 0.25s",
              }}
            />

            {[
              { label: "Virtual Garden", route: "/herbal-garden" },
              { label: "Consultation", route: "/wellness" },
              { label: "Community", route: "/community" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.route}
                onMouseEnter={handleNavEnter}
                className="hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="justify-self-end">
            {!token ? (
              <div className="flex items-center rounded-full overflow-hidden border
                              border-[#9bcfb4]/70 bg-gradient-to-r
                              from-[#f3f1ec] to-[#e6ede8] shadow text-sm">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 hover:bg-[#3a342e] hover:text-white"
                >
                  Login
                </button>

                <span className="w-px h-5 bg-[#9bcfb4]/60"></span>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 hover:bg-[#3a342e] hover:text-white"
                >
                  Signup
                </button>
              </div>
            ) : (
              <ProfileDropdown />
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
