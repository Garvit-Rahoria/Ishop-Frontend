const Tabs = () => {
    return (
        <div className="border-b mb-6">
            <div className="flex gap-8 text-sm font-medium">
                <button className="pb-3 border-b-2 border-black text-black">
                    DESCRIPTION
                </button>
                <button className="pb-3 text-gray-500 hover:text-black">
                    REVIEWS (5)
                </button>
                <button className="pb-3 text-gray-500 hover:text-black">
                    ADDITIONAL INFORMATION
                </button>
            </div>
        </div>
    );
};

export default Tabs;
