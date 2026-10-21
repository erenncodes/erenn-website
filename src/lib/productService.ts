import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRODUCTS, Product } from "@/data/defaultProducts";

const CUSTOM_PRODUCTS_STORAGE_KEY = "erenn_custom_products";
const PRODUCT_OVERRIDES_STORAGE_KEY = "erenn_product_overrides";
const DELETED_PRODUCTS_STORAGE_KEY = "erenn_deleted_product_ids";

export type { Product };

/**
 * Get locally stored custom products created via Admin
 */
export const getLocalCustomProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Get locally stored product overrides (edits)
 */
export const getLocalProductOverrides = (): Record<string, Partial<Product>> => {
  try {
    const raw = localStorage.getItem(PRODUCT_OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Get locally deleted product IDs
 */
export const getDeletedProductIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

/**
 * Fetch unified list of products across Supabase, Default Master Catalog, and Local Admin storage
 */
export const fetchUnifiedProducts = async (includeInactive = false): Promise<Product[]> => {
  let dbProducts: Product[] = [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && Array.isArray(data)) {
      dbProducts = data as Product[];
    }
  } catch (err) {
    console.warn("Supabase products fetch failed, using fallback catalog:", err);
  }

  const customProducts = getLocalCustomProducts();
  const overrides = getLocalProductOverrides();
  const deletedIds = getDeletedProductIds();

  // Create unified dictionary keyed by id
  const productMap = new Map<string, Product>();

  // 1. Seed with Default Master Catalog
  DEFAULT_PRODUCTS.forEach((p) => {
    productMap.set(p.id, { ...p });
  });

  // 2. Overlay Supabase Products (match by ID or lowercase title)
  dbProducts.forEach((dbP) => {
    // Check if matching default product exists by title if ID is different
    let targetId = dbP.id;
    for (const [id, defP] of productMap.entries()) {
      if (defP.title.trim().toLowerCase() === dbP.title.trim().toLowerCase()) {
        targetId = id;
        break;
      }
    }

    const existing = productMap.get(targetId) || {} as Product;
    productMap.set(targetId, {
      ...existing,
      ...dbP,
      id: targetId, // preserve canonical ID
      // Preserve rich country_prices & youtube_url if DB has empty
      youtube_url: dbP.youtube_url || existing.youtube_url,
      country_prices: (dbP.country_prices && Object.keys(dbP.country_prices).length > 0)
        ? dbP.country_prices
        : (existing.country_prices || {}),
    });
  });

  // 3. Overlay Local Admin Overrides
  Object.entries(overrides).forEach(([id, overrideData]) => {
    if (productMap.has(id)) {
      productMap.set(id, {
        ...productMap.get(id)!,
        ...overrideData,
      });
    }
  });

  // 4. Append Custom Admin Created Products
  customProducts.forEach((cp) => {
    productMap.set(cp.id, cp);
  });

  // 5. Filter out deleted or inactive
  let result = Array.from(productMap.values());

  if (!includeInactive) {
    result = result.filter((p) => p.is_active !== false && !deletedIds.has(p.id));
  } else {
    result = result.filter((p) => !deletedIds.has(p.id));
  }

  // Sort: newest first
  result.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  return result;
};

/**
 * Fetch a single product by ID
 */
export const fetchUnifiedProductById = async (id: string): Promise<Product | null> => {
  const all = await fetchUnifiedProducts(true);
  return all.find((p) => p.id === id) || null;
};

/**
 * Save product (handles Supabase DB + local dual storage fallback)
 */
export const saveUnifiedProduct = async (
  payload: Record<string, any>,
  existingId?: string | null
): Promise<{ success: boolean; product: Product; error?: string }> => {
  const productId = existingId || payload.id || crypto.randomUUID();
  const now = new Date().toISOString();

  const completeProduct: Product = {
    id: productId,
    title: payload.title || "Untitled Template",
    description: payload.description || "",
    price: typeof payload.price === "number" ? payload.price : parseFloat(payload.price) || 0,
    currency: payload.currency || "INR",
    category: payload.category || "General",
    image_url: payload.image_url || "/images/default-thumbnail.png",
    demo_url: payload.demo_url || "",
    youtube_url: payload.youtube_url || null,
    country_prices: payload.country_prices || {},
    is_active: payload.is_active !== false,
    created_at: payload.created_at || now,
    updated_at: now,
  };

  // 1. Try to save to Supabase
  try {
    if (existingId) {
      const { error } = await supabase
        .from("products")
        .update(completeProduct)
        .eq("id", existingId);

      if (error && (error.code === "42703" || error.message?.includes("country_prices") || error.message?.includes("youtube_url"))) {
        const { country_prices, youtube_url, ...fallbackPayload } = completeProduct;
        await supabase.from("products").update(fallbackPayload).eq("id", existingId);
      }
    } else {
      const { error } = await supabase.from("products").insert(completeProduct);
      if (error && (error.code === "42703" || error.message?.includes("country_prices") || error.message?.includes("youtube_url"))) {
        const { country_prices, youtube_url, ...fallbackPayload } = completeProduct;
        await supabase.from("products").insert(fallbackPayload);
      }
    }
  } catch (err) {
    console.warn("Supabase save encountered an issue, saving locally:", err);
  }

  // 2. Dual-save to localStorage
  try {
    if (existingId) {
      const overrides = getLocalProductOverrides();
      overrides[existingId] = completeProduct;
      localStorage.setItem(PRODUCT_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));

      // Also update in custom products if it was a custom one
      const customs = getLocalCustomProducts();
      const customIdx = customs.findIndex((c) => c.id === existingId);
      if (customIdx >= 0) {
        customs[customIdx] = completeProduct;
        localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customs));
      }
    } else {
      const customs = getLocalCustomProducts();
      customs.unshift(completeProduct);
      localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customs));
    }

    // Remove from deleted list if re-added
    const deleted = getDeletedProductIds();
    if (deleted.has(productId)) {
      deleted.delete(productId);
      localStorage.setItem(DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
    }
  } catch (e) {
    console.error("Failed to save product locally:", e);
  }

  // Notify components
  window.dispatchEvent(new CustomEvent("erenn_products_updated", { detail: completeProduct }));

  return { success: true, product: completeProduct };
};

/**
 * Delete product (handles Supabase DB + local dual storage fallback)
 */
export const deleteUnifiedProduct = async (id: string): Promise<boolean> => {
  // 1. Try Supabase delete
  try {
    await supabase.from("products").delete().eq("id", id);
  } catch (e) {}

  // 2. Update local state
  try {
    const deleted = getDeletedProductIds();
    deleted.add(id);
    localStorage.setItem(DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(deleted)));

    // Clean up from customs & overrides
    const customs = getLocalCustomProducts().filter((c) => c.id !== id);
    localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customs));

    const overrides = getLocalProductOverrides();
    delete overrides[id];
    localStorage.setItem(PRODUCT_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {}

  // Notify components
  window.dispatchEvent(new CustomEvent("erenn_products_updated", { detail: { id, deleted: true } }));

  return true;
};
