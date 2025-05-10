// WalletConnectionHandler.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/ToastUtils";

interface WalletConnectionHandlerProps {
  onConnected: (account: string) => void;
}

const WalletConnectionHandler = ({
  onConnected,
}: WalletConnectionHandlerProps) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          onConnected(accounts[0]);
          showToast(
            `Switched to account ${formatAddress(accounts[0])}`,
            "info"
          );
        } else {
          showToast("Disconnected from wallet", "info");
          navigate("/");
        }
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      setIsConnecting(true);

      if (!window.ethereum) {
        showToast(
          "MetaMask not installed. Please install MetaMask to continue.",
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
        onConnected(accounts[0]);
        showToast(
          `Connected to wallet ${formatAddress(accounts[0])}`,
          "success"
        );
      } else {
        connectWallet();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      showToast("Failed to check wallet connection", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      showToast("Please connect your wallet to continue", "info");

      const requestedAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (requestedAccounts && requestedAccounts.length > 0) {
        onConnected(requestedAccounts[0]);
        showToast("Wallet connected successfully", "success");
      } else {
        throw new Error("No accounts found");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      showToast("Failed to connect wallet. Please try again.", "error");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // This component doesn't render anything
  return null;
};

export default WalletConnectionHandler;
