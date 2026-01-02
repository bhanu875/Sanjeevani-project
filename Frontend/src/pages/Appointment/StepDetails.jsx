import { useState, useEffect } from "react";
const StepDetails = ({
  onBack,
  selectedDoctor,
  selectedTime,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const userData = data.user || data;
        setForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          reason: "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setLoading(false);
      });
  }, []);

  const submitBooking = async () => {
    if (!form.reason.trim()) {
      alert("Please enter reason for visit");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          requestedDate: selectedTime.date,
          requestedTime: selectedTime.time,
          reason: form.reason,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Booking request submitted successfully!");
    } catch {
      setSubmitting(false);
      alert("Server error. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Details
        </h2>
        <p className="text-gray-500 mt-1">
          Please review your information before confirming
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border rounded-xl p-8 space-y-6">
        {/* READ-ONLY INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              value={form.name}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-lg border bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email Address</label>
            <input
              value={form.email}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-lg border bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <input
              value={form.phone}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-lg border bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Selected Slot</label>
            <input
              value={`${selectedTime.date} • ${selectedTime.time}`}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-lg border bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        {/* REASON */}
        <div>
          <label className="text-sm text-gray-600">
            Reason for Visit <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Briefly describe your concern"
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
            className="w-full mt-2 px-4 py-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg text-gray-700"
        >
          Back
        </button>

        <button
          onClick={submitBooking}
          disabled={submitting}
          className={`px-8 py-3 rounded-lg text-white font-medium
            ${
              submitting
                ? "bg-gray-400"
                : "bg-green-700 hover:bg-green-800"
            }`}
        >
          {submitting ? "Submitting..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default StepDetails;
