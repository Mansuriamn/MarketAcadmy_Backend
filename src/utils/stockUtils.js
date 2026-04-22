/**
 * Senior Developer Utility: Resolves symbol to Yahoo Finance format.
 * Defaults to .NS (NSE) if no exchange is specified.
 */
export const resolveStockSymbol = (symbol) => {
  if (!symbol) return "";
  const cleaned = symbol.trim().toUpperCase();
  // If it has a dot (exchange specified) or dash (crypto/pair), use it as is
  if (cleaned.includes('.') || cleaned.includes('-')) {
    return cleaned;
  }
  // Default to NSE
  return `${cleaned}.NS`;
};
