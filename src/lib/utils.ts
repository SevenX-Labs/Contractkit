import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { InvoiceItem } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencySymbol: string = "₹"): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currencySymbol}0.00`;
  }
  return `${currencySymbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function incrementInvoiceNumber(lastNum: string, prefix: string = "SXL-INV-"): string {
  if (!lastNum) return `${prefix}001`;
  
  const match = lastNum.match(/\d+$/);
  if (!match) return `${prefix}001`;
  
  const numericPart = match[0];
  const nextNum = parseInt(numericPart, 10) + 1;
  const paddedNum = nextNum.toString().padStart(numericPart.length, "0");
  
  return lastNum.replace(/\d+$/, paddedNum);
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  discountPercent: number = 0,
  taxPercent: number = 0
) {
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = (subtotal * (discountPercent || 0)) / 100;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (subtotalAfterDiscount * (taxPercent || 0)) / 100;
  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}
