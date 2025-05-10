// TransactionTable.tsx
import {
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Tag,
} from "lucide-react";
import {
  Transaction,
  EscrowTransaction,
  TransactionType,
} from "../../types/TransactionTypes";
import { format } from "date-fns";
import TransactionRow from "./TransactionRow";

interface TransactionTableProps {
  filteredTransactions: (Transaction | EscrowTransaction)[];
  isLoading: boolean;
  handleSort: (key: "timestamp" | "amount") => void;
  sortConfig: {
    key: "timestamp" | "amount";
    direction: "asc" | "desc";
  };
  account: string | null;
  onTransactionClick: (transaction: Transaction | EscrowTransaction) => void;
  transactionsCount: number;
}

const TransactionTable = ({
  filteredTransactions,
  isLoading,
  handleSort,
  sortConfig,
  account,
  onTransactionClick,
  transactionsCount,
}: TransactionTableProps) => {
  return (
    <div className="bg-gray-900 rounded-md overflow-hidden border border-gray-800 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#01161e]">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Direction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                From / To
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown size={14} className="ml-1" />
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} className="ml-1" />
                    ) : (
                      <ArrowDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown size={14} className="ml-1" />
                  {sortConfig.key === "timestamp" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} className="ml-1" />
                    ) : (
                      <ArrowDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <RefreshCw
                      size={32}
                      className="animate-spin mb-4 text-blue-500"
                    />
                    <p className="text-gray-400">
                      Loading transaction history...
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-gray-400">No transactions found</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  account={account}
                  onClick={() => onTransactionClick(tx)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="py-4 px-6 border-t border-gray-700 text-center text-gray-500 text-sm">
        {filteredTransactions.length > 0 && !isLoading && (
          <p>
            Showing {filteredTransactions.length} of {transactionsCount}{" "}
            transactions
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
