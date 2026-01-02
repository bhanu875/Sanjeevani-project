const PlantModal = ({ plant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold"
        >
          ×
        </button>

        {/* IMAGE */}
        <img
          src={`http://localhost:5000${plant.image}`}
          alt={plant.name}
          className="h-40 w-full object-contain mb-4"
        />

        {/* BASIC INFO */}
        <h2 className="text-2xl font-bold">{plant.name}</h2>
        <p className="italic text-gray-600">{plant.botanicalName}</p>

        {/* DESCRIPTION */}
        <section className="mt-4 text-sm leading-relaxed">
          {plant.description}
        </section>

        {/* MEDICINAL USES */}
        <section className="mt-4">
          <h3 className="font-semibold">Medicinal Uses</h3>
          <ul className="list-disc list-inside text-sm mt-1">
            {plant.medicinalUses.map((use, i) => (
              <li key={i}>{use}</li>
            ))}
          </ul>
        </section>

        {/* PARTS USED */}
        <section className="mt-3 text-sm">
          <strong>Parts Used:</strong> {plant.partsUsed.join(", ")}
        </section>

        {/* PREPARATION / PROCEDURE (OPTIONAL) */}
        {plant.procedure && (
          <section className="mt-3 text-sm">
            <h3 className="font-semibold">Traditional Preparation</h3>
            <p>{plant.procedure}</p>
          </section>
        )}

        {/* SAFETY */}
        <section className="mt-4 text-sm text-red-600">
          <strong>Safety Note:</strong> {plant.safetyNotes}
        </section>
      </div>
    </div>
  );
};

export default PlantModal;
