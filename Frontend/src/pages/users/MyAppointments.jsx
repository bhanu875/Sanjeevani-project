import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

const BACKEND_URL = "http://localhost:5000";

const MyAppointments = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/appointments/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []);

  /* =========================
     INDIA TIME COUNTDOWN
  ========================= */
  const getTimeRemaining = (date, time) => {
    if (!date || !time) return "Invalid appointment time";

    let hours, minutes;

    if (time.includes("AM") || time.includes("PM")) {
      const [timePart, meridian] = time.trim().split(" ");
      const parts = timePart.split(":");

      hours = Number(parts[0]);
      minutes = Number(parts[1]);

      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;
    } else if (time.includes(":")) {
      const parts = time.split(":");
      hours = Number(parts[0]);
      minutes = Number(parts[1]);
    } else {
      return "Invalid appointment time";
    }

    const appointmentDateTime = new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`
    );

    const diff = appointmentDateTime - new Date();

    if (diff <= 0) return "Appointment time passed";

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const remHours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const remMinutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${remHours}h remaining`;
    if (remHours > 0) return `${remHours}h ${remMinutes}m remaining`;
    return `${remMinutes}m remaining`;
  };

  /* =========================
     RENDER
  ========================= */
  if (loading) {
    return <p className="text-center mt-10">Loading appointments...</p>;
  }

  return (
  <>
    <Navbar />

    {/* PAGE WRAPPER */}
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              My Appointments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Approved consultations and upcoming schedules
            </p>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
            🌿 Wellness Care
          </span>
        </div>

        {/* EMPTY STATE */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              No approved appointments yet
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait for admin confirmation
            </p>
          </div>
        ) : (
          /* APPOINTMENT GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-2xl border border-green-100 p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* TOP SECTION */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appt.doctor?.name}
                    </h3>

                    <p className="text-sm font-medium text-emerald-700">
                      {appt.doctor?.specialty}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📅 {appt.date}</p>
                      <p>⏰ {appt.time}</p>
                    </div>

                    {appt.reason && (
                      <p className="text-sm text-gray-500 italic mt-2">
                        “{appt.reason}”
                      </p>
                    )}
                  </div>

                  {/* STATUS BADGE */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    APPROVED
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="my-5 border-t border-dashed border-gray-200" />

                {/* FOOTER */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-700">
                    ⏳ {getTimeRemaining(appt.date, appt.time)}
                  </p>
                  <span className="text-xs text-gray-400">
                    IST
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);


};

export default MyAppointments;
