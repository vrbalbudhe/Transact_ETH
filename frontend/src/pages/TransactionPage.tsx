import { useLocation } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import Transaction_Main from "../components/transaction_components/Transaction_Main";

const TransactionPage = () => {
  const location = useLocation();
  const account = location.state?.account || null;

  return (
    <BaseLayout account={account}>
      {account ? (
        <Transaction_Main account={account} />
      ) : (
        <p className="text-red-400">
          Please connect your wallet first on the Home page.
        </p>
      )}
    </BaseLayout>
  );
};

export default TransactionPage;
