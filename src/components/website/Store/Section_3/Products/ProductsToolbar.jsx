'use client'
import { useRouter, useSearchParams } from "next/navigation";
const ProductsToolbar = () => {

    const router = useRouter()
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "latest";
    // console.log(select_brand)

    function filterHandler(e) {
        const value = e.target.value;
        // console.log(value)


        const query = new URLSearchParams(searchParams.toString());
        if (value == "latest") {
            query.delete("sort")
        } else {
            query.set("sort", value)
        }
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh()
    }


    return (
        // <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
        //     <p>1–40 of 120 results</p>

        //     <div className="flex gap-4">
        //         <select className="border rounded px-2 py-1">
        //             <option>24</option>
        //             <option>48</option>
        //             <option>72</option>
        //         </select>

        //         <select
        //             onChange={filterHandler}
        //             className="border rounded px-2 py-1"
        //             >
        //             <option value="latest">Latest</option>
        //             <option value="asc">Price Low → High</option>
        //             <option value="desc">Price High → Low</option>
        //         </select>
        //     </div>
        // </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-7 text-sm text-gray-600">

            {/* LEFT SIDE */}
            <p className="font-medium text-gray-700">
                Showing <span className="text-black font-semibold">1–40</span> of{" "}
                <span className="text-black font-semibold">120</span> results
            </p>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

                {/* ITEMS PER PAGE */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">Show:</span>
                    <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition">
                        <option>24</option>
                        <option>48</option>
                        <option>72</option>
                    </select>
                </div>

                {/* SORT */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">Sort by:</span>
                    <select
                        onChange={filterHandler}
                        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    >
                        <option value="latest">Latest</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default ProductsToolbar;
