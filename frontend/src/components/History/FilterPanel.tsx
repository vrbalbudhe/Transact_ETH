// FilterPanel.tsx
import { Calendar, X } from "lucide-react";

interface FilterPanelProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    showFilters: boolean;
    transactionType: "all" | "normal" | "escrow";
    status: "all" | "pending" | "completed" | "canceled";
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      dateFrom: string;
      dateTo: string;
      amountMin: string;
      amountMax: string;
      showFilters: boolean;
      transactionType: "all" | "normal" | "escrow";
      status: "all" | "pending" | "completed" | "canceled";
    }>
  >;
  onClose: () => void;
}

const FilterPanel = ({ filters, setFilters, onClose }: FilterPanelProps) => {
  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      showFilters: true,
      transactionType: "all",
      status: "all",
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700 shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
      >
        <X size={18} className="text-gray-400" />
      </button>
      
      <h3 className="text-lg font-medium text-white mb-4">Filter Transactions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Transaction Type
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) =>
              setFilters({
                ...filters,
                transactionType: e.target.value as "all" | "normal" | "escrow",
              })
            }
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="all">All Types</option>
            <option value="normal">Normal Transfers</option>
            <option value="escrow">Escrow Payments</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Status (Escrow Only)
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as "all" | "pending" | "completed" | "canceled",
              })
            }
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            disabled={filters.transactionType === "normal"}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Date Range
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Amount (ETH)
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                min="0"
                step="0.001"
                value={filters.amountMin}
                onChange={(e) =>
                  setFilters({ ...filters, amountMin: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                min="0"
                step="0.001"
                value={filters.amountMax}
                onChange={(e) =>
                  setFilters({ ...filters, amountMax: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;