import { create } from 'zustand';
import { cartApi } from '../api/endpoints.js';

/**
 * Cart store. When authenticated, it mirrors the server cart.
 * When anonymous, it keeps a local cart in localStorage and merges on login.
 */

const GUEST_KEY = 'ah_guest_cart';

function loadGuest() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || 'null') || { items: [] };
  } catch {
    return { items: [] };
  }
}
function saveGuest(cart) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
}

export const useCart = create((set, get) => ({
  cart: { items: [] },
  loading: false,
  drawerOpen: false,

  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),

  async refresh() {
    const token = localStorage.getItem('ah_token');
    if (!token) {
      set({ cart: loadGuest() });
      return;
    }
    set({ loading: true });
    try {
      const { cart } = await cartApi.get();
      set({ cart, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  async add({ product, variantLabel = null, quantity = 1 }) {
    const token = localStorage.getItem('ah_token');
    if (!token) {
      const cart = loadGuest();
      const existing = cart.items.find(
        (i) => i.product._id === product._id && i.variantLabel === variantLabel
      );
      const price =
        variantLabel && product.variants?.length
          ? product.variants.find((v) => v.label === variantLabel)?.price ?? product.price
          : product.price;
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({
          _id: `${product._id}-${variantLabel || 'default'}`,
          product,
          variantLabel,
          quantity,
          unitPrice: price,
        });
      }
      saveGuest(cart);
      set({ cart: { ...cart }, drawerOpen: true });
      return;
    }
    const { cart } = await cartApi.add({
      productId: product._id,
      variantLabel,
      quantity,
    });
    set({ cart, drawerOpen: true });
  },

  async update(itemId, quantity) {
    const token = localStorage.getItem('ah_token');
    if (!token) {
      const cart = loadGuest();
      const item = cart.items.find((i) => i._id === itemId);
      if (!item) return;
      if (quantity <= 0) cart.items = cart.items.filter((i) => i._id !== itemId);
      else item.quantity = quantity;
      saveGuest(cart);
      set({ cart: { ...cart } });
      return;
    }
    const { cart } = await cartApi.update(itemId, quantity);
    set({ cart });
  },

  async remove(itemId) {
    return get().update(itemId, 0);
  },

  async clear() {
    const token = localStorage.getItem('ah_token');
    if (!token) {
      saveGuest({ items: [] });
      set({ cart: { items: [] } });
      return;
    }
    const { cart } = await cartApi.clear();
    set({ cart });
  },

  async mergeGuestIntoUser() {
    const guest = loadGuest();
    if (!guest.items.length) return get().refresh();
    for (const item of guest.items) {
      try {
        await cartApi.add({
          productId: item.product._id,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
        });
      } catch {
        // skip items that no longer exist
      }
    }
    saveGuest({ items: [] });
    return get().refresh();
  },

  subtotal() {
    return get().cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  },
  count() {
    return get().cart.items.reduce((s, i) => s + i.quantity, 0);
  },
}));
