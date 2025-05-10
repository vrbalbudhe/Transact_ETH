import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ABI from "../../contracts/Transaction.json";
import { useNavigate } from "react-router-dom";
import { Cable } from "lucide-react";
import FeatureShowcase from "./FeatureShowcase";
import HeadingComponent from "./HeadingComponent";

interface ConnectWalletProps {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ setAccount }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const contractAddress = import.meta.env.VITE_TRANSACTION_CONTRACT_ADDRESS;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast("Welcome to Blockchain Transaction System", "info");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const options = {
      position: "top-right" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      transition: Slide,
      theme: "dark" as const,
    };

    if (type === "success") toast.success(message, options);
    else if (type === "error") toast.error(message, options);
    else toast.info(message, options);
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      if (!window?.ethereum) {
        showToast("Please install MetaMask", "error");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAccount = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(userAccount);
      showToast(`Connected to ${network.name} network`, "success");

      const transactionContract = new ethers.Contract(
        contractAddress,
        ABI.abi,
        signer
      );

      showToast("Smart contract loaded successfully", "success");

      navigate("/transactions", { state: { account: userAccount } });
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to connect wallet or load contract.", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:min-w-lg mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-gray-800 text-white border border-gray-700"
        limit={3}
      />
      <HeadingComponent />
      <div className="bg-gray-800 rounded-xl p-6 w-full shadow-lg border border-gray-700">
        <FeatureShowcase />
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
        >
          {isConnecting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <Cable size={17} />
              <p className="ml-1">Connect MetaMask</p>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs">
        <p>By connecting your wallet, you agree to our Terms of Service</p>
      </div>
    </div>
  );
};

export default ConnectWallet;
