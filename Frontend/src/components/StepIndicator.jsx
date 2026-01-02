const StepIndicator = ({ step }) => {
  return (
    <div className="flex gap-6 justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step === s ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
        >
          {s}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
