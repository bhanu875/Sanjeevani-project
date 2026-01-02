import { useEffect, useState } from "react";

const StepDateTime = ({
  selectedDoctor,
  selectedTime,
  setSelectedTime,
  onNext,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [blockedSlots, setBlockedSlots] = useState([]);

  const morningSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM",
    "10:30 AM", "11:00 AM", "11:30 AM",
  ];

  const eveningSlots = [
    "02:00 PM", "02:30 PM", "03:00 PM",
    "03:30 PM", "04:00 PM", "04:30 PM",
  ];

  // 🔹 Fetch blocked slots when date or doctor changes
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    fetch(
      `http://localhost:5000/api/bookings/doctor/${selectedDoctor._id}/slots?date=${selectedDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlockedSlots(data.blockedSlots || []);
        } else {
          setBlockedSlots([]);
        }
      })
      .catch(() => setBlockedSlots([]));
  }, [selectedDoctor, selectedDate]);

  const isBlocked = (slot) => blockedSlots.includes(slot);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-10">
        Select Date & Time
      </h2>

      {/* TWO COLUMN CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* DATE SECTION */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium mb-4 text-gray-700">
            Select Date
          </h3>

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(null); // reset time on date change
            }}
            className="w-full border rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <p className="text-xs text-gray-400 mt-2">
            Past dates are not allowed
          </p>
        </div>

        {/* TIME SECTION */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium mb-6 text-gray-700">
            Select Time
          </h3>

          {/* MORNING */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-green-700 mb-3">
              Morning
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {morningSlots.map((slot) => {
                const blocked = isBlocked(slot);
                const selected = selectedTime?.time === slot;

                return (
                  <button
                    key={slot}
                    disabled={blocked}
                    onClick={() =>
                      !blocked &&
                      setSelectedTime({
                        date: selectedDate,
                        time: slot,
                      })
                    }
                    className={`py-2 rounded-lg border text-sm transition
                      ${
                        blocked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : selected
                          ? "bg-green-700 text-white border-green-700"
                          : "hover:border-green-700"
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* EVENING */}
          <div>
            <p className="text-sm font-semibold text-green-700 mb-3">
              Evening
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {eveningSlots.map((slot) => {
                const blocked = isBlocked(slot);
                const selected = selectedTime?.time === slot;

                return (
                  <button
                    key={slot}
                    disabled={blocked}
                    onClick={() =>
                      !blocked &&
                      setSelectedTime({
                        date: selectedDate,
                        time: slot,
                      })
                    }
                    className={`py-2 rounded-lg border text-sm transition
                      ${
                        blocked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : selected
                          ? "bg-green-700 text-white border-green-700"
                          : "hover:border-green-700"
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg"
        >
          Back
        </button>

        <button
          disabled={!selectedTime}
          onClick={onNext}
          className={`px-6 py-2 rounded-lg text-white
            ${
              selectedTime
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default StepDateTime;
