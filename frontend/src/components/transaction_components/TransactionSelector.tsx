import React, { useState } from "react";

interface TransactionSelectorProps {
  method: (selectedMethod: string) => void;
}

const TransactionSelector: React.FC<TransactionSelectorProps> = ({
  method,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("normal");

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    method(value); // Pass the selected value to the parent component
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Transaction Method
      </label>
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md ${
            selectedMethod === "normal"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => handleMethodChange("normal")}
        >
          Normal Transfer
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedMethod === "escrow"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => handleMethodChange("escrow")}
        >
          Escrow Transfer
        </button>
      </div>
    </div>
  );
};

export default TransactionSelector;
