const StepDoctor = ({ doctors = [], selected, setSelected, onNext }) => {
  return (
    <div className="relative">
      {/* Decorative leaf */}
      <div className="absolute top-2 right-6 opacity-10 pointer-events-none">
        <img src="/leaf.svg" alt="" className="w-24" />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-serif font-semibold text-green-900 mb-1">
        Choose Your Practitioner
      </h2>
      <p className="text-gray-600 mb-6">
        Select an ayurvedic expert for your consultation
      </p>

      {/* Doctor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {doctors.map((doc) => {
          const isSelected = selected?._id === doc._id;

          return (
            <div
              key={doc._id}
              onClick={() => doc.available && setSelected(doc)}
              className={`
                relative flex items-center gap-4
                px-5 py-4 rounded-xl border cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? "border-green-700 bg-green-50 ring-2 ring-green-600 shadow-md scale-[1.01]"
                    : "border-gray-200 hover:shadow-sm hover:border-green-400"
                }
                ${!doc.available && "opacity-50 pointer-events-none"}
              `}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={doc.avatar || "/default-doctor.png"}
                  alt={doc.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                {doc.available && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900">
                  {doc.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {doc.specialty}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.experience} years • ⭐ {doc.rating}
                </p>
              </div>

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-green-700 text-lg font-bold">
                  ✓
                </div>
              )}

              {/* Unavailable badge */}
              {!doc.available && (
                <span className="absolute top-3 right-3 text-xs bg-gray-200 px-2 py-1 rounded">
                  Unavailable
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer button – reduced bottom height */}
      <div className="flex justify-end mt-6">
        <button
          disabled={!selected}
          onClick={onNext}
          className={`
            px-6 py-2.5 rounded-full font-medium transition-all
            ${
              selected
                ? "bg-green-700 hover:bg-green-800 text-white shadow-md"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          {selected ? "Continue →" : "Select a Doctor"}
        </button>
      </div>
    </div>
  );
};

export default StepDoctor;
