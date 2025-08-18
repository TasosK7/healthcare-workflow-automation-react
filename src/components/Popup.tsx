import React from "react";

interface PopupProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error";
}

const Popup: React.FC<PopupProps> = ({
  message,
  onClose,
  type = "success",
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h2
          className={`text-xl font-bold mb-4 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-lg text-white ${
            type === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
