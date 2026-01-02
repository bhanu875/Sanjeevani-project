import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image gallery state
  const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/plants/${id}`
        );
        if (res.data) {
          setPlant(res.data);
          setActiveImage(res.data.image || null);
          setImageError(false);
        } else {
          setError("Plant data not found");
        }
      } catch (err) {
        console.error("Failed to fetch plant details", err);
        setError("Failed to load plant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const allImages = plant
    ? [plant.image, ...(plant.additionalImages || [])].filter(Boolean)
    : [];

  const navigateImage = useCallback((direction) => {
    if (allImages.length === 0) return;
    const currentIndex = allImages.findIndex((img) => img === activeImage);
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = allImages.length - 1;
    if (newIndex >= allImages.length) newIndex = 0;
    setActiveImage(allImages[newIndex]);
    setActiveImageIndex(newIndex);
  }, [allImages, activeImage]);

  // Keyboard navigation for images
  useEffect(() => {
    if (!isZoomed || !plant) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
      } else if (e.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (e.key === "ArrowRight") {
        navigateImage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, plant, navigateImage]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading plant details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !plant) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24 px-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {error || "Plant not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error
                ? "We couldn't load the plant details. Please try again."
                : "The plant you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/herbal-garden")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Go to Garden
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden">
        {/* Herbal Garden Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50/40"></div>
        
        {/* Decorative botanical elements */}
        <div className="absolute top-32 right-10 w-40 h-40 opacity-10">
          <div className="text-8xl">🌿</div>
        </div>
        <div className="absolute bottom-20 left-5 w-32 h-32 opacity-10">
          <div className="text-7xl">🌱</div>
        </div>
        <div className="absolute top-1/2 left-20 w-24 h-24 opacity-10">
          <div className="text-6xl">🍃</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 pt-28 space-y-16 animate-fade-in">

          {/* BACK BUTTON - HERBAL STYLE */}
          <button
            onClick={() => navigate("/herbal-garden")}
            className="inline-flex items-center gap-2
                       bg-white/90 backdrop-blur-sm border-2 border-green-300
                       px-6 py-3 rounded-xl text-sm font-semibold
                       text-green-800 shadow-md
                       hover:bg-green-50 hover:border-green-500
                       hover:shadow-lg hover:scale-105
                       transition-all duration-300"
          >
            <span className="text-lg">🌿</span>
            <span>Back to Herbal Garden</span>
          </button>

          {/* IMAGE + INFO */}
          <section className="grid md:grid-cols-[420px_1fr] gap-8 md:gap-10 items-start animate-fade-up">

            {/* HERO IMAGE */}
            <div className="space-y-4">
              <div
                className="relative aspect-square rounded-2xl shadow-xl
                           overflow-hidden cursor-zoom-in bg-gray-100
                           hover:shadow-2xl transition-all duration-300
                           group"
                onClick={() => setIsZoomed(true)}
              >
                {!imageError ? (
                  <img
                    src={`http://localhost:5000${activeImage}`}
                    alt={plant.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-6xl">🌱</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to zoom
                </div>
              </div>

              {/* Image Navigation (if multiple images) */}
              {allImages.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigateImage(-1)}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-green-50 hover:border-green-400 transition"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <span className="text-sm text-gray-600 px-3">
                    {allImages.findIndex((img) => img === activeImage) + 1} / {allImages.length}
                  </span>
                  <button
                    onClick={() => navigateImage(1)}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-green-50 hover:border-green-400 transition"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

        {/* NAME + THUMBNAILS */}
        <div className="space-y-6">

          {/* TITLE - HERBAL GARDEN STYLE */}
          <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 rounded-2xl p-6 border-2 border-green-200/50 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">🌿</span>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">
                  {plant.name}
                </h1>
                {plant.botanicalName && (
                  <p className="italic text-gray-700 text-lg mt-1 font-medium">
                    <span className="text-green-700">Botanical:</span> {plant.botanicalName}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-4 text-gray-800 text-lg leading-relaxed font-medium">
              {plant.shortInsight}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <span className="badge bg-gradient-to-r from-green-200 to-emerald-200 text-green-900 border border-green-300 px-4 py-2 rounded-full font-semibold text-sm">
                🌱 {plant.ayushSystem}
              </span>
              <span className="badge bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 border border-amber-300 px-4 py-2 rounded-full font-semibold text-sm">
                📜 {plant.category}
              </span>
            </div>
          </div>

            {/* THUMBNAILS */}
            {allImages.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {allImages.map((img, i) => {
                  const isActive = img === activeImage;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setActiveImage(img);
                        setActiveImageIndex(i);
                        setImageError(false);
                      }}
                      className={`aspect-square w-20 md:w-24 rounded-xl overflow-hidden
                                  cursor-pointer border-2 transition-all duration-300
                                  ${
                                    isActive
                                      ? "border-green-600 ring-2 ring-green-300 scale-105"
                                      : "border-gray-200 hover:border-green-400 hover:scale-105"
                                  }`}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Plant thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E🌱%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </section>

          {/* ZOOM OVERLAY */}
          {isZoomed && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setIsZoomed(false)}
            >
              <div className="relative max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={`http://localhost:5000${activeImage}`}
                  alt="Zoomed plant"
                  className="max-h-[90vh] max-w-full mx-auto object-contain rounded-xl shadow-2xl"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2
                                 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full
                                 p-3 shadow-lg hover:bg-white transition
                                 focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => navigateImage(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2
                                 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full
                                 p-3 shadow-lg hover:bg-white transition
                                 focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsZoomed(false)}
                  className="absolute top-4 right-4
                             bg-white/90 backdrop-blur-sm text-gray-800 rounded-full
                             p-2.5 shadow-lg hover:bg-white transition
                             focus:outline-none focus:ring-2 focus:ring-green-400"
                  aria-label="Close zoom"
                >
                  <span className="text-xl">✕</span>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                                bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                  Press ESC to close • Use arrow keys to navigate
                </div>
              </div>
            </div>
          )}

      <hr className="border-dashed border-gray-200" />

      {/* ABOUT - HERBAL GARDEN STYLE */}
      <section className="animate-fade-up bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🌱</span>
          <h2 className="section-title text-3xl font-bold text-green-900">
            About the Medicinal Plant
          </h2>
        </div>
        <p className="text-gray-800 leading-relaxed text-lg mb-6">
          {plant.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {plant.family && (
            <div className="info-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <p className="text-sm text-green-700 font-semibold mb-1">Plant Family</p>
              <p className="text-gray-800 font-medium">{plant.family}</p>
            </div>
          )}
          {plant.localNames && plant.localNames.length > 0 && (
            <div className="info-card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <p className="text-sm text-amber-700 font-semibold mb-1">Local Names</p>
              <p className="text-gray-800 font-medium">{plant.localNames.join(", ")}</p>
            </div>
          )}
        </div>

        {/* CULTURAL SIGNIFICANCE */}
        {plant.culturalSignificance && (
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 
                          border-2 border-yellow-300 p-6 rounded-xl mt-6 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🌼</span>
              <h3 className="font-bold text-yellow-900 text-xl">
                Cultural Significance
              </h3>
            </div>
            <p className="text-gray-800 leading-relaxed">
              {plant.culturalSignificance}
            </p>
          </div>
        )}
      </section>

      <hr className="border-dashed border-gray-200" />

          {/* NATURAL CONTEXT - HERBAL STYLE */}
          <section className="animate-fade-up bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🌍</span>
              <h2 className="section-title text-3xl font-bold text-emerald-900">
                Natural Habitat & Growth
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {plant.habitat && (
                <div className="info-card bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🏞️</span>
                    <p className="font-bold text-emerald-800">Natural Habitat</p>
                  </div>
                  <p className="text-gray-800">{plant.habitat}</p>
                </div>
              )}
              {plant.growthConditions && (
                <div className="info-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">☀️</span>
                    <p className="font-bold text-green-800">Growth Conditions</p>
                  </div>
                  <p className="text-gray-800">{plant.growthConditions}</p>
                </div>
              )}
              {plant.distribution && (
                <div className="info-card bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🗺️</span>
                    <p className="font-bold text-teal-800">Geographic Distribution</p>
                  </div>
                  <p className="text-gray-800">{plant.distribution}</p>
                </div>
              )}
              {plant.season && (
                <div className="info-card bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌸</span>
                    <p className="font-bold text-amber-800">Growing Season</p>
                  </div>
                  <p className="text-gray-800">{plant.season}</p>
                </div>
              )}
            </div>
          </section>

      {/* USES - HERBAL GARDEN STYLE */}
      <section className="animate-fade-up bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🌿</span>
          <h2 className="section-title text-3xl font-bold text-green-900">
            Traditional Medicinal Uses
          </h2>
        </div>
        {plant.medicinalUses && plant.medicinalUses.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plant.medicinalUses.map((use, i) => (
              <div key={i} className="info-card bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 
                                      border-2 border-green-200 hover:border-green-400 
                                      hover:scale-[1.03] transition-all shadow-md
                                      p-5 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-xl mt-1">💊</span>
                  <p className="text-gray-800 font-medium leading-relaxed">{use}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-gray-200">
            <span className="text-4xl mb-2 block">🌱</span>
            <p className="text-gray-600 font-medium">Traditional uses information coming soon.</p>
          </div>
        )}
      </section>

      {/* PARTS - HERBAL STYLE */}
      <section className="animate-fade-up bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🍃</span>
          <h2 className="section-title text-3xl font-bold text-emerald-900">
            Medicinal Parts Used
          </h2>
        </div>
        {plant.partsUsed && plant.partsUsed.length > 0 ? (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
            <div className="flex flex-wrap gap-3 mb-4">
              {plant.partsUsed.map((part, i) => (
                <span key={i} className="px-4 py-2 bg-white border-2 border-emerald-300 
                                        rounded-full text-emerald-900 font-semibold text-sm
                                        shadow-sm">
                  🌿 {part}
                </span>
              ))}
            </div>
            {plant.partsUsageDetail && (
              <div className="mt-4 pt-4 border-t-2 border-emerald-200">
                <p className="text-gray-800 leading-relaxed font-medium">{plant.partsUsageDetail}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-gray-200">
            <span className="text-4xl mb-2 block">🌱</span>
            <p className="text-gray-600 font-medium">Parts usage information coming soon.</p>
          </div>
        )}
      </section>

      {/* PREPARATION - HERBAL STYLE */}
      {plant.procedure && (
        <section className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 
                            border-2 border-green-300 p-8 rounded-2xl animate-fade-up shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🫖</span>
            <h3 className="font-bold text-green-900 text-2xl">
              Traditional Preparation Method
            </h3>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <p className="text-gray-800 leading-relaxed text-lg font-medium">{plant.procedure}</p>
          </div>
        </section>
      )}

          {/* DOCTOR CONSULTATION - HERBAL STYLE */}
          <section className="bg-gradient-to-br from-blue-100 via-indigo-50 to-emerald-50
                              border-2 border-blue-300 p-8 rounded-2xl
                              shadow-xl animate-fade-up relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-5xl opacity-20">🌿</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-20">🌱</div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">👨‍⚕️</span>
                  <h3 className="text-3xl font-bold text-blue-900">
                    Consult an AYUSH Doctor
                  </h3>
                </div>

                <p className="text-gray-800 mb-3 leading-relaxed text-lg font-medium">
                  Traditional plant knowledge is most effective when aligned
                  with individual body constitution and lifestyle.
                </p>

                <p className="text-gray-800 mb-4 leading-relaxed text-lg font-medium">
                  A qualified AYUSH practitioner can guide safe usage,
                  preparation context, and long-term wellness support.
                </p>
              </div>

              <button
                onClick={() => navigate("/wellness")}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 
                           text-white px-10 py-4 rounded-xl text-base font-bold
                           hover:from-blue-700 hover:via-indigo-700 hover:to-emerald-700 
                           hover:scale-105 transform transition-all shadow-lg hover:shadow-2xl
                           whitespace-nowrap flex items-center gap-2"
              >
                <span>🌿</span>
                <span>Consult AYUSH Doctor</span>
                <span>→</span>
              </button>
            </div>
          </section>

      {/* SAFETY - HERBAL STYLE */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50
                          border-2 border-red-300 p-8 rounded-2xl animate-fade-up shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-bold text-red-800 text-2xl">
            Safety & Awareness
          </h3>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-red-200">
          <p className="text-gray-800 leading-relaxed text-lg font-medium">{plant.safetyNotes}</p>
        </div>
      </section>

          {/* FOOTER - HERBAL GARDEN STYLE */}
          <div className="text-center space-y-3 pt-8">
            <div className="bg-gradient-to-r from-green-100/60 via-emerald-50/60 to-amber-50/40 
                            rounded-2xl p-6 border-2 border-green-200/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl">🌿</span>
                <span className="text-3xl">🌱</span>
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-base text-gray-800 font-medium mb-2">
                Continue exploring other medicinal plants in the herbal garden to deepen your learning.
              </p>
              <p className="text-sm text-gray-600 italic">
                All information is based on traditional AYUSH knowledge systems and
                provided for educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantDetails;
