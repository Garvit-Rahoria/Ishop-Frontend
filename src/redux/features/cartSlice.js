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

            localStorage.setItem("cart", JSON.stringify(state))
        },
        emptyCart: (state) => {
            state.final_total = 0;
            state.original_total = 0
            state.items = []
            localStorage.removeItem("cart")
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

            localStorage.setItem("cart", JSON.stringify(state))
        },
        lsToCart: (state) => {
            const cart = JSON.parse(localStorage.getItem("cart"))
            if (cart) {
                state.items = cart.items;
                state.final_total = Number(cart.final_total);
                state.original_total = Number(cart.original_total);

            }
        }

    },
})

// Action creators are generated for each case reducer function
export const { addToCart, emptyCart, qtyChange, lsToCart } = cartSlice.actions

export default cartSlice.reducer