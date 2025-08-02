/**
 * Currency utility functions with environment configuration
 */

export interface CurrencyConfig {
  symbol: string;
  decimals: number;
}

/**
 * Get currency configuration from environment variables
 */
export function getCurrencyConfig(): CurrencyConfig {
  const defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY || 'ETH';
  const decimals = parseInt(import.meta.env.VITE_CURRENCY_DECIMALS || '5', 10);

  return {
    symbol: defaultCurrency,
    decimals: Math.max(0, Math.min(18, decimals)) // Clamp between 0 and 18 for safety
  };
}

/**
 * Format price with configured currency and decimals
 */
export function formatPrice(price: string | number): string {
  const config = getCurrencyConfig();
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return `0 ${config.symbol}`;
  }

  return `${numericPrice.toFixed(config.decimals)} ${config.symbol}`;
}

/**
 * Format price for display with currency symbol
 */
export function formatPriceDisplay(price: string | number): string {
  const config = getCurrencyConfig();
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return `${config.symbol} 0`;
  }

  return `${config.symbol} ${numericPrice.toFixed(config.decimals)}`;
}

/**
 * Get just the currency symbol
 */
export function getCurrencySymbol(): string {
  return getCurrencyConfig().symbol;
}

/**
 * Get configured decimal places
 */
export function getCurrencyDecimals(): number {
  return getCurrencyConfig().decimals;
}

/**
 * Parse price to number with proper decimals
 */
export function parsePrice(price: string | number): number {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const decimals = getCurrencyDecimals();
  
  if (isNaN(numericPrice)) {
    return 0;
  }

  return parseFloat(numericPrice.toFixed(decimals));
}
