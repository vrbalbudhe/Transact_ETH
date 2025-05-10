import React from "react";

const TransactionStatus: React.FC<{ status: string }> = ({ status }) => {
  return status ? (
    <p className="mt-4 text-sm text-yellow-300 text-center">{status}</p>
  ) : null;
};

export default TransactionStatus;
