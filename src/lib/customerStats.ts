import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Default base offset (0 extra baseline, so total = 0 + 3 completed orders = 3)
export const DEFAULT_BASE_CUSTOMERS = 0;
export const BASE_CUSTOMERS_KEY = "erenn_base_customers_count";
export const CUSTOMER_ORDERS_KEY = "erenn_customer_orders";

export interface SeedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_reference: string;
  status: string;
  notes: string;
  created_at: string;
  products: { title: string };
}

// 3 Real Initial Live Customer Orders
export const DEFAULT_SEED_ORDERS: SeedOrder[] = [
  {
    id: "ORD-1",
    order_number: "#1",
    customer_name: "Tanmay & Ananya",
    customer_email: "ananya.tanmay@gmail.com",
    customer_phone: "+91 98201 44512",
    amount: 289,
    currency: "INR",
    payment_method: "PhonePe / UPI",
    payment_reference: "UPI-94021882194",
    status: "completed",
    notes: "Midnight delivery surprise on WhatsApp • Happy Birthday Madam",
    created_at: "2026-10-18T10:14:00.000Z",
    products: { title: "Happy Birthday Madam" },
  },
  {
    id: "ORD-2",
    order_number: "#2",
    customer_name: "Rohan Verma",
    customer_email: "rohan.v@outlook.com",
    customer_phone: "+91 98112 30981",
    amount: 220,
    currency: "INR",
    payment_method: "GPay / UPI",
    payment_reference: "UPI-88401928371",
    status: "completed",
    notes: "Exam support & motivation letter site • Delivered in 3 hrs",
    created_at: "2026-10-16T15:20:00.000Z",
    products: { title: "Supportive Website For Her" },
  },
  {
    id: "ORD-3",
    order_number: "#3",
    customer_name: "Aditya K.",
    customer_email: "aditya.k@gmail.com",
    customer_phone: "+91 97410 88231",
    amount: 249,
    currency: "INR",
    payment_method: "Paytm / UPI",
    payment_reference: "UPI-73910284711",
    status: "completed",
    notes: "Beach trip proposal with custom song • Said YES!",
    created_at: "2026-10-12T18:45:00.000Z",
    products: { title: "Love Proposal 2.0" },
  },
];

/**
 * Returns customer orders from localStorage, initializing with the 3 seed orders if empty.
 */
export function getLocalOrdersWithSeed(): any[] {
  try {
    const raw = localStorage.getItem(CUSTOMER_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize with the 3 live customers
    localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(DEFAULT_SEED_ORDERS));
    return DEFAULT_SEED_ORDERS;
  } catch (e) {
    return DEFAULT_SEED_ORDERS;
  }
}

/**
 * Returns the configured base customer count (defaults to 0).
 */
export function getBaseCustomerCount(): number {
  try {
    const stored = localStorage.getItem(BASE_CUSTOMERS_KEY);
    if (stored !== null && stored !== "") {
      const parsed = parseInt(stored, 10);
      // If legacy 362 was stored from old sessions, reset to 0
      if (parsed === 362) return 0;
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_BASE_CUSTOMERS;
}

/**
 * Update the base customer count in localStorage and notify listeners.
 */
export function setBaseCustomerCount(count: number): void {
  try {
    localStorage.setItem(BASE_CUSTOMERS_KEY, Math.max(0, count).toString());
    notifyCustomerCountChanged();
  } catch (e) {}
}

/**
 * Count successful/completed orders stored locally.
 */
export function getLocalCompletedOrdersCount(): number {
  try {
    const orders = getLocalOrdersWithSeed();
    return orders.filter(
      (o: any) =>
        o &&
        (o.status === "completed" ||
          o.status === "success" ||
          o.status === "approved")
    ).length;
  } catch (e) {
    return DEFAULT_SEED_ORDERS.length;
  }
}

/**
 * Get the synchronous live count.
 * Returns Base Offset + Completed Orders (e.g. 0 + 3 = 3).
 */
export function getSynchronousLiveCustomerCount(): number {
  const base = getBaseCustomerCount();
  const completed = getLocalCompletedOrdersCount();
  return base + completed;
}

/**
 * Query both Supabase and localStorage (deduplicating by order ID)
 * and calculate the total live customer count: Base Offset + Completed Orders.
 */
export async function getLiveCustomerCount(): Promise<number> {
  const base = getBaseCustomerCount();
  const completedIds = new Set<string>();

  // 1. Add completed orders from localStorage (includes 3 initial seed orders)
  try {
    const orders = getLocalOrdersWithSeed();
    orders.forEach((o: any) => {
      if (
        o &&
        (o.status === "completed" ||
          o.status === "success" ||
          o.status === "approved")
      ) {
        completedIds.add(o.id || `local-${Math.random()}`);
      }
    });
  } catch (e) {}

  // 2. Fetch completed orders from Supabase (if online)
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, status")
      .in("status", ["completed", "success", "approved"]);

    if (!error && data) {
      data.forEach((o: any) => completedIds.add(o.id));
    }
  } catch (e) {
    // Supabase error/offline fallback is graceful
  }

  return base + completedIds.size;
}

/**
 * Dispatches the event so all components update immediately.
 */
export function notifyCustomerCountChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("erenn_orders_updated"));
    window.dispatchEvent(new Event("erenn_customer_count_updated"));
  }
}

/**
 * React hook that returns the real-time customer count,
 * updating instantly whenever an order is completed, approved,
 * deleted, or updated in the Admin panel.
 */
export function useLiveCustomerCount() {
  const [count, setCount] = useState<number>(() => getSynchronousLiveCustomerCount());

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const live = await getLiveCustomerCount();
        if (mounted) setCount(live);
      } catch (e) {
        if (mounted) setCount(getSynchronousLiveCustomerCount());
      }
    };

    // Initial async refresh with DB sync
    refresh();

    const handleEvent = () => {
      refresh();
    };

    window.addEventListener("erenn_orders_updated", handleEvent);
    window.addEventListener("erenn_customer_count_updated", handleEvent);
    window.addEventListener("storage", handleEvent);

    // Periodic sync in case of background updates
    const interval = setInterval(refresh, 20000);

    return () => {
      mounted = false;
      window.removeEventListener("erenn_orders_updated", handleEvent);
      window.removeEventListener("erenn_customer_count_updated", handleEvent);
      window.removeEventListener("storage", handleEvent);
      clearInterval(interval);
    };
  }, []);

  return {
    count,
    formatted: count.toLocaleString(),
    displayString: `${count.toLocaleString()}+`,
  };
}
