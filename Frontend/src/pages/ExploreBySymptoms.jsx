import { useEffect, useState } from "react";
import axios from "axios";
import PlantCard from "../components/garden/PlantCard";
import Navbar from "../components/Navbar";

const ExploreBySymptoms = () => {
  const [plants, setPlants] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("All");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/plants"
        );
        setPlants(res.data);
      } catch (error) {
        console.error("Error fetching plants", error);
      }
    };

    fetchPlants();
  }, []);

  const allSymptoms = [
    "All",
    ...new Set(
      plants.flatMap(
        (plant) => plant.traditionallyUsedFor || []
      )
    ),
  ];

  const filteredPlants =
    selectedSymptom === "All"
      ? plants
      : plants.filter((plant) =>
          plant.traditionallyUsedFor?.includes(
            selectedSymptom
          )
        );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-center mb-2">
        Explore Plants by Traditional Use
      </h1>

      <p className="text-center text-gray-500 text-sm mb-6">
        Educational reference only. Not a medical recommendation.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {allSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => setSelectedSymptom(symptom)}
            className={`badge transition ${
              selectedSymptom === symptom
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {symptom}
          </button>
        ))}
      </div>

      {filteredPlants.length === 0 ? (
        <p className="text-center text-gray-500">
          No plants found for this category.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant._id}
              plant={plant}
            />
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default ExploreBySymptoms;
