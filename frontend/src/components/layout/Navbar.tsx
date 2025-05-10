import { Fingerprint } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

interface NavbarProps {
  account: string | null;
}

const Navbar = ({ account }: NavbarProps) => {
  const navigate = useNavigate();
  return (
    <header className="bg-inherit p-4 flex items-center justify-between">
      <h1
        onClick={() => navigate("/")}
        className="text-md font-medium cursor-pointer select-none -tracking-tighter text-white"
      >
        TransactETH
      </h1>
      {account && (
        <div className="md:flex items-center gap-2 text-gray-300 text-sm">
          <Fingerprint size={22} />
          {/* <span className="hidden sm:inline mr-2">Connected Account :</span> */}
          <span className="font-mono bg-gray-700 rounded-lg px-3 py-1">
            {account.substring(0, 6)}...
            {account.substring(account.length - 4)}
          </span>
        </div>
      )}
    </header>
  );
};

export default Navbar;
