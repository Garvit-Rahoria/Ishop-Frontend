import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {
            const existingItem = state.items.find((item) => item.id == payload.id)
            if (existingItem) {
                existingItem.qty++
            } else {
                state.items.push(payload);
            }
            state.original_total += Number(payload.orginal_price);
            state.final_total += Number(payload.final_price);

            if (typeof window !== "undefined") {
                localStorage.setItem("cart", JSON.stringify(state))
            }
        },
        emptyCart: (state) => {
            state.final_total = 0;
            state.original_total = 0
            state.items = []
            if (typeof window !== "undefined") {
                localStorage.removeItem("cart")
            }
        },
        removeItem: (state, { payload }) => {
            const item = state.items.find((entry) =>
                (entry.id ?? entry._id) == payload.id
            )
            if (!item) return

            const qty = Number(item.qty || 1)
            state.original_total -= Number(item.orginal_price || 0) * qty
            state.final_total -= Number(item.final_price || 0) * qty
            state.items = state.items.filter((entry) =>
                (entry.id ?? entry._id) != payload.id
            )

            if (typeof window !== "undefined") {
                localStorage.setItem("cart", JSON.stringify(state))
            }
        },
        qtyChange: (state, { payload }) => {
            const cartItem = state.items.find((item) => item.id == payload.id)
            if (!cartItem) return

            if (payload.flag == "inc") {
                cartItem.qty++;

                state.original_total += Number(cartItem.orginal_price);
                state.final_total += Number(cartItem.final_price);

            } else {

                if (cartItem.qty > 1) {
                    cartItem.qty--;

                    state.original_total -= Number(cartItem.orginal_price);
                    state.final_total -= Number(cartItem.final_price);

                } else {
                    // remove item completely
                    state.original_total -= Number(cartItem.orginal_price);
                    state.final_total -= Number(cartItem.final_price);

                    state.items = state.items.filter((item) => item.id !== payload.id)
                }
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("cart", JSON.stringify(state))
            }
        },
        lsToCart: (state) => {
            if (typeof window === "undefined") return;
            let cart;
            try {
                cart = JSON.parse(localStorage.getItem("cart"));
            } catch (_) {
                cart = null;
            }

            const items = Array.isArray(cart?.items) ? cart.items : [];
            state.items = items;
            // Always derive totals from actual items; saved totals can be stale.
            state.original_total = items.reduce(
                (sum, item) => sum + Number(item.orginal_price || 0) * Number(item.qty || 1),
                0
            );
            state.final_total = items.reduce(
                (sum, item) => sum + Number(item.final_price || 0) * Number(item.qty || 1),
                0
            );
            localStorage.setItem("cart", JSON.stringify(state));
        }

    },
})

// Action creators are generated for each case reducer function
export const { addToCart, emptyCart, removeItem, qtyChange, lsToCart } = cartSlice.actions

export default cartSlice.reducer
