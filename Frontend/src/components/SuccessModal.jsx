const SuccessModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <>
      {/* Inline animation styles */}
      <style>
        {`
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={iconStyle}>✓</div>

          <h2 style={{ marginBottom: "8px" }}>Success</h2>

          <p style={{ marginBottom: "20px", color: "#555" }}>
            {message}
          </p>

          <button onClick={onClose} style={buttonStyle}>
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "28px 32px",
  borderRadius: "14px",
  textAlign: "center",
  width: "340px",
  animation: "scaleIn 0.3s ease-out",
};

const iconStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#2f855a",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  margin: "0 auto 14px",
};

const buttonStyle = {
  padding: "10px 24px",
  background: "#2f855a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer",
};
