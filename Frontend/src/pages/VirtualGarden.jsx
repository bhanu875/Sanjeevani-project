import { useEffect, useState } from "react";
import axios from "axios";
import GardenZone from "../components/garden/GardenZone";
import Navbar from "../components/Navbar";

const VirtualGarden = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [symptomSearch, setSymptomSearch] = useState("");
  const [ayushFilter, setAyushFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  /* FETCH PLANTS */
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/plants");
        if (res.data && Array.isArray(res.data)) {
          setPlants(res.data);
          setFilteredPlants(res.data);
        } else {
          setPlants([]);
          setFilteredPlants([]);
        }
      } catch (err) {
        console.error("Error fetching plants", err);
        setError("Failed to load plants. Please try again later.");
        setPlants([]);
        setFilteredPlants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  /* FILTER LOGIC */
  useEffect(() => {
    let data = [...plants];

    if (search.trim()) {
      data = data.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
          (p.botanicalName && p.botanicalName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (symptomSearch.trim()) {
      data = data.filter((p) =>
        p.traditionallyUsedFor?.some((symptom) =>
          symptom.toLowerCase().includes(symptomSearch.toLowerCase())
        )
      );
    }

    if (ayushFilter !== "All") {
      data = data.filter((p) => p.ayushSystem === ayushFilter);
    }

    if (zoneFilter !== "All") {
      data = data.filter((p) => p.gardenZone === zoneFilter);
    }

    setFilteredPlants(data);
  }, [search, symptomSearch, ayushFilter, zoneFilter, plants]);

  /* GROUP BY ZONE */
  const zones = filteredPlants.reduce((acc, plant) => {
    acc[plant.gardenZone] = acc[plant.gardenZone] || [];
    acc[plant.gardenZone].push(plant);
    return acc;
  }, {});

  // Check if any filters are active
  const hasActiveFilters = search.trim() || symptomSearch.trim() || ayushFilter !== "All" || zoneFilter !== "All";
  
  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSymptomSearch("");
    setAyushFilter("All");
    setZoneFilter("All");
  };

  // Get total count
  const totalCount = filteredPlants.length;
  const originalCount = plants.length;

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT - HERBAL GARDEN THEME */}
      <div className="pt-24 min-h-screen relative overflow-hidden">
        {/* Background with garden texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-green-50 to-amber-50/30"></div>
        
        {/* Decorative botanical elements */}
        <div className="absolute top-20 right-0 w-64 h-64 opacity-10">
          <div className="text-9xl">🌿</div>
        </div>
        <div className="absolute bottom-40 left-0 w-48 h-48 opacity-10">
          <div className="text-8xl">🌱</div>
        </div>
        <div className="absolute top-1/3 left-10 w-32 h-32 opacity-10">
          <div className="text-7xl">🍃</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-14 space-y-8">

          {/* PAGE HEADER - HERBAL GARDEN STYLE */}
          <div className="text-center space-y-4 pt-8 pb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl md:text-6xl">🌿</span>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 bg-clip-text text-transparent tracking-tight">
                Virtual Herbal Garden
              </h1>
              <span className="text-5xl md:text-6xl">🌿</span>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium">
                Discover the rich heritage of <span className="text-green-700 font-semibold">AYUSH medicinal plants</span> in our virtual garden
              </p>
              <p className="text-sm md:text-base text-gray-600 mt-2 italic">
                Explore traditional healing wisdom through nature's pharmacy
              </p>
            </div>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-400 to-green-600 flex-1 max-w-32"></div>
              <span className="text-2xl">🌼</span>
              <div className="h-px bg-gradient-to-l from-transparent via-green-400 to-green-600 flex-1 max-w-32"></div>
            </div>
          </div>

          {/* EXPLORATION GUIDANCE - HERBAL STYLE */}
          <div className="bg-gradient-to-br from-green-100/80 via-emerald-50/80 to-amber-50/50 
                          border-2 border-green-300/50 rounded-2xl p-6 shadow-lg
                          backdrop-blur-sm relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-2 right-2 text-3xl opacity-20">🌿</div>
            <div className="absolute bottom-2 left-2 text-2xl opacity-20">🌱</div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="text-4xl">🌿</div>
              <div className="flex-1">
                <p className="font-bold text-green-900 mb-2 text-lg">Welcome to the Herbal Garden</p>
                <p className="text-gray-700 leading-relaxed">
                  Navigate through different <span className="font-semibold text-green-800">medicinal plant zones</span>, 
                  search by botanical names, or explore plants based on their <span className="font-semibold text-emerald-700">traditional therapeutic uses</span> in AYUSH systems.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-green-200/60 text-green-900 rounded-full font-medium">Ayurveda</span>
                  <span className="px-3 py-1 bg-emerald-200/60 text-emerald-900 rounded-full font-medium">Unani</span>
                  <span className="px-3 py-1 bg-amber-200/60 text-amber-900 rounded-full font-medium">Siddha</span>
                  <span className="px-3 py-1 bg-teal-200/60 text-teal-900 rounded-full font-medium">Homeopathy</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER BAR - GARDEN THEME */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-green-200/50
                          relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" 
                   style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(34,197,94,0.1) 10px, rgba(34,197,94,0.1) 20px)'}}>
              </div>
            </div>
            <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by plant or botanical name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border-2 border-green-200 px-4 py-2.5 pl-10 rounded-lg
                                 bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400 
                                 focus:border-green-500 focus:bg-white transition-all
                                 placeholder:text-gray-400"
                    />
                  </div>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">🌿</span>
                  <input
                    type="text"
                    placeholder="Search by traditional use (e.g., cough, digestion)"
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    className="w-full border-2 border-emerald-200 px-4 py-2.5 pl-10 rounded-lg
                               bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 
                               focus:border-emerald-500 focus:bg-white transition-all
                               placeholder:text-gray-400"
                  />
                  {symptomSearch && (
                    <button
                      onClick={() => setSymptomSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={ayushFilter}
                  onChange={(e) => setAyushFilter(e.target.value)}
                  className="border-2 border-green-200 px-4 py-2.5 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500
                             bg-white/80 hover:bg-white transition-all font-medium text-gray-700"
                >
                  <option value="All">All AYUSH Systems</option>
                  <option value="Ayurveda">Ayurveda</option>
                  <option value="Yoga & Naturopathy">Yoga & Naturopathy</option>
                  <option value="Unani">Unani</option>
                  <option value="Siddha">Siddha</option>
                  <option value="Homeopathy">Homeopathy</option>
                </select>

                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="border-2 border-green-200 px-4 py-2.5 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500
                             bg-white/80 hover:bg-white transition-all font-medium text-gray-700"
                >
                  <option value="All">All Garden Zones</option>
                  <option value="Ayurvedic Zone">Ayurvedic Zone</option>
                  <option value="Medicinal Herbs Zone">Medicinal Herbs Zone</option>
                  <option value="Sacred & Rare Zone">Sacred & Rare Zone</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-100 to-orange-100 
                               hover:from-amber-200 hover:to-orange-200 text-amber-900 rounded-lg
                               transition-all font-semibold text-sm whitespace-nowrap
                               border border-amber-300 shadow-sm"
                  >
                    🗑️ Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            {!loading && (
              <div className="mt-4 pt-4 border-t-2 border-green-200/50">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <p className="text-sm text-gray-700">
                    Found <span className="font-bold text-green-800 text-base">{totalCount}</span> of{" "}
                    <span className="font-semibold text-gray-800">{originalCount}</span> medicinal plants
                    {hasActiveFilters && <span className="text-green-600"> (filtered)</span>}
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* DISCLAIMER - HERBAL STYLE */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-xs text-amber-900 italic flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>Symptom-based exploration is for educational reference only and does not constitute medical advice. Consult a qualified AYUSH practitioner for personalized guidance.</span>
            </p>
          </div>

          {/* LOADING STATE - GARDEN THEME */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">🌿</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium">Growing the herbal garden...</p>
              <p className="text-sm text-gray-500 mt-1">Loading medicinal plants</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error Loading Plants</h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ZONE SECTIONS */}
          {!loading && !error && (
            <>
              {Object.keys(zones).length === 0 ? (
                <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-green-200/50">
                  <div className="text-7xl mb-4 animate-bounce">🌱</div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">No Medicinal Plants Found</p>
                  <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
                    The garden doesn't have plants matching your search. Try different filters or explore all zones.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl 
                                 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg
                                 font-semibold transform hover:scale-105"
                    >
                      🌿 Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-16">
                  {Object.entries(zones).map(([zone, zonePlants], index) => (
                    <div key={zone} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <GardenZone zoneName={zone} plants={zonePlants} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FOOTER - HERBAL GARDEN STYLE */}
          {!loading && !error && (
            <div className="text-center pt-12 pb-6">
              <div className="bg-gradient-to-r from-green-100/50 via-emerald-50/50 to-amber-50/30 
                              rounded-2xl p-6 border-2 border-green-200/50 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-3xl">🌿</span>
                  <span className="text-3xl">🌱</span>
                  <span className="text-3xl">🌿</span>
                </div>
                <p className="text-base text-gray-700 font-medium mb-1">
                  Select a medicinal plant to discover its traditional preparation methods,
                </p>
                <p className="text-base text-gray-700 font-medium">
                  cultural significance, and therapeutic applications in AYUSH systems.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700">
                  <span>🌼</span>
                  <span className="italic">Nature's Pharmacy • Traditional Wisdom • Modern Learning</span>
                  <span>🌼</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default VirtualGarden;
