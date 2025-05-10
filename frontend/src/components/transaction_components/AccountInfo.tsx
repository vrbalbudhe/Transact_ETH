import React from "react";

interface Props {
  account: string | null;
  copyToClipboard: (text: string) => void;
}

const AccountInfo: React.FC<Props> = ({ account, copyToClipboard }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-5 border border-gray-700/50">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-sm">Connected Account</p>
        {account && (
          <button
            onClick={() => copyToClipboard(account)}
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
        )}
      </div>
      <div className="bg-gray-900/80 rounded-lg px-4 py-3 font-mono text-blue-400 text-sm break-all flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-1"></div>
        <span>{account}</span>
      </div>
    </div>
  );
};

export default AccountInfo;
