// TransactionHistory.tsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, RefreshCw } from "lucide-react";
import TransactionABI from "../contracts/Transaction.json";
import EscrowABI from "../contracts/Escrow.json";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../utils/ToastUtils";
import WalletConnectionHandler from "../components/History/WalletConnectionHandler";
import FilterPanel from "../components/History/FilterPanel";
import TransactionTable from "../components/History/TransactionTable";
import TransactionDetailModal from "../components/History/TransactionDetailModal";
import {
  Transaction,
  EscrowTransaction,
  TransactionType,
} from "../types/TransactionTypes";

const TransactionHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<
    (Transaction | EscrowTransaction)[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    (Transaction | EscrowTransaction)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(
    location.state?.account || null
  );

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    showFilters: false,
    transactionType: "all" as "all" | "normal" | "escrow",
    status: "all" as "all" | "pending" | "completed" | "canceled",
  });

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp" as "timestamp" | "amount",
    direction: "desc" as "asc" | "desc",
  });

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<
    (Transaction | EscrowTransaction) | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const contractAddress = import.meta.env.VITE_TRANSACTION_CONTRACT_ADDRESS;
  const escrowContractAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS;

  useEffect(() => {
    // If we don't have account in state, check if we can get it from MetaMask
    if (!account) {
      checkWalletConnection();
    } else {
      fetchTransactions();
    }
  }, [account]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, sortConfig]);

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        showToast(
          "MetaMask not installed. Please install MetaMask to view your transactions.",
          "error"
        );
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      // Check if already connected
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        // User is already connected with MetaMask
        setAccount(accounts[0]);
        showToast("Connected with MetaMask", "success");
      } else {
        // Prompt user to connect their wallet
        showToast("Please connect your wallet to view transactions", "info");
        try {
          const requestedAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          if (requestedAccounts && requestedAccounts.length > 0) {
            setAccount(requestedAccounts[0]);
            showToast("Wallet connected successfully", "success");
          }
        } catch (connError) {
          console.error("User rejected connection:", connError);
          showToast(
            "You need to connect your wallet to view transaction history",
            "error"
          );
          setTimeout(() => navigate("/"), 3000);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      showToast("Error connecting to wallet", "error");
      setTimeout(() => navigate("/"), 3000);
    }
  };

  const fetchTransactions = async () => {
    if (!window.ethereum || !account || !contractAddress) {
      showToast("Wallet not connected or contract not configured", "error");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Validate contract address before proceeding
      if (!contractAddress) {
        console.error("Contract address is undefined");
        showToast("Contract configuration error", "error");
        setIsLoading(false);
        return;
      }

      const contract = new ethers.Contract(
        contractAddress,
        TransactionABI.abi,
        signer
      );

      // Get normal transactions
      const normalTransactions = await fetchNormalTransactions(
        contract,
        provider,
        account
      );

      // Get escrow transactions if escrow contract address is available
      let escrowTransactions: EscrowTransaction[] = [];
      if (escrowContractAddress) {
        escrowTransactions = await fetchEscrowTransactions(
          provider,
          signer,
          account
        );
      }

      // Combine all transactions
      const allTransactions = [...normalTransactions, ...escrowTransactions];

      // Sort transactions by timestamp (newest first by default)
      allTransactions.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(allTransactions);
      setIsLoading(false);

      showToast(`Loaded ${allTransactions.length} transactions`, "success");
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Failed to fetch transaction history", "error");
      setIsLoading(false);
    }
  };

  const fetchNormalTransactions = async (
    contract: ethers.Contract,
    provider: ethers.providers.Web3Provider,
    userAccount: string
  ) => {
    const fromBlock = 0; // Starting block - ideally would be more optimized in production
    const currentBlock = await provider.getBlockNumber();

    // Get all transaction recorded events
    const txFilter = contract.filters.TransactionRecorded(null, null);
    const txEvents = await contract.queryFilter(
      txFilter,
      fromBlock,
      currentBlock
    );

    // Process events into our transaction format
    const normalTransactions: Transaction[] = [];

    txEvents.forEach((event) => {
      if (!event.args) {
        console.error("Event args undefined:", event);
        return;
      }

      const args: any = event.args;
      const sender = args.sender;
      const receiver = args.receiver;
      const amount = args.amount;
      const timestamp = args.timestamp;

      // Only include transactions where the current account is sender or receiver
      if (
        sender.toLowerCase() === userAccount.toLowerCase() ||
        receiver.toLowerCase() === userAccount.toLowerCase()
      ) {
        normalTransactions.push({
          id: `${event.transactionHash}-${event.logIndex}`,
          type: TransactionType.Normal,
          sender,
          receiver,
          amount: ethers.utils.formatEther(amount),
          timestamp: timestamp.toNumber(),
          transactionHash: event.transactionHash,
        });
      }
    });

    // Method 2: Use the contract's view function as fallback
    try {
      // Get transaction count for this user
      const txCount = await contract.getTransactionCount(userAccount);

      // Fetch all transactions for this user
      if (txCount > 0) {
        const contractTransactions = await contract.getTransactions(
          userAccount
        );

        // Process contract data
        for (let i = 0; i < contractTransactions.length; i++) {
          const tx = contractTransactions[i];

          // Check if this transaction is already in our list (to avoid duplicates)
          const exists = normalTransactions.some(
            (existingTx) =>
              existingTx.sender.toLowerCase() === tx.sender.toLowerCase() &&
              existingTx.receiver.toLowerCase() === tx.receiver.toLowerCase() &&
              existingTx.amount === ethers.utils.formatEther(tx.amount) &&
              existingTx.timestamp === tx.timestamp.toNumber()
          );

          if (!exists) {
            normalTransactions.push({
              id: `contract-${i}`,
              type: TransactionType.Normal,
              sender: tx.sender,
              receiver: tx.receiver,
              amount: ethers.utils.formatEther(tx.amount),
              timestamp: tx.timestamp.toNumber(),
              transactionHash: "",
            });
          }
        }
      }
    } catch (contractError) {
      console.warn(
        "Could not fetch transaction data from contract method:",
        contractError
      );
      // Continue with event data only
    }

    return normalTransactions;
  };

  const fetchEscrowTransactions = async (
    provider: ethers.providers.Web3Provider,
    signer: ethers.providers.JsonRpcSigner,
    userAccount: string
  ) => {
    if (!escrowContractAddress) {
      console.warn("Escrow contract address not configured");
      return [];
    }

    try {
      // Create an instance of the escrow contract
      const escrowContract = new ethers.Contract(
        escrowContractAddress,
        EscrowABI.abi,
        signer
      );

      // Get the total number of escrows
      const escrowCount = await escrowContract.escrowcount();
      console.log(`Total escrow count: ${escrowCount.toString()}`);

      const escrowTransactions: EscrowTransaction[] = [];

      // Loop through all escrows and check if the current user is involved
      for (let i = 1; i <= escrowCount.toNumber(); i++) {
        try {
          const escrow = await escrowContract.escrows(i);

          // Check if the current user is buyer or seller
          if (
            escrow.buyer.toLowerCase() === userAccount.toLowerCase() ||
            escrow.seller.toLowerCase() === userAccount.toLowerCase()
          ) {
            // Map enum EscrowState to our status type:
            // 0 = Pending, 1 = Approved, 2 = Completed
            let status: "pending" | "completed" | "canceled" = "pending";
            if (escrow.state === 2) {
              // Completed
              status = "completed";
            } else if (escrow.state === 0) {
              // Pending
              status = "pending";
            }

            // Get the transaction hash and timestamp from creation event
            let transactionHash = "";
            let timestamp = Math.floor(Date.now() / 1000); // Default to now if we can't get real timestamp

            try {
              // Find the EscrowCreated event for this escrow
              const filter = escrowContract.filters.EscrowCreated(i);
              const events = await escrowContract.queryFilter(filter);
              if (events.length > 0) {
                // Get transaction hash
                transactionHash = events[0].transactionHash;

                // Get block timestamp
                const txReceipt = await provider.getTransaction(
                  transactionHash
                );
                if (txReceipt && txReceipt.blockNumber) {
                  const block = await provider.getBlock(txReceipt.blockNumber);
                  if (block) {
                    timestamp = block.timestamp;
                  }
                }
              }
            } catch (eventError) {
              console.warn(
                `Could not fetch event for escrow ${i}:`,
                eventError
              );
            }

            // Create conditions text from approval status
            let conditions = "";
            if (escrow.buyer.toLowerCase() === userAccount.toLowerCase()) {
              conditions = escrow.buyerApproved
                ? "You have approved this escrow. Waiting for seller approval."
                : "Waiting for your approval to release funds.";

              if (escrow.sellerApproved && !escrow.buyerApproved) {
                conditions = "Seller has approved. Waiting for your approval.";
              }
            } else {
              conditions = escrow.sellerApproved
                ? "You have approved this escrow. Waiting for buyer approval."
                : "Waiting for your approval to receive funds.";

              if (escrow.buyerApproved && !escrow.sellerApproved) {
                conditions = "Buyer has approved. Waiting for your approval.";
              }
            }

            if (status === "completed") {
              conditions = "Transaction completed. Funds have been released.";
            }

            escrowTransactions.push({
              id: `escrow-${i}`,
              type: TransactionType.Escrow,
              sender: escrow.buyer,
              receiver: escrow.seller,
              amount: ethers.utils.formatEther(escrow.amount),
              timestamp,
              transactionHash,
              escrowId: i.toString(),
              status,
              releaseDate: 0, // Not available in contract
              conditions,
              buyerApproved: escrow.buyerApproved,
              sellerApproved: escrow.sellerApproved,
            });
          }
        } catch (error) {
          console.error(`Error fetching escrow ${i}:`, error);
        }
      }

      console.log(
        `Found ${escrowTransactions.length} escrow transactions for address ${userAccount}`
      );
      return escrowTransactions;
    } catch (error) {
      console.error("Error fetching escrow transactions:", error);
      return [];
    }
  };

  // Helper function to approve escrow
  const approveEscrow = async (escrowId: string) => {
    if (!window.ethereum || !account || !escrowContractAddress) {
      showToast("Wallet not connected or contract not configured", "error");
      return false;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const escrowContract = new ethers.Contract(
        escrowContractAddress,
        EscrowABI.abi,
        signer
      );

      // Approve the escrow
      const tx = await escrowContract.approve(escrowId);

      // Wait for transaction to be mined
      await tx.wait();

      showToast(`Escrow #${escrowId} approved successfully`, "success");

      // Refresh transactions after approval
      fetchTransactions();
      return true;
    } catch (error) {
      console.error("Error approving escrow:", error);
      showToast(
        `Failed to approve escrow: ${(error as Error).message}`,
        "error"
      );
      return false;
    }
  };

  const applyFilters = () => {
    let results = [...transactions];

    // Filter by transaction type
    if (filters.transactionType !== "all") {
      results = results.filter((tx) =>
        filters.transactionType === "normal"
          ? tx.type === TransactionType.Normal
          : tx.type === TransactionType.Escrow
      );
    }

    // Filter by status for escrow transactions
    if (filters.status !== "all") {
      results = results.filter((tx) => {
        if (tx.type === TransactionType.Normal) return true;
        const escrowTx = tx as EscrowTransaction;
        return escrowTx.status === filters.status;
      });
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromTimestamp = new Date(filters.dateFrom).getTime() / 1000;
      results = results.filter((tx) => tx.timestamp >= fromTimestamp);
    }

    if (filters.dateTo) {
      const toTimestamp = new Date(filters.dateTo).getTime() / 1000 + 86400; // Add a day to include the end date
      results = results.filter((tx) => tx.timestamp <= toTimestamp);
    }

    // Filter by amount range
    if (filters.amountMin) {
      results = results.filter(
        (tx) => parseFloat(tx.amount) >= parseFloat(filters.amountMin)
      );
    }

    if (filters.amountMax) {
      results = results.filter(
        (tx) => parseFloat(tx.amount) <= parseFloat(filters.amountMax)
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? parseFloat(a.amount) - parseFloat(b.amount)
          : parseFloat(b.amount) - parseFloat(a.amount);
      } else {
        // Default sort by timestamp
        return sortConfig.direction === "asc"
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp;
      }
    });

    setFilteredTransactions(results);
  };

  const handleSort = (key: "timestamp" | "amount") => {
    let direction: "asc" | "desc" = "desc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  const handleTransactionClick = (
    transaction: Transaction | EscrowTransaction
  ) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto rounded-md bg-[#1b263b] m-4 min-h-screen px-4 py-8 max-w-6xl">
      <ToastContainer theme="dark" />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft color="white" size={20} />
          </button>
          <h1 className="text-2xl font-medium text-white">
            Transaction History
          </h1>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() =>
              setFilters({ ...filters, showFilters: !filters.showFilters })
            }
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <span className="mr-2">🔍</span>
            Filters
          </button>

          <button
            onClick={fetchTransactions}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel Component */}
      {filters.showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setFilters({ ...filters, showFilters: false })}
        />
      )}

      {/* Transaction Table Component */}
      <TransactionTable
        filteredTransactions={filteredTransactions}
        isLoading={isLoading}
        handleSort={handleSort}
        sortConfig={sortConfig}
        account={account}
        onTransactionClick={handleTransactionClick}
        transactionsCount={transactions.length}
      />

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          transaction={selectedTransaction}
          account={account}
          onApproveEscrow={approveEscrow}
          onTransactionUpdated={fetchTransactions}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
