import React, { useMemo } from "react";
import type { BoxProps } from "in-a-lib"; // or wherever BoxProps comes from

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface Props extends BoxProps {}

const PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return PRIORITY[blockchain] ?? -99;
};

export const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Compute formatted + sorted balances once
  const preparedBalances = useMemo(() => {
    return balances
      .filter((b) => getPriority(b.blockchain) > -99 && b.amount > 0)
      .map((b) => ({
        ...b,
        formatted: b.amount.toFixed(2),
        usdValue: (prices[b.currency] ?? 0) * b.amount,
        priority: getPriority(b.blockchain),
      }))
      .sort((a, b) => b.priority - a.priority);
  }, [balances, prices]);

  return (
    <div {...rest}>
      {preparedBalances.map((b) => (
        <WalletRow
          key={`${b.blockchain}-${b.currency}`}
          amount={b.amount}
          usdValue={b.usdValue}
          formattedAmount={b.formatted}
        />
      ))}
    </div>
  );
};
