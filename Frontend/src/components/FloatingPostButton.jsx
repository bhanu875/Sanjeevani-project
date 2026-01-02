const FloatingPostButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-8 right-8 z-50
        w-14 h-14 rounded-full
        bg-green-600 text-white text-3xl
        flex items-center justify-center
        shadow-lg hover:bg-green-700
        transition
      "
      aria-label="Create Post"
    >
      +
    </button>
  );
};

export default FloatingPostButton;
