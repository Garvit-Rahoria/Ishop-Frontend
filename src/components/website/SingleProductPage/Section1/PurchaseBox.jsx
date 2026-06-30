const PurchaseBox = () => {
    return (
        <div className="bg-[#f3f4f8] rounded-xl p-5 space-y-4 text-sm">

            <div>
                <p className="text-xs text-gray-500">TOTAL PRICE:</p>
                <p className="text-2xl font-bold">$609.00</p>
            </div>

            <p className="text-xs">
                affirm <span className="text-red-500">$49/mo</span> in 12 months
                <span className="text-blue-500 ml-1 cursor-pointer">See more</span>
            </p>

            <p className="flex items-center gap-2 text-green-600">
                ● In stock
            </p>

            <div className="flex justify-between items-center border rounded-lg px-4 py-2">
                <button>-</button>
                <span>1</span>
                <button>+</button>
            </div>

            <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium">
                ADD TO CART
            </button>

            <button className="w-full bg-yellow-400 py-3 rounded-lg font-medium">
                BUY WITH PAYPAL
            </button>

            <div className="flex justify-between text-xs text-gray-600">
                <span>💚 Wishlist added</span>
                <span>⇄ Compare</span>
            </div>

            <hr />

            <div className="text-xs text-gray-500">
                Guaranteed Safe Checkout
            </div>

            <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Quick Order 24/7</p>
                <p className="text-lg font-bold">(025) 3886 25 16</p>
            </div>

            <p className="text-xs flex items-center gap-1">
                🚚 Ships from <b>United States</b>
            </p>

        </div>
    );
};

export default PurchaseBox;
