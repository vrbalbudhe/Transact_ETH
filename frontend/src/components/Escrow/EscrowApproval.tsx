import React from "react";
import { Check, X } from "lucide-react";

interface EscrowInfo {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  buyerApproved: boolean;
  sellerApproved: boolean;
  state: number; // 0: Pending, 1: Approved, 2: Completed
}

interface EscrowApprovalProps {
  escrows: EscrowInfo[];
  onApprove: (id: string) => Promise<void>;
  isProcessing: boolean;
  userAddress: string | null;
  truncateAddress: (addr: string) => string;
}

const EscrowApproval: React.FC<EscrowApprovalProps> = ({
  escrows,
  onApprove,
  isProcessing,
  userAddress,
  truncateAddress,
}) => {
  const pendingEscrows = escrows.filter((escrow) => escrow.state === 0);

  if (pendingEscrows.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg pl-4 pt-2 pb-2 pr-4 mt-5 mb-5 border border-gray-700/50">
        <p className="text-gray-400">
          You have
          <span className="text-red-600 font-semibold"> No </span>
          Pending Escrows.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 mt-5 backdrop-blur-sm rounded-xl p-4 mb-5 border border-gray-700/50">
      <h3 className="text-lg font-medium text-white mb-2">Pending Escrows</h3>

      {pendingEscrows.map((escrow, index) => {
        const isBuyer =
          userAddress?.toLowerCase() === escrow.buyer.toLowerCase();
        const isSeller =
          userAddress?.toLowerCase() === escrow.seller.toLowerCase();
        const canApprove =
          (isBuyer && !escrow.buyerApproved) ||
          (isSeller && !escrow.sellerApproved);

        return (
          <div key={index} className="mb-4 bg-gray-900/80 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Escrow ID:</span>
              <span className="text-green-400">{escrow.id}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Amount:</span>
              <span className="text-green-400">{escrow.amount} ETH</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Buyer:</span>
              <span className="text-green-400 font-mono">
                {truncateAddress(escrow.buyer)}
                {isBuyer && <span className="text-blue-300 ml-2">(You)</span>}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Seller:</span>
              <span className="text-green-400 font-mono">
                {truncateAddress(escrow.seller)}
                {isSeller && <span className="text-blue-300 ml-2">(You)</span>}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Status:</span>
              <div className="text-orange-300">
                <span className="mr-2">
                  Buyer :{" "}
                  {escrow.buyerApproved ? (
                    <Check size={16} className="inline text-green-500" />
                  ) : (
                    <X
                      size={16}
                      className="inline font-semibold text-red-500"
                    />
                  )}
                </span>
                <span>
                  Seller :{" "}
                  {escrow.sellerApproved ? (
                    <Check size={16} className="inline text-green-500" />
                  ) : (
                    <X size={16} className="inline text-red-500" />
                  )}
                </span>
              </div>
            </div>

            {canApprove && (
              <button
                onClick={() => onApprove(escrow.id)}
                disabled={isProcessing}
                className={`w-full py-2 rounded-md ${
                  isProcessing
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white transition-colors`}
              >
                {isProcessing ? "Processing..." : "Approve Escrow"}
              </button>
            )}

            {!canApprove && (
              <div className="text-gray-400 text-center py-2">
                {(isBuyer || isSeller) &&
                (isBuyer ? escrow.buyerApproved : escrow.sellerApproved)
                  ? "You've already approved this escrow"
                  : "You're not a participant in this escrow"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EscrowApproval;
