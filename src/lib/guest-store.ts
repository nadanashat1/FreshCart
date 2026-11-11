// Guest cart/wishlist stored in localStorage, mirroring the instructor demo's
// "guestCart" / "guestWishlist" keys and item shapes. Items merge into the
// signed-in account on login (see components/guest/guest-merge.tsx).

export type GuestCartProduct = {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  category?: { name: string };
};

export type GuestCartItem = {
  productId: string;
  count: number;
  price: number;
  product: GuestCartProduct;
};

export type GuestWishlistProduct = {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  category?: { name: string };
  brand?: { name: string };
};

export type GuestWishlistItem = {
  productId: string;
  product: GuestWishlistProduct;
  addedAt: number;
};

export type GuestProductInput = {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  category?: { name: string };
  brand?: { name: string };
};

const CART_KEY = "guestCart";
const WISHLIST_KEY = "guestWishlist";
export const GUEST_STORE_EVENT = "guest-store-changed";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // storage full/blocked: keep the in-page event so UI stays consistent
  }
  window.dispatchEvent(new Event(GUEST_STORE_EVENT));
}

export function getGuestCart(): GuestCartItem[] {
  return read<GuestCartItem>(CART_KEY);
}

export function getGuestWishlist(): GuestWishlistItem[] {
  return read<GuestWishlistItem>(WISHLIST_KEY);
}

export function guestCartAdd(product: GuestProductInput, count = 1) {
  const items = getGuestCart();
  const idx = items.findIndex((i) => i.productId === product._id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], count: items[idx].count + count };
  } else {
    items.push({
      productId: product._id,
      count,
      price: product.priceAfterDiscount || product.price,
      product: {
        _id: product._id,
        id: product.id,
        title: product.title,
        imageCover: product.imageCover,
        category: product.category ? { name: product.category.name } : undefined,
      },
    });
  }
  write(CART_KEY, items);
}

export function guestCartUpdate(productId: string, count: number) {
  const items = getGuestCart();
  const item = items.find((i) => i.productId === productId);
  if (item) {
    item.count = Math.max(1, count);
    write(CART_KEY, items);
  }
}

export function guestCartRemove(productId: string) {
  write(
    CART_KEY,
    getGuestCart().filter((i) => i.productId !== productId)
  );
}

export function guestCartClear() {
  write(CART_KEY, []);
}

export function guestWishlistHas(productId: string): boolean {
  return getGuestWishlist().some((i) => i.productId === productId);
}

export function guestWishlistToggle(product: GuestProductInput) {
  const items = getGuestWishlist();
  const idx = items.findIndex((i) => i.productId === product._id);
  if (idx >= 0) {
    items.splice(idx, 1);
  } else {
    items.push({
      productId: product._id,
      product: {
        _id: product._id,
        id: product.id,
        title: product.title,
        imageCover: product.imageCover,
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount,
        ratingsAverage: product.ratingsAverage,
        category: product.category ? { name: product.category.name } : undefined,
        brand: product.brand ? { name: product.brand.name } : undefined,
      },
      addedAt: Date.now(),
    });
  }
  write(WISHLIST_KEY, items);
}

export function guestWishlistRemove(productId: string) {
  write(
    WISHLIST_KEY,
    getGuestWishlist().filter((i) => i.productId !== productId)
  );
}

export function guestWishlistClear() {
  write(WISHLIST_KEY, []);
}
