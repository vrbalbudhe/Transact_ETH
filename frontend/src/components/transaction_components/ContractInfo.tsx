import React from "react";

interface Props {
  contractType: string; // "normal" or "escrow"
  copyToClipboard: (text: string) => void;
}

const ContractInfo: React.FC<Props> = ({ contractType, copyToClipboard }) => {
  // Get the correct address based on the contract type
  const transactionAddress =
    import.meta.env.VITE_TRANSACTION_CONTRACT_ADDRESS || "";
  const escrowAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS || "";

  // Use the appropriate address based on the contractType
  const displayAddress =
    contractType === "normal" ? transactionAddress : escrowAddress;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-5 border border-gray-700/50">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Contract Address</p>
        <button
          onClick={() => copyToClipboard(displayAddress)}
          className="text-gray-500 hover:text-blue-400 transition-colors"
          title="Copy to clipboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
      </div>
      <div className="bg-gray-900/80 rounded-lg px-4 py-3 font-mono text-green-400 text-sm break-all">
        {displayAddress}
      </div>
    </div>
  );
};

export default ContractInfo;
