// TransactionDetailModal.tsx
import { useState } from "react";
import { format } from "date-fns";
import {
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Shield,
  Loader,
} from "lucide-react";
import {
  Transaction,
  EscrowTransaction,
  TransactionType,
} from "../../types/TransactionTypes";
import { ethers } from "ethers";
import { showToast } from "../../utils/ToastUtils";
import EscrowABI from "../../contracts/Escrow.json";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | EscrowTransaction;
  account: string | null;
  onTransactionUpdated?: () => void;
  onApproveEscrow?: (escrowId: string) => Promise<boolean>;
}

const TransactionDetailModal = ({
  isOpen,
  onClose,
  transaction,
  account,
  onTransactionUpdated,
  onApproveEscrow,
}: TransactionDetailModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "MMMM dd, yyyy HH:mm:ss");
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "canceled":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const isSent =
    account && account.toLowerCase() === transaction.sender.toLowerCase();
  const isReceived =
    account && account.toLowerCase() === transaction.receiver.toLowerCase();

  // Function to handle escrow approval
  const handleApproveEscrow = async () => {
    if (
      !window.ethereum ||
      !account ||
      transaction.type !== TransactionType.Escrow
    ) {
      return;
    }

    const escrowTransaction = transaction as EscrowTransaction;

    try {
      setIsApproving(true);

      if (onApproveEscrow) {
        const success = await onApproveEscrow(escrowTransaction.escrowId);

        if (success) {
          // If the transaction was successful, close the modal
          onClose();
        }
      } else {
        // Original implementation as fallback
        const escrowContractAddress = import.meta.env
          .VITE_ESCROW_CONTRACT_ADDRESS;
        // ... rest of your existing implementation
      }
    } catch (error) {
      console.error("Error approving escrow:", error);
      showToast(
        `Failed to approve escrow: ${(error as Error).message}`,
        "error"
      );
    } finally {
      setIsApproving(false);
    }
  };

  // Check if the current user can approve this escrow
  const canApproveEscrow = () => {
    if (transaction.type !== TransactionType.Escrow) return false;

    const escrowTx = transaction as EscrowTransaction;

    // If status is not pending, can't approve
    if (escrowTx.status !== "pending") return false;

    // If user is buyer and hasn't approved
    if (
      account &&
      account.toLowerCase() === escrowTx.sender.toLowerCase() &&
      !escrowTx.buyerApproved
    ) {
      return true;
    }

    // If user is seller and hasn't approved
    if (
      account &&
      account.toLowerCase() === escrowTx.receiver.toLowerCase() &&
      !escrowTx.sellerApproved
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {transaction.type === TransactionType.Normal ? (
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
                  {isSent ? (
                    <ArrowUp size={24} className="text-blue-200" />
                  ) : (
                    <ArrowDown size={24} className="text-blue-200" />
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">
                  <Shield size={24} className="text-purple-200" />
                </div>
              )}
              <div className="ml-3">
                <h4 className="text-lg font-medium text-white">
                  {isSent ? "Sent" : "Received"}{" "}
                  {parseFloat(transaction.amount).toFixed(4)} ETH
                </h4>
                <p className="text-sm text-gray-400">
                  {transaction.type === TransactionType.Escrow
                    ? `Escrow Payment #${
                        (transaction as EscrowTransaction).escrowId
                      }`
                    : "Direct Transfer"}
                </p>
              </div>
            </div>

            {transaction.type === TransactionType.Escrow && (
              <div
                className={`text-lg font-medium ${getStatusColor(
                  (transaction as EscrowTransaction).status
                )}`}
              >
                {(transaction as EscrowTransaction).status
                  .charAt(0)
                  .toUpperCase() +
                  (transaction as EscrowTransaction).status.slice(1)}
              </div>
            )}
          </div>

          {transaction.type === TransactionType.Escrow && (
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h5 className="text-sm text-gray-400 mb-1">Status</h5>
              <p className="text-white">
                {(transaction as EscrowTransaction).conditions}
              </p>

              {/* Progress indicators for escrow */}
              {(transaction as EscrowTransaction).status === "pending" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Buyer approved:
                    </span>
                    <span
                      className={`text-sm ${
                        (transaction as EscrowTransaction).buyerApproved
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {(transaction as EscrowTransaction).buyerApproved
                        ? "Yes ✓"
                        : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Seller approved:
                    </span>
                    <span
                      className={`text-sm ${
                        (transaction as EscrowTransaction).sellerApproved
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {(transaction as EscrowTransaction).sellerApproved
                        ? "Yes ✓"
                        : "No"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm text-gray-400 mb-1">From</h5>
              <div className="flex items-center">
                <p className="text-white mr-2 truncate">{transaction.sender}</p>
                <button
                  onClick={() => copyToClipboard(transaction.sender, "sender")}
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  {copied === "sender" ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-400 mb-1">To</h5>
              <div className="flex items-center">
                <p className="text-white mr-2 truncate">
                  {transaction.receiver}
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(transaction.receiver, "receiver")
                  }
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  {copied === "receiver" ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-400 mb-1">Amount</h5>
              <p className="text-white font-medium">
                {parseFloat(transaction.amount).toFixed(6)} ETH
              </p>
            </div>

            <div>
              <h5 className="text-sm text-gray-400 mb-1">Date</h5>
              <div className="flex items-center">
                <Clock size={14} className="mr-2 text-gray-400" />
                <p className="text-white">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>

            {transaction.transactionHash && (
              <div className="col-span-full">
                <h5 className="text-sm text-gray-400 mb-1">Transaction Hash</h5>
                <div className="flex items-center">
                  <p className="text-blue-400 mr-2 truncate">
                    {transaction.transactionHash}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(transaction.transactionHash, "hash")
                    }
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    {copied === "hash" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-400" />
                    )}
                  </button>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-700 rounded-full ml-1"
                  >
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Show approve button if applicable */}
          {canApproveEscrow() && (
            <div className="mt-6 border-t border-gray-700 pt-4 flex justify-end">
              <button
                onClick={handleApproveEscrow}
                disabled={isApproving}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors flex items-center"
              >
                {isApproving ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>Approve Escrow</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
