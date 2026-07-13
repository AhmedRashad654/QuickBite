export const formatPrice = (price: number, currency?: string) => {
  const formatted = (price / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency || ""}`;
};

export const formatPercentage = (percentage: number) => {
  return `${percentage / 100} ${percentage > 0 ? "%" : ""} `;
};
