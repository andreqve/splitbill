/**
 * Format currency in Indonesian format with dot separators
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  if (isNaN(amount)) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with dot separators (no currency symbol)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(amount) {
  if (isNaN(amount)) return '0';
  
  return new Intl.NumberFormat('id-ID').format(amount);
}