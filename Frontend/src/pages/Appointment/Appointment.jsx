import { useState, useEffect } from "react";
import StepDoctor from "./StepDoctor";
import StepDateTime from "./StepDateTime";
import StepDetails from "./StepDetails";
import Navbar from "../../components/Navbar";

const Appointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      });
  }, []);

  return (
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      <div
        className="relative min-h-screen pt-[90px] px-5 overflow-hidden
        bg-gradient-to-br from-[#f6f7f2] via-[#eef4ef] to-[#e3efe9]"
      >
        {/* 🌿 Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,101,52,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.10),transparent_45%)]" />

        {/* Decorative leaves */}
        <div className="absolute top-24 left-10 text-green-200 text-[110px] rotate-12 select-none">
          🍃
        </div>
        <div className="absolute bottom-28 right-16 text-emerald-200 text-[100px] -rotate-12 select-none">
          🌿
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-semibold text-green-900">
              Book an Ayurvedic Consultation
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with trusted Ayurvedic practitioners
            </p>
          </div>

          {/* Card */}
          <div
            className="bg-[#fbfaf7]/95 backdrop-blur-md
            rounded-3xl p-10
            shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
          >
            {/* Step Indicator */}
            <div className="flex justify-center items-center gap-8 mb-12">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`w-10 h-10 flex items-center justify-center rounded-full
                    font-semibold transition-all
                    ${
                      step === n
                        ? "bg-green-700 text-white scale-110 shadow-md"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {n}
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <StepDoctor
                doctors={doctors}
                selected={selectedDoctor}
                setSelected={setSelectedDoctor}
                onNext={() => setStep(2)}
              />
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <StepDateTime
                selectedDoctor={selectedDoctor}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <StepDetails
                selectedDoctor={selectedDoctor}
                selectedTime={selectedTime}
                onBack={() => setStep(2)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
