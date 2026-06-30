const ImageGallery = () => {
    const images = [
        "/phone-main.png",
        "/phone-1.png",
        "/phone-2.png",
        "/phone-3.png",
    ];

    return (
        <div className="space-y-4">

            <div className="relative bg-[#f3f4f8] rounded-xl p-6">
                <span className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded">
                    NEW
                </span>

                <img
                    src={images[0]}
                    alt="Product"
                    className="mx-auto h-105 object-contain"
                />
            </div>

            <div className="flex gap-3 justify-center">
                {images.slice(1).map((img, i) => (
                    <div
                        key={i}
                        className="w-16 h-16 border rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500"
                    >
                        <img src={img} className="h-12 object-contain" />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ImageGallery;
