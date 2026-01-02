import PlantCard from "./PlantCard";

const GardenZone = ({ zoneName, plants }) => {
  return (
    <section className="mb-16 relative">
      {/* Zone Header with Herbal Theme */}
      <div className="mb-8 relative">
        <div className="bg-gradient-to-r from-green-100/80 via-emerald-50/80 to-teal-50/80 
                        rounded-2xl p-6 border-2 border-green-300/50 shadow-lg backdrop-blur-sm
                        relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 right-4 text-4xl opacity-30">🌿</div>
          <div className="absolute bottom-2 left-4 text-3xl opacity-30">🌱</div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🌿</span>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">
                {zoneName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <p className="text-base text-gray-700 font-medium">
                Explore {plants.length} medicinal plant{plants.length !== 1 ? 's' : ''} in this zone
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant._id} plant={plant} />
        ))}
      </div>
    </section>
  );
};

export default GardenZone;
