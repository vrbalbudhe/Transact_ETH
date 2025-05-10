import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TransactionPage from "./pages/TransactionPage";
import TransactionHistory from "./pages/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transactions" element={<TransactionPage />} />
      <Route path="/history" element={<TransactionHistory />} />
    </Routes>
  );
}

export default App;
