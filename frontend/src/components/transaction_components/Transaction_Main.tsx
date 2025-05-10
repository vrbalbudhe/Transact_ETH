import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import TransactionStatus from "./TransactionStatus";
import TransactionDetails from "./TransactionDetails";
import TransactionForm from "./TransactionForm";
import AccountInfo from "./AccountInfo";
import ContractInfo from "./ContractInfo";
import TransactionSelector from "./TransactionSelector";
import EscrowApproval from "../Escrow/EscrowApproval"; // Import the new component

import ABI from "../../contracts/Transaction.json";
import EscrowABI from "../../contracts/Escrow.json";

import { ArrowDownUp, Wallet2 } from "lucide-react";
import WalletNetworkInfo from "./WalletNetworkInfo";

interface TransactionProps {
  account: string | null;
}

// Define the EscrowInfo interface for type safety
interface EscrowInfo {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  buyerApproved: boolean;
  sellerApproved: boolean;
  state: number; // 0: Pending, 1: Approved, 2: Completed
}

const Transaction_Main: React.FC<TransactionProps> = ({ account }) => {
  // Add default fallback values for contract addresses
  const transactionAddress =
    import.meta.env.VITE_TRANSACTION_CONTRACT_ADDRESS || "";
  const escrowAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS || "";

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState("normal"); // Set a default method
  const [provider, setProvider] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [transactionContract, setTransactionContract] =
    useState<ethers.Contract | null>(null);
  const [escrowContract, setEscrowContract] = useState<ethers.Contract | null>(
    null
  );

  const [escrows, setEscrows] = useState<EscrowInfo[]>([]);
  const [isLoadingEscrows, setIsLoadingEscrows] = useState(false);

  const [txDetails, setTxDetails] = useState<{
    hash: string;
    status: string;
    gasUsed: string;
    blockNumber: number | null;
    escrowId?: string; // Add escrow ID to transaction details
  } | null>(null);

  // Setup event listeners for the Escrow contract
  const setupEscrowEventListeners = (
    escrowContract: ethers.Contract,
    account: string
  ) => {
    escrowContract.on("EscrowCreated", (id, buyer, seller, amount) => {
      console.log(`New escrow created: ID ${id}`);
      if (
        buyer.toLowerCase() === account.toLowerCase() ||
        seller.toLowerCase() === account.toLowerCase()
      ) {
        // Call the local method instead of an imported one
        loadUserEscrows(escrowContract, account);
      }
    });

    // Listen for escrow approvals
    escrowContract.on("Approved", (id, approver) => {
      console.log(`Escrow ${id} approved by ${approver}`);
      loadUserEscrows(escrowContract, account);
    });

    // Listen for completed escrows
    escrowContract.on("FundsReleased", (id, seller, amount) => {
      console.log(`Escrow ${id} completed, funds released to ${seller}`);
      loadUserEscrows(escrowContract, account);

      // Show a notification if the user is involved
      if (seller.toLowerCase() === account.toLowerCase()) {
        // Need to access the component's state setter
        setTransactionStatus(
          `You've received ${ethers.utils.formatEther(
            amount
          )} ETH from escrow ${id}`
        );
      } else {
        setTransactionStatus(
          `Escrow ${id} completed, funds released to ${seller}`
        );
      }
    });

    // Return a cleanup function to remove listeners
    return () => {
      escrowContract.removeAllListeners("EscrowCreated");
      escrowContract.removeAllListeners("Approved");
      escrowContract.removeAllListeners("FundsReleased");
    };
  };

  // Modify your useEffect to include this event listener setup:

  useEffect(() => {
    const init = async () => {
      if (!account || !window.ethereum) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();

        // Validate contract addresses before creating contract instances
        if (!transactionAddress) {
          console.error("Transaction contract address is not defined");
          return;
        }

        if (!escrowAddress) {
          console.error("Escrow contract address is not defined");
          return;
        }

        // Create contract instances only if addresses are valid
        const transactionInstance = new ethers.Contract(
          transactionAddress,
          ABI.abi,
          signer
        );

        const escrowInstance = new ethers.Contract(
          escrowAddress,
          EscrowABI.abi,
          signer
        );

        setProvider(network.name);
        setWallet(provider.connection.url);
        setTransactionContract(transactionInstance);
        setEscrowContract(escrowInstance);

        // Load existing escrows for the current user
        if (escrowInstance) {
          loadUserEscrows(escrowInstance, account);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setTransactionStatus(
          "Failed to initialize contracts. Check console for details."
        );
      }
    };

    init();

    // Set up event listeners for the escrow contract after initialization
    if (escrowContract && account) {
      const cleanup = setupEscrowEventListeners(escrowContract, account);

      // Clean up event listeners when the component unmounts or dependencies change
      return cleanup;
    }
  }, [account, transactionAddress, escrowAddress, escrowContract]);

  useEffect(() => {
    const init = async () => {
      if (!account || !window.ethereum) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();

        // Validate contract addresses before creating contract instances
        if (!transactionAddress) {
          console.error("Transaction contract address is not defined");
          return;
        }

        if (!escrowAddress) {
          console.error("Escrow contract address is not defined");
          return;
        }

        // Create contract instances only if addresses are valid
        const transactionInstance = new ethers.Contract(
          transactionAddress,
          ABI.abi,
          signer
        );

        const escrowInstance = new ethers.Contract(
          escrowAddress,
          EscrowABI.abi,
          signer
        );

        setProvider(network.name);
        setWallet(provider.connection.url);
        setTransactionContract(transactionInstance);
        setEscrowContract(escrowInstance);

        // Load existing escrows for the current user
        if (escrowInstance) {
          loadUserEscrows(escrowInstance, account);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setTransactionStatus(
          "Failed to initialize contracts. Check console for details."
        );
      }
    };

    init();
  }, [account, transactionAddress, escrowAddress]);

  const loadUserEscrows = async (
    escrowContract: ethers.Contract,
    userAddress: string
  ) => {
    try {
      setIsLoadingEscrows(true);

      // Get the current escrow count
      const escrowCount = await escrowContract.escrowcount();
      const userEscrows: EscrowInfo[] = [];

      // Loop through all escrows to find those where the user is involved
      for (let i = 1; i <= escrowCount.toNumber(); i++) {
        const escrow = await escrowContract.escrows(i);

        if (
          escrow.buyer.toLowerCase() === userAddress.toLowerCase() ||
          escrow.seller.toLowerCase() === userAddress.toLowerCase()
        ) {
          userEscrows.push({
            id: i.toString(),
            buyer: escrow.buyer,
            seller: escrow.seller,
            amount: ethers.utils.formatEther(escrow.amount),
            buyerApproved: escrow.buyerApproved,
            sellerApproved: escrow.sellerApproved,
            state: escrow.state,
          });
        }
      }

      setEscrows(userEscrows);
    } catch (error) {
      console.error("Error loading escrows:", error);
    } finally {
      setIsLoadingEscrows(false);
    }
  };

  // Handle escrow approval
  const handleApproveEscrow = async (escrowId: string) => {
    if (!escrowContract || !account) return;

    try {
      setIsProcessing(true);
      const tx = await escrowContract.approve(escrowId);

      setTransactionStatus(`Approving Escrow ID ${escrowId}. Waiting...`);

      const receipt = await tx.wait();

      setTransactionStatus(`Escrow ID ${escrowId} approval confirmed!`);

      // Refresh the escrow list
      loadUserEscrows(escrowContract, account);
    } catch (error: any) {
      setTransactionStatus(
        `Escrow approval failed: ${error?.message?.split("(")[0]}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransaction = async () => {
    if (!recipient || !amount || !method) {
      setTransactionStatus(
        "Please fill all fields and select a transaction method"
      );
      return;
    }

    try {
      setIsProcessing(true);
      const value = ethers.utils.parseEther(amount);

      setTransactionStatus("Transaction Sent. Waiting...");
      setTxDetails({
        hash: "",
        status: "Pending",
        gasUsed: "Calculating...",
        blockNumber: null,
      });

      let tx;
      if (method === "normal" && transactionContract) {
        tx = await transactionContract.makeTransaction(recipient, { value });
      } else if (method === "escrow" && escrowContract) {
        tx = await escrowContract.createEscrow(recipient, { value });
      } else {
        throw new Error("Invalid method or contract not initialized");
      }

      if (!tx) throw new Error("Transaction initiation failed");

      setTxDetails((prev) => ({
        hash: tx.hash,
        status: prev?.status || "Pending",
        gasUsed: prev?.gasUsed || "Calculating...",
        blockNumber: prev?.blockNumber || null,
      }));

      const receipt = await tx.wait();

      let escrowId;
      if (method === "escrow") {
        const event = receipt.events?.find(
          (e: any) => e.event === "EscrowCreated"
        );

        if (event && event.args) {
          escrowId = event.args.id.toString();
          console.log(`New escrow created with ID: ${escrowId}`);
        }
      }

      setTxDetails({
        hash: tx.hash,
        status: "Confirmed",
        gasUsed:
          ethers.utils.formatEther(
            receipt.gasUsed.mul(receipt.effectiveGasPrice)
          ) + " ETH",
        blockNumber: receipt.blockNumber,
        escrowId: escrowId,
      });

      if (method === "normal") {
        setTransactionStatus("Transaction Successful");
      } else {
        setTransactionStatus(`Escrow Created Successfully! ID: ${escrowId}`);
        if (escrowContract && account) {
          loadUserEscrows(escrowContract, account);
        }
      }

      setRecipient("");
      setAmount("");
    } catch (error: any) {
      setTransactionStatus(
        "Transaction Failed: " + error?.message?.split("(")[0]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="p-8 max-w-xl mx-auto bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
      <WalletNetworkInfo provider={provider} wallet={wallet} />

      <AccountInfo account={account} copyToClipboard={copyToClipboard} />

      <ContractInfo contractType={method} copyToClipboard={copyToClipboard} />

      <TransactionSelector
        method={(selectedMethod) => {
          setMethod(selectedMethod);
        }}
      />

      <TransactionForm
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        handleTransaction={handleTransaction}
        isProcessing={isProcessing}
        truncateAddress={truncateAddress}
      />

      <TransactionStatus status={transactionStatus} />
      <TransactionDetails txDetails={txDetails} />

      {escrowContract && account && (
        <EscrowApproval
          escrows={escrows}
          onApprove={handleApproveEscrow}
          isProcessing={isProcessing}
          userAddress={account}
          truncateAddress={truncateAddress}
        />
      )}
    </div>
  );
};

export default Transaction_Main;
