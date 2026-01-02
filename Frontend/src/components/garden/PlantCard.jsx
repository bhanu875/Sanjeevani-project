import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PlantCard = ({ plant }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-64 perspective cursor-pointer 
                 transition-transform duration-300 hover:-translate-y-1"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 
                    transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT - HERBAL GARDEN STYLE */}
        <div
          className="absolute inset-0 backface-hidden 
                     bg-gradient-to-br from-white to-green-50 rounded-2xl 
                     shadow-lg hover:shadow-xl border-2 border-green-200
                     p-4 flex flex-col transition-all"
        >
          <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
            <img
              src={`http://localhost:5000${plant.image}`}
              alt={plant.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-4xl">🌿</div>';
              }}
            />
          </div>

          <h3 className="font-bold text-lg text-green-900 mb-1">
            {plant.name}
          </h3>

          <p className="text-xs italic text-gray-600 mb-3 font-medium">
            {plant.botanicalName}
          </p>

          <span className="mt-auto inline-block text-xs px-3 py-1.5 
                           bg-gradient-to-r from-green-200 to-emerald-200 
                           text-green-900 rounded-full font-semibold border border-green-300">
            🌱 {plant.ayushSystem}
          </span>
        </div>

        {/* BACK - HERBAL GARDEN STYLE */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 
                     rounded-2xl shadow-xl border-2 border-emerald-300
                     p-4 flex flex-col justify-between 
                     text-sm 
                     bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <h4 className="font-bold text-green-900 text-base">
                Medicinal Insight
              </h4>
            </div>

            <p className="leading-relaxed text-gray-800 font-medium mb-3">
              {plant.shortInsight ||
                "Traditionally used in AYUSH medicine for therapeutic benefits."}
            </p>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-green-200">
              <p className="text-xs text-gray-700">
                <span className="font-bold text-green-800">Garden Zone:</span> {plant.gardenZone}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/plants/${plant._id}`);
            }}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 
                       text-white rounded-lg text-xs font-bold
                       hover:from-green-700 hover:to-emerald-700 
                       transition-all shadow-md hover:shadow-lg
                       transform hover:scale-105 self-start"
          >
            🌱 View Full Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
