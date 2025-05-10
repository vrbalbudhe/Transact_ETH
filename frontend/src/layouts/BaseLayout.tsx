import { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

type Props = {
  account: string | null;
  children: ReactNode;
};

const BaseLayout = ({ account, children }: Props) => {
  return (
    <div className="App w-full bg-gradient-to-t from-gray-800 to-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-slate-800 rounded-md shadow-3xl overflow-hidden">
        <Navbar account={account} />
        <div className="p-6">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default BaseLayout;
