import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

interface PriceData {
  currency: string;
  price: number;
}

interface SwapResult {
  rate: number;
  output: number;
}

export default function App() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<SwapResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get<PriceData[]>("https://interview.switcheo.com/prices.json")
      .then((res) => setPrices(res.data))
      .catch(() => setError("Failed to fetch prices"));
  }, []);

  const handleSwap = () => {
    setError("");
    setResult(null);

    if (!fromToken || !toToken) {
      setError("Please select both tokens.");
      return;
    }
    if (fromToken === toToken) {
      setError("Tokens must be different.");
      return;
    }

    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    const from = prices.find((p) => p.currency === fromToken);
    const to = prices.find((p) => p.currency === toToken);

    if (!from || !to) {
      setError("Price data unavailable for selected tokens.");
      return;
    }

    const rate = to.price / from.price;
    const output = value * rate;
    setResult({ rate, output });
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setResult(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl mx-auto"
      >
        <div className="text-2xl font-bold mb-6 text-center">Currency Swap</div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-400">From</label>
          <select
            className="w-full p-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="">Select token</option>
            {prices.map((t) => (
              <option key={t.currency} value={t.currency}>
                {t.currency}
              </option>
            ))}
          </select>
        </div>

        <div className="flex">
          <button
            type="button"
            onClick={handleSwitch}
            className="bg-gray-600 p-2 rounded-full hover:bg-gray-500 transition mx-auto"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 text-gray-400">To</label>
          <select
            className="w-full p-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          >
            <option value="">Select token</option>
            {prices.map((t) => (
              <option key={t.currency} value={t.currency}>
                {t.currency}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-400">Amount</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 bg-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          onClick={handleSwap}
          className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-lg font-semibold transition-all cursor-pointer"
        >
          Swap
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 text-center bg-gray-700 p-3 rounded-lg"
          >
            <p>
              <strong>Rate:</strong> 1 {fromToken} = {result.rate.toFixed(6)}{" "}
              {toToken}
            </p>
            <p className="mt-1">
              <strong>Output:</strong> {result.output.toFixed(4)} {toToken}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
