/**
 * Currency and Numerical Formatting Utilities
 */

/**
 * Formats a number into standard USD currency representation ($XX.XX)
 * @param amount The numerical value to format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats an ISO date string or timestamp into a readable text format
 * @param dateString The ISO date string or timestamp
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a timestamp into a short time-only format (e.g. "12:30 PM")
 * @param dateString The ISO timestamp
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Shortens a standard GUID/UUID string for display (e.g. "order-129381" -> "#129381")
 * @param id The full ID string
 */
export const truncateId = (id: string): string => {
  if (id.startsWith('order-')) {
    return `#${id.substring(6)}`;
  }
  if (id.length > 8) {
    return `#${id.substring(id.length - 6)}`;
  }
  return `#${id}`;
};
