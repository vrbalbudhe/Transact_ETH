import { CircleDollarSign } from "lucide-react";
import React from "react";

interface Props {
  recipient: string;
  setRecipient: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  truncateAddress: (address: string) => string;
  handleTransaction: () => void;
  isProcessing: boolean;
}

const TransactionForm: React.FC<Props> = ({
  recipient,
  setRecipient,
  amount,
  setAmount,
  truncateAddress,
  handleTransaction,
  isProcessing,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="recipient"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Recipient Address
        </label>
        <div className="relative">
          <input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-gray-800/30 border border-gray-700 rounded-lg py-3 px-4 text-white"
          />
          {recipient && (
            <button
              onClick={() => setRecipient("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
        {recipient && (
          <p className="mt-1 text-xs text-gray-500">{`Sending to: ${truncateAddress(
            recipient
          )}`}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Amount in ETH
        </label>
        <input
          id="amount"
          type="text"
          placeholder="0.1"
          value={amount}
          onChange={(e) => {
            const re = /^[0-9]*[.]?[0-9]*$/;
            if (e.target.value === "" || re.test(e.target.value)) {
              setAmount(e.target.value);
            }
          }}
          className="w-full bg-gray-800/30 border border-gray-700 rounded-lg py-3 px-4 text-white"
        />
      </div>

      <button
        onClick={handleTransaction}
        disabled={isProcessing}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-300"
      >
        <CircleDollarSign />
        {isProcessing ? "Processing..." : "Send ETH"}
      </button>
    </div>
  );
};

export default TransactionForm;
