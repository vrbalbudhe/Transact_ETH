import React from "react";

interface TransactionDetailsProps {
  txDetails: {
    hash: string;
    status: string;
    gasUsed: string;
    blockNumber: number | null;
    escrowId?: string; // Added escrow ID to transaction details
  } | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  txDetails,
}) => {
  if (!txDetails || !txDetails.hash) return null;

  return (
    <div className="mt-5 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-lg font-medium text-white mb-3">
        Transaction Details
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Hash:</span>
          <span className="text-green-400 font-mono">
            {txDetails.hash.slice(0, 10)}...{txDetails.hash.slice(-8)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span
            className={
              txDetails.status === "Confirmed"
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {txDetails.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Gas Used:</span>
          <span className="text-green-400">{txDetails.gasUsed}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Block Number:</span>
          <span className="text-green-400">
            {txDetails.blockNumber !== null ? txDetails.blockNumber : "Pending"}
          </span>
        </div>

        {/* Show Escrow ID if present */}
        {txDetails.escrowId && (
          <div className="flex justify-between">
            <span className="text-gray-400">Escrow ID:</span>
            <span className="text-green-400 font-bold">
              {txDetails.escrowId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
