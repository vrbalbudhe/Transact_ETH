// TransactionRow.tsx
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Clock, Tag } from "lucide-react";
import {
  Transaction,
  EscrowTransaction,
  TransactionType,
} from "../../types/TransactionTypes";

interface TransactionRowProps {
  transaction: Transaction | EscrowTransaction;
  account: string | null;
  onClick: () => void;
}

const TransactionRow = ({
  transaction,
  account,
  onClick,
}: TransactionRowProps) => {
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "MMM dd, yyyy HH:mm");
  };

  const getStatusBadge = (tx: Transaction | EscrowTransaction) => {
    if (tx.type === TransactionType.Normal) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
          Completed
        </span>
      );
    }

    const escrowTx = tx as EscrowTransaction;
    switch (escrowTx.status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
            {/* <LockClock size={12} className="mr-1" /> */}
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
            Completed
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
            Canceled
          </span>
        );
      default:
        return null;
    }
  };

  const getTransactionTypeBadge = (type: TransactionType) => {
    if (type === TransactionType.Normal) {
      return (
        <span className="inline-flex items-center px-3 py-2 rounded-md text-xs font-medium bg-blue-900 text-blue-200">
          Transfer
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-2 rounded-md text-xs font-medium bg-orange-900 text-purple-200">
          <Tag size={12} className="mr-1" />
          Escrow
        </span>
      );
    }
  };

  return (
    <tr
      key={transaction.id}
      className="hover:bg-[#3c6e71] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        {getTransactionTypeBadge(transaction.type)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {account &&
        account.toLowerCase() === transaction.sender.toLowerCase() ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-md text-sm font-medium text-red-500">
            Sent
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-2 rounded-md text-xs font-medium text-green-500">
            Received
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {account &&
            account.toLowerCase() === transaction.sender.toLowerCase() ? (
              <span className="flex items-center text-white">
                <ArrowUp size={14} className="mr-1" />
                Sent to{" "}
                <span className="text-emerald-400 ml-1">
                  {formatAddress(transaction.receiver)}
                </span>
              </span>
            ) : (
              <span className="flex items-center text-green-400">
                <ArrowDown size={14} className="mr-1" />
                Received from{" "}
                <span className="text-blue-400 ml-1">
                  {formatAddress(transaction.sender)}
                </span>
              </span>
            )}
          </span>
          {transaction.type === TransactionType.Escrow && (
            <span className="text-xs text-gray-400 mt-1">
              {(transaction as EscrowTransaction).conditions.substring(0, 30)}
              {(transaction as EscrowTransaction).conditions.length > 30
                ? "..."
                : ""}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-300 font-medium">
          {parseFloat(transaction.amount).toFixed(4)} ETH
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Clock size={14} className="mr-2 text-gray-400" />
          <span className="text-sm text-gray-300">
            {formatDate(transaction.timestamp)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(transaction)}
      </td>
    </tr>
  );
};

export default TransactionRow;
