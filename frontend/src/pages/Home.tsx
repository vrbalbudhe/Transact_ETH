import { useState } from "react";
import ConnectWallet from "../components/connectwallet_components/ConnectWallet";
import BaseLayout from "../layouts/BaseLayout";

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <BaseLayout account={account}>
      <ConnectWallet setAccount={setAccount} />
    </BaseLayout>
  );
};

export default Home;
