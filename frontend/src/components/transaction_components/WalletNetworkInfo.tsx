import { ArrowDownUp, HistoryIcon, Wallet2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalletNetworkInfoProps {
  provider: String | null;
  wallet: String | null;
}

const WalletNetworkInfo: React.FC<WalletNetworkInfoProps> = ({
  provider,
  wallet,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-5 select-none">
      <div className="mb-2 text-gray-400 flex items-center gap-1">
        <ArrowDownUp size={18} color="green" />
        {provider ? (
          <span className="text-md">{provider}</span>
        ) : (
          <span className="text-md text-red-400">Unable to detect</span>
        )}
      </div>
      <div className="mb-2 select-none text-gray-400 flex items-center gap-1">
        <Wallet2 size={18} />
        {wallet ? (
          <span className="text-md">{wallet}</span>
        ) : (
          <span className="text-md text-red-400">Unable to detect</span>
        )}
      </div>
      <div className="mb-2 select-none text-gray-400 flex items-center gap-1">
        <HistoryIcon size={18} />
        {wallet ? (
          <p onClick={() => navigate("/history")}>History</p>
        ) : (
          <span className="text-md text-red-400">Unable to detect</span>
        )}
      </div>
    </div>
  );
};

export default WalletNetworkInfo;
