import React from "react";
import { CheckCircle } from "lucide-react";

interface EscrowInfo {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  buyerApproved: boolean;
  sellerApproved: boolean;
  state: number; // 0: Pending, 1: Approved, 2: Completed
}

interface CompletedEscrowsProps {
  escrows: EscrowInfo[];
  userAddress: string | null;
  truncateAddress: (addr: string) => string;
}

const CompletedEscrows: React.FC<CompletedEscrowsProps> = ({
  escrows,
  userAddress,
  truncateAddress,
}) => {
  // Get only completed escrows (state 2)
  const completedEscrows = escrows.filter((escrow) => escrow.state === 2);

  if (completedEscrows.length === 0) {
    return null; // Don't show anything if there are no completed escrows
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-5 border border-gray-700/50">
      <h3 className="text-lg font-medium text-white mb-2">Completed Escrows</h3>

      <div className="space-y-3">
        {completedEscrows.map((escrow) => {
          const isBuyer =
            userAddress?.toLowerCase() === escrow.buyer.toLowerCase();
          const isSeller =
            userAddress?.toLowerCase() === escrow.seller.toLowerCase();

          return (
            <div
              key={escrow.id}
              className="bg-gray-900/80 rounded-lg p-3 flex items-center"
            >
              <div className="mr-3">
                <CheckCircle size={24} className="text-green-500" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Escrow ID:</span>
                  <span className="text-green-400">{escrow.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-green-400">{escrow.amount} ETH</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-green-400 font-mono">
                    {truncateAddress(escrow.buyer)}
                    {isBuyer && (
                      <span className="text-blue-300 ml-2">(You)</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-green-400 font-mono">
                    {truncateAddress(escrow.seller)}
                    {isSeller && (
                      <span className="text-blue-300 ml-2">(You)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompletedEscrows;
