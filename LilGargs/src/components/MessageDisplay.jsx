// src/components/MessageDisplay.jsx

const MessageDisplay = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg flex items-center justify-between z-50 ${bgColor} ${textColor} border ${borderColor}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none cursor-pointer">
        &times;
      </button>
    </div>
  );
};

export default MessageDisplay;
