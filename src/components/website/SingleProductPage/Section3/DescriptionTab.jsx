const DescriptionTab = () => {
    return (
        <div className="space-y-10 text-sm text-gray-700 leading-relaxed">

            {/* INTRO TEXT */}
            <p>
                Built for ultra-fast performance, the thin and lightweight Samsung Galaxy
                Tab S2 goes anywhere you go. Photos, movies and documents pop on a crisp,
                clear Super AMOLED display. Expandable memory lets you enjoy more of your
                favorite content. And connecting and sharing between all your Samsung
                devices is easier than ever. Welcome to life with the reimagined Samsung
                Galaxy Tab S2. Watch the world come to life on your tablet&apos;s{" "}
                <strong>Super AMOLED display</strong>. With deep contrast, rich colors and
                crisp details, you won&apos;t miss a thing.
            </p>

            {/* FULL WIDTH IMAGE */}
            <div>
                <img
                    src="/desc-main.jpg"
                    alt="Product usage"
                    className="w-full rounded-xl object-cover"
                />
                <p className="text-xs text-gray-400 mt-2">
                    * The Galaxy Tab S2&apos;s 4:3 ratio display provides you with an ideal
                    environment for performing office tasks.
                </p>
            </div>

            {/* FROM MANUFACTURER */}
            <div>
                <h3 className="font-semibold text-black mb-2">
                    From the manufacturer
                </h3>
                <p>
                    Dive into the blockbuster movies you can&apos;t wait to see. Switch
                    between your favorite apps quickly and easily. The new and improved
                    octa-core processor gives you the power and speed you need to see more
                    and do more. Expand your tablet&apos;s memory from 32GB to up to an
                    additional 128GB and enjoy more of your favorite music, photos, movies
                    and games on the go with a microSD card.
                </p>
                <p className="mt-3">
                    With Quick Connect, start a show on your Smart TV and, with the touch of
                    a button, take it with you by moving it to your Galaxy Tab S2. Or send
                    videos and photos from your tablet <span className="text-blue-600 cursor-pointer">screen to your TV</span>{" "}
                    screen to share with everyone in the room. Work effortlessly between
                    your Samsung tablet and Samsung smartphone with SideSync. Quickly drag
                    and drop photos between devices. And even respond to a call from your
                    smartphone right on your tablet screen.
                </p>
            </div>

            {/* IMAGE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                    src="/desc-1.jpg"
                    alt="Lifestyle"
                    className="rounded-xl object-cover"
                />
                <img
                    src="/desc-2.jpg"
                    alt="Apps"
                    className="rounded-xl object-cover"
                />
            </div>

            {/* FINAL BLOCK */}
            <div>
                <h3 className="font-semibold text-black mb-2">
                    Somseng Galaxy Tab S2, 8-Inch, White
                </h3>
                <p>
                    The Samsung Galaxy Tab S2 offers dual cameras: a rear-facing 8-megapixel
                    camera with Auto Focus and a 2.1-megapixel camera on the front. Take
                    high-quality pictures and video or video chat with friends, family and
                    colleagues. Customize your Galaxy Tab S2 with the apps you use most.
                </p>

                <button className="text-blue-600 text-xs mt-3 hover:underline">
                    SHOW MORE
                </button>
            </div>

        </div>
    );
};

export default DescriptionTab;
