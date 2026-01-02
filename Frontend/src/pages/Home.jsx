import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/hero.jpg";
import communityImage from "../assets/community.jpg";
import consultationImage from "../assets/consultation.jpg";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              filter: "brightness(0.7)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/70 to-green-900/80" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-1 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-green-300 drop-shadow-lg">Sanjeevani</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your gateway to traditional Ayurvedic wellness, herbal knowledge, and
            holistic healing through AYUSH systems
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/user/dashboard"
                className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/herbal-garden"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Explore Garden
              </Link>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the power of traditional medicine through interactive
              experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Virtual Garden Card */}
            <div
              className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: "0.1s",
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #2F855A 0%, #38A169 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-5xl mb-2">🌿</div>
                  <h3 className="text-2xl font-bold text-white">
                    Virtual Garden
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Explore an interactive virtual garden of medicinal plants.
                  Learn about their properties, uses, and benefits in AYUSH
                  systems.
                </p>
                <Link
                  to="/herbal-garden"
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Explore Garden
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Community Card */}
            <div
              className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: "0.2s",
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={communityImage}
                  alt="Community"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-5xl mb-2">👥</div>
                  <h3 className="text-2xl font-bold text-white">Community</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Connect with like-minded individuals. Share experiences,
                  ask questions, and learn from the community.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Join Community
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Consultation Card */}
            <div
              className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: "0.3s",
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={consultationImage}
                  alt="Consultation"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-5xl mb-2">💚</div>
                  <h3 className="text-2xl font-bold text-white">
                    Consultation
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Book appointments with certified AYUSH practitioners. Get
                  personalized wellness advice and treatment plans.
                </p>
                <Link
                  to="/wellness"
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Book Appointment
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AYUSH OVERVIEW SECTION ================= */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What is AYUSH?
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 text-center">
              <span className="font-bold text-green-700">AYUSH</span> represents
              traditional systems of medicine including{" "}
              <span className="font-semibold">Ayurveda</span>,{" "}
              <span className="font-semibold">Yoga & Naturopathy</span>,{" "}
              <span className="font-semibold">Unani</span>,{" "}
              <span className="font-semibold">Siddha</span>, and{" "}
              <span className="font-semibold">Homeopathy</span>. These systems
              rely heavily on medicinal plants for prevention, treatment, and
              holistic wellness.
            </p>

            <div className="grid md:grid-cols-5 gap-6 mt-10">
              {[
                { name: "Ayurveda", icon: "🌿", color: "from-green-500 to-green-600" },
                { name: "Yoga", icon: "🧘", color: "from-blue-500 to-blue-600" },
                { name: "Unani", icon: "⚕️", color: "from-purple-500 to-purple-600" },
                { name: "Siddha", icon: "🔮", color: "from-indigo-500 to-indigo-600" },
                { name: "Homeopathy", icon: "💊", color: "from-pink-500 to-pink-600" },
              ].map((system, index) => (
                <div
                  key={system.name}
                  className="text-center p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="text-4xl mb-2">{system.icon}</div>
                  <h3 className="font-semibold text-gray-800">{system.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Sanjeevani?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best of traditional and modern wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Authentic Knowledge",
                description:
                  "Learn from scientifically documented uses of medicinal plants in AYUSH systems. Trusted information from certified sources.",
              },
              {
                icon: "🎯",
                title: "Interactive Learning",
                description:
                  "Engage with 3D plant models, detailed information, and interactive features designed for students and practitioners.",
              },
              {
                icon: "🤝",
                title: "Expert Consultation",
                description:
                  "Connect with certified AYUSH practitioners for personalized wellness advice and treatment plans.",
              },
              {
                icon: "🌱",
                title: "Community Support",
                description:
                  "Join a vibrant community of wellness enthusiasts sharing experiences and knowledge.",
              },
              {
                icon: "🔬",
                title: "Research-Backed",
                description:
                  "All information is backed by scientific research and traditional knowledge systems.",
              },
              {
                icon: "💚",
                title: "Holistic Approach",
                description:
                  "Experience wellness through a holistic approach that considers mind, body, and spirit.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users exploring traditional medicine and holistic
            wellness
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg shadow-xl hover:bg-green-50 transform hover:scale-105 transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/herbal-garden"
                className="px-8 py-4 bg-green-800 text-white rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-green-900 transform hover:scale-105 transition-all duration-300"
              >
                Explore Features
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/herbal-garden"
                className="px-8 py-4 bg-white text-green-700 rounded-full font-semibold text-lg shadow-xl hover:bg-green-50 transform hover:scale-105 transition-all duration-300"
              >
                Explore Garden
              </Link>
              <Link
                to="/community"
                className="px-8 py-4 bg-green-800 text-white rounded-full font-semibold text-lg border-2 border-white/50 hover:bg-green-900 transform hover:scale-105 transition-all duration-300"
              >
                Join Community
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
