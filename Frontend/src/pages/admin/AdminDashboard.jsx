import { useEffect, useState } from "react";
import { sendBookingStatusEmail } from "../../email/bookingEmail";

/* =========================
   ADMIN DASHBOARD
========================= */
const AdminDashboard = () => {
  /* -------------------------
     TAB STATE
  ------------------------- */
  const [activeTab, setActiveTab] = useState("consultations");

  /* =========================
     CONSULTATION STATES
  ========================= */
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");

  /* =========================
     PLANT MANAGEMENT STATES
  ========================= */
  const [plants, setPlants] = useState([]);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [plantFormData, setPlantFormData] = useState({
    name: "",
    botanicalName: "",
    family: "",
    localNames: "",
    ayushSystem: "Ayurveda",
    category: "",
    gardenZone: "Ayurvedic Zone",
    shortInsight: "",
    description: "",
    culturalSignificance: "",
    medicinalUses: "",
    traditionallyUsedFor: "",
    partsUsed: "",
    partsUsageDetail: "",
    procedure: "",
    safetyNotes: "Consult a qualified AYUSH practitioner before use.",
    habitat: "",
    growthConditions: "",
    distribution: "",
    season: "",
  });
  const [plantImages, setPlantImages] = useState({
    mainImage: null,
    additionalImages: [],
  });
  const [plantLoading, setPlantLoading] = useState(false);

  /* =========================
     FETCH BOOKINGS
  ========================= */
  const fetchBookings = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/bookings?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) setBookings(data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  /* =========================
     FETCH PLANTS
  ========================= */
  const fetchPlants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/plants");
      const data = await res.json();
      if (res.ok) setPlants(data || []);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "consultations") fetchBookings();
    if (activeTab === "plants") fetchPlants();
  }, [status, activeTab]);

  /* =========================
     UPDATE BOOKING
  ========================= */
  const updateBooking = async (booking, action, remarks = "") => {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      `http://localhost:5000/api/admin/bookings/${booking._id}/${action}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminRemarks: remarks }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update booking");
      return;
    }

    if (action === "approve") {
      if (!data.appointment || data.appointment.status !== "approved") {
        alert("Appointment approval failed. Check backend.");
        return;
      }
    }

    await sendBookingStatusEmail(
      {
        ...booking,
        adminRemarks: remarks,
      },
      action === "approve" ? "APPROVED" : "REJECTED"
    );

    fetchBookings();
  };

  /* =========================
     PLANT MANAGEMENT FUNCTIONS
  ========================= */
  const handlePlantImageChange = (e, type) => {
    if (type === "main") {
      setPlantImages({ ...plantImages, mainImage: e.target.files[0] });
    } else {
      setPlantImages({
        ...plantImages,
        additionalImages: Array.from(e.target.files),
      });
    }
  };

  const resetPlantForm = () => {
    setPlantFormData({
      name: "",
      botanicalName: "",
      family: "",
      localNames: "",
      ayushSystem: "Ayurveda",
      category: "",
      gardenZone: "Ayurvedic Zone",
      shortInsight: "",
      description: "",
      culturalSignificance: "",
      medicinalUses: "",
      traditionallyUsedFor: "",
      partsUsed: "",
      partsUsageDetail: "",
      procedure: "",
      safetyNotes: "Consult a qualified AYUSH practitioner before use.",
      habitat: "",
      growthConditions: "",
      distribution: "",
      season: "",
    });
    setPlantImages({ mainImage: null, additionalImages: [] });
    setEditingPlant(null);
  };

  const openPlantModal = (plant = null) => {
    if (plant) {
      setEditingPlant(plant);
      setPlantFormData({
        name: plant.name || "",
        botanicalName: plant.botanicalName || "",
        family: plant.family || "",
        localNames: Array.isArray(plant.localNames) ? plant.localNames.join(", ") : "",
        ayushSystem: plant.ayushSystem || "Ayurveda",
        category: plant.category || "",
        gardenZone: plant.gardenZone || "Ayurvedic Zone",
        shortInsight: plant.shortInsight || "",
        description: plant.description || "",
        culturalSignificance: plant.culturalSignificance || "",
        medicinalUses: Array.isArray(plant.medicinalUses) ? plant.medicinalUses.join(", ") : "",
        traditionallyUsedFor: Array.isArray(plant.traditionallyUsedFor) ? plant.traditionallyUsedFor.join(", ") : "",
        partsUsed: Array.isArray(plant.partsUsed) ? plant.partsUsed.join(", ") : "",
        partsUsageDetail: plant.partsUsageDetail || "",
        procedure: plant.procedure || "",
        safetyNotes: plant.safetyNotes || "Consult a qualified AYUSH practitioner before use.",
        habitat: plant.habitat || "",
        growthConditions: plant.growthConditions || "",
        distribution: plant.distribution || "",
        season: plant.season || "",
      });
    } else {
      resetPlantForm();
    }
    setShowPlantModal(true);
  };

  const handleSubmitPlant = async (e) => {
    e.preventDefault();
    setPlantLoading(true);

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();

    // Add all form fields
    Object.keys(plantFormData).forEach((key) => {
      formData.append(key, plantFormData[key]);
    });

    // Add images
    if (plantImages.mainImage) {
      formData.append("image", plantImages.mainImage);
    }
    plantImages.additionalImages.forEach((img) => {
      formData.append("additionalImages", img);
    });

    try {
      const url = editingPlant
        ? `http://localhost:5000/api/plants/${editingPlant._id}`
        : "http://localhost:5000/api/plants";

      const res = await fetch(url, {
        method: editingPlant ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save plant");
        setPlantLoading(false);
        return;
      }

      alert(editingPlant ? "Plant updated successfully!" : "Plant created successfully!");
      setShowPlantModal(false);
      resetPlantForm();
      fetchPlants();
    } catch (error) {
      console.error("Error saving plant:", error);
      alert("Error saving plant. Please try again.");
    } finally {
      setPlantLoading(false);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;

    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`http://localhost:5000/api/plants/${plantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete plant");
        return;
      }

      alert("Plant deleted successfully!");
      fetchPlants();
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Error deleting plant. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <span>🔐</span>
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-indigo-100 text-lg">
                Manage consultations and herbal garden plants
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-5 py-2 rounded-full text-sm bg-white/20 backdrop-blur-sm font-semibold border border-white/30">
                🌿 Admin Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* =========================
           TABS - ENHANCED STYLING
        ========================= */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab("consultations")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
              activeTab === "consultations"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            🩺 Consultations
          </button>
          <button
            onClick={() => setActiveTab("plants")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
              activeTab === "plants"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            🌿 Manage Plants
          </button>
        </div>

        {/* =========================
           CONSULTATIONS TAB
        ========================= */}
        {activeTab === "consultations" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* STATUS FILTER */}
            <div className="mb-6 flex justify-between items-center">
              <select
                className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm bg-white shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                           font-medium transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">⏳ Pending</option>
                <option value="APPROVED">✅ Approved</option>
                <option value="REJECTED">❌ Rejected</option>
              </select>

              <span className="text-sm text-gray-500 font-medium">
                {bookings.length} result{bookings.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* BOOKINGS LIST */}
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 
                               p-6 shadow-md hover:shadow-xl transition-all hover:border-green-300"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="max-w-xl space-y-2">
                        <p className="font-bold text-lg text-gray-800">
                          {b.user?.name || "User not available"}
                        </p>

                        <p className="text-sm text-gray-600">
                          👨‍⚕️ {b.doctor?.name || "Doctor not assigned"} • 📅 {b.requestedDate} • 🕐 {b.requestedTime}
                        </p>

                        <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                          {b.reason}
                        </p>

                        {b.status === "REJECTED" && b.adminRemarks && (
                          <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                            ❌ {b.adminRemarks}
                          </p>
                        )}
                      </div>

                      {status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBooking(b, "approve")}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 
                                       text-white text-sm font-semibold hover:from-green-700 hover:to-emerald-700 
                                       transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            ✅ Approve
                          </button>

                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setAdminRemarks("");
                              setShowRejectModal(true);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 
                                       text-white text-sm font-semibold hover:from-red-700 hover:to-pink-700 
                                       transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================
           PLANTS MANAGEMENT TAB
        ========================= */}
        {activeTab === "plants" && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">🌿 Herbal Garden Plants</h2>
              <button
                onClick={() => openPlantModal()}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                         rounded-xl font-semibold shadow-lg hover:shadow-xl 
                         transition-all transform hover:scale-105"
              >
                ➕ Add New Plant
              </button>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <div
                  key={plant._id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 
                             hover:border-green-400 transition-all overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    {plant.image ? (
                      <img
                        src={`http://localhost:5000${plant.image}`}
                        alt={plant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">🌿</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{plant.name}</h3>
                    <p className="text-sm italic text-gray-600 mb-3">{plant.botanicalName}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {plant.ayushSystem}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {plant.gardenZone}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openPlantModal(plant)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold
                                 hover:bg-blue-700 transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlant(plant._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold
                                 hover:bg-red-700 transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {plants.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <span className="text-6xl mb-4 block">🌱</span>
                <p className="text-gray-600 text-lg">No plants in the garden yet</p>
                <p className="text-gray-500 text-sm mt-2">Add your first medicinal plant to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* =========================
           REJECT MODAL
        ========================= */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reject Appointment</h2>

              <textarea
                className="w-full border-2 border-gray-300 rounded-xl p-4 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                         resize-none"
                rows={4}
                placeholder="Enter reason for rejection..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold
                           hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!adminRemarks.trim()) {
                      alert("Please enter rejection reason");
                      return;
                    }
                    await updateBooking(selectedBooking, "reject", adminRemarks);
                    setShowRejectModal(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white 
                           rounded-xl text-sm font-semibold hover:from-red-700 hover:to-pink-700
                           transition-all shadow-md"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================
           PLANT FORM MODAL
        ========================= */}
        {showPlantModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-2xl border-2 border-gray-200 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingPlant ? "✏️ Edit Plant" : "➕ Add New Plant"}
                </h2>
                <button
                  onClick={() => {
                    setShowPlantModal(false);
                    resetPlantForm();
                  }}
                  className="text-2xl text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitPlant} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-green-500 pb-2">
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Plant Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={plantFormData.name}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Botanical Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={plantFormData.botanicalName}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, botanicalName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Family
                      </label>
                      <input
                        type="text"
                        value={plantFormData.family}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, family: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Local Names (comma separated)
                      </label>
                      <input
                        type="text"
                        value={plantFormData.localNames}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, localNames: e.target.value })
                        }
                        placeholder="Telugu, Hindi, Sanskrit"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        AYUSH System *
                      </label>
                      <select
                        required
                        value={plantFormData.ayushSystem}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, ayushSystem: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Ayurveda">Ayurveda</option>
                        <option value="Yoga & Naturopathy">Yoga & Naturopathy</option>
                        <option value="Unani">Unani</option>
                        <option value="Siddha">Siddha</option>
                        <option value="Homeopathy">Homeopathy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={plantFormData.category}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, category: e.target.value })
                        }
                        placeholder="Herb, Tree, Shrub"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Garden Zone *
                      </label>
                      <select
                        required
                        value={plantFormData.gardenZone}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, gardenZone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Ayurvedic Zone">Ayurvedic Zone</option>
                        <option value="Medicinal Herbs Zone">Medicinal Herbs Zone</option>
                        <option value="Sacred & Rare Zone">Sacred & Rare Zone</option>
                      </select>
                    </div>
                  </div>

                  {/* Medicinal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-green-500 pb-2">
                      Medicinal Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Short Insight *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={plantFormData.shortInsight}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, shortInsight: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={plantFormData.description}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, description: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Medicinal Uses * (comma separated)
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={plantFormData.medicinalUses}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, medicinalUses: e.target.value })
                        }
                        placeholder="Use 1, Use 2, Use 3"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Traditionally Used For (comma separated)
                      </label>
                      <input
                        type="text"
                        value={plantFormData.traditionallyUsedFor}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, traditionallyUsedFor: e.target.value })
                        }
                        placeholder="cough, digestion, fever"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Parts Used * (comma separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={plantFormData.partsUsed}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, partsUsed: e.target.value })
                        }
                        placeholder="Leaves, Roots, Bark"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Parts Usage Detail
                      </label>
                      <textarea
                        rows={2}
                        value={plantFormData.partsUsageDetail}
                        onChange={(e) =>
                          setPlantFormData({ ...plantFormData, partsUsageDetail: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                                 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Cultural Significance
                    </label>
                    <textarea
                      rows={3}
                      value={plantFormData.culturalSignificance}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, culturalSignificance: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                               resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Traditional Preparation
                    </label>
                    <textarea
                      rows={3}
                      value={plantFormData.procedure}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, procedure: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                               resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Habitat
                    </label>
                    <input
                      type="text"
                      value={plantFormData.habitat}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, habitat: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Growth Conditions
                    </label>
                    <input
                      type="text"
                      value={plantFormData.growthConditions}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, growthConditions: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Distribution
                    </label>
                    <input
                      type="text"
                      value={plantFormData.distribution}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, distribution: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Season
                    </label>
                    <input
                      type="text"
                      value={plantFormData.season}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, season: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Safety Notes
                    </label>
                    <textarea
                      rows={2}
                      value={plantFormData.safetyNotes}
                      onChange={(e) =>
                        setPlantFormData({ ...plantFormData, safetyNotes: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                               resize-none"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="space-y-4 border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-800">Images</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Main Plant Image * {!editingPlant && "(Required)"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePlantImageChange(e, "main")}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {plantImages.mainImage && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Selected: {plantImages.mainImage.name}
                      </p>
                    )}
                    {editingPlant && editingPlant.image && (
                      <p className="text-sm text-gray-500 mt-1">
                        Current: {editingPlant.image}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Images (Multiple)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePlantImageChange(e, "additional")}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {plantImages.additionalImages.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Selected: {plantImages.additionalImages.length} image(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlantModal(false);
                      resetPlantForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold
                             hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={plantLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                             rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700
                             transition-all shadow-lg hover:shadow-xl transform hover:scale-105
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {plantLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Saving...
                      </span>
                    ) : editingPlant ? (
                      "💾 Update Plant"
                    ) : (
                      "➕ Create Plant"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
