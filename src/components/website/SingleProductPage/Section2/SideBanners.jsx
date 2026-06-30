const SideBanners = () => {
    return (
        <div className="space-y-4">

            {/* TOP BANNER */}
            <div className="bg-[#3b3b3b] rounded-xl p-4 relative text-white overflow-hidden">
                <span className="absolute top-3 right-3 bg-green-400 text-black text-xs px-2 py-1 rounded">
                    50%
                </span>

                <h4 className="text-2xl font-bold opacity-30 leading-none">
                    SALE<br />OFF
                </h4>

                <img
                    src="/controller.png"
                    className="absolute bottom-0 right-0 h-24"
                    alt="Controller"
                />
            </div>

            {/* BOTTOM BANNER */}
            <div className="bg-[#1f3d2b] rounded-xl p-4 text-white relative overflow-hidden">
                <p className="text-sm">oPad Pro</p>
                <p className="text-lg font-semibold">Mini 5</p>
                <p className="text-xs mt-2">
                    From <span className="text-green-400 text-lg">$169</span>
                </p>

                <img
                    src="/tablet.png"
                    className="absolute bottom-2 right-2 h-20"
                    alt="Tablet"
                />
            </div>

        </div>
    );
};

export default SideBanners;
