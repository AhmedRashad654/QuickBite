import type { MenuProduct } from "@/features/menu/types";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  branch_id: number | null;
  branch_name: string;
  currency: string;
  delivery_fee: number;

  setBranchInfo: (
    branch_id: number,
    branch_name: string,
    currency: string,
    delivery_fee: number,
  ) => void;
  addItem: (item: Omit<CartItem, "quantity">, product: MenuProduct) => void;
  removeItem: (product_id: number) => void;
  incrementQuantity: (product_id: number, product: MenuProduct | null) => void;
  decrementQuantity: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  getTotalItem: () => number;
  getSubTotal: () => number;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      branch_id: null,
      branch_name: "",
      currency: "",
      delivery_fee: 0,

      setBranchInfo: (branch_id, branch_name, currency, delivery_fee) =>
        set((state) => {
          if (state.branch_id && state.branch_id !== branch_id) {
            return {
              items: [],
              branch_id,
              branch_name,
              currency,
              delivery_fee,
            };
          }
          return { branch_id, branch_name, currency, delivery_fee };
        }),

      addItem: (item, product: MenuProduct) =>
        set((state) => {
          if (!product?.is_available) {
            toast.warning("product unavaliable currently");
            return { items: state.items };
          }
          const existing = state.items.find(
            (i) => i.product_id === item.product_id,
          );

          if (existing) {
            if (existing.quantity >= product.stock) {
              toast.warning("There are not enough quantities in the stock");
              return { items: state.items };
            }

            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }

          if (product.stock > 0) {
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }
          toast.warning("There are not enough quantities in the stock");
          return { items: state.items };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      incrementQuantity: (product_id: number, product: MenuProduct | null) =>
        set((state) => {
          if (!product?.is_available || !product) {
            toast.warning("product unavaliable currently");
            return { items: state.items };
          }
          const existing = state.items.find((i) => i.product_id === product_id);
          if (existing && existing.quantity >= product.stock) {
            toast.warning("There are not enough quantities in the stock");
            return { items: state.items };
          }

          return {
            items: state.items.map((i) =>
              i.product_id === product_id
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          };
        }),
      decrementQuantity: (product_id) =>
        set((state) => {
          const item = state.items.find((i) => i.product_id === product_id);
          if (!item) return state;
          if (item.quantity <= 1) {
            return {
              items: state.items.filter((i) => i.product_id !== product_id),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product_id === product_id
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            ),
          };
        }),

      updateQuantity: (product_id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product_id !== product_id),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product_id === product_id ? { ...i, quantity } : i,
            ),
          };
        }),

      getTotalItem: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubTotal: () => {
        const totalInMinorUnit = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        return totalInMinorUnit / 100;
      },

      clearCart: () =>
        set({
          items: [],
          branch_id: null,
          branch_name: "",
          currency: "",
          delivery_fee: 0,
        }),
    }),
    {
      name: "quickbite-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
