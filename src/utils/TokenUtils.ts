import { tokens } from 'constants/acceptedTokens';

export function getTokenDecimals(tokenSymbol: string) {
  const token = tokens.find((token) => token.symbol === tokenSymbol);
  if (!token) {
    return null;
  }
  return token.decimals;
}

export const getRoundedAmountText = (amount: number) => {
  if (amount < 0.001) {
    return '< 0.001';
  }
  return amount.toFixed(3);
};
