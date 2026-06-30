'use client'
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

const CartPage = () => {

    const cart = useSelector((store) => store.cart);

    return (
        <>

            <section className=" bg-white py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


                        {/* Cart Items */}
                        <div className="lg:col-span-8 space-y-6">

                            {cart?.items?.length === 0 ? (
                                <p>Your cart is empty 🛒</p>
                            ) : (
                                cart.items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))
                            )}

                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4">
                            <OrderSummary />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default CartPage;