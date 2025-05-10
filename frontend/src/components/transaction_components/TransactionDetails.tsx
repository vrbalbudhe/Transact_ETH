import React from "react";

interface TxDetails {
  hash: string;
  status: string;
  gasUsed: string;
  blockNumber: number | null;
}

const TransactionDetails: React.FC<{ txDetails: TxDetails | null }> = ({
  txDetails,
}) => {
  if (!txDetails) return null;

  const getStatusColor = () => {
    switch (txDetails.status.toLowerCase()) {
      case "success":
      case "confirmed":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "failed":
      case "error":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    }
  };

  const formatHash = (hash: string) => {
    if (hash.length <= 18) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const getEtherscanLink = (hash: string) => {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-6 p-5 bg-gray-800/50 rounded-xl text-sm text-white border border-gray-700 shadow-lg">
      <div className="grid grid-cols-1 gap-3">
        <div
          className={`p-3 rounded-lg border flex items-center ${getStatusColor()}`}
        >
          <span className="text-xs font-medium uppercase opacity-80 w-24">
            Status
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                txDetails.status.toLowerCase() === "success" ||
                txDetails.status.toLowerCase() === "confirmed"
                  ? "bg-green-400"
                  : txDetails.status.toLowerCase() === "pending"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            ></div>
            <span className="font-bold">{txDetails.status}</span>
          </div>
        </div>

        {/* Gas Used Cell */}
        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30 flex items-center">
          <span className="text-xs font-medium uppercase opacity-80 w-24">
            Gas Used
          </span>
          <span className="font-bold">{txDetails.gasUsed}</span>
        </div>

        {/* Block Number Cell */}
        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30 flex items-center">
          <span className="text-xs font-medium uppercase opacity-80 w-24">
            Block
          </span>
          <span className="font-bold">
            {txDetails.blockNumber !== null ? (
              txDetails.blockNumber.toLocaleString()
            ) : (
              <span className="text-yellow-400">Pending</span>
            )}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30 flex items-center">
          <span className="text-xs font-medium uppercase opacity-80 w-24">
            Tx Hash
          </span>
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <span className="font-bold truncate" title={txDetails.hash}>
              {formatHash(txDetails.hash)}
            </span>
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              <a
                href={getEtherscanLink(txDetails.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 p-1 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
                title="View on Etherscan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-xs">Etherscan</span>
              </a>
              <button
                onClick={() => copyToClipboard(txDetails.hash)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Etherscan Link Row - Alternative full width option */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
          <span className="text-xs font-medium uppercase opacity-80">
            Transaction Explorer
          </span>
          <a
            href={getEtherscanLink(txDetails.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            <span>View on Sepolia Etherscan</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
