'use client'
import { useRouter, useSearchParams } from "next/navigation";

const ProductsToolbar = ({ total = 0, page = 1, limit = 24, q = null }) => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "latest";
    const currentLimit = Number(searchParams.get("limit")) || limit || 24;

    function updateQuery(mutator) {
        const query = new URLSearchParams(searchParams.toString());
        mutator(query);
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh()
    }

    function filterHandler(e) {
        const value = e.target.value;
        updateQuery((query) => {
            if (value === "latest") query.delete("sort")
            else query.set("sort", value)
            query.delete("page")
        })
    }

    function limitHandler(e) {
        const value = e.target.value;
        updateQuery((query) => {
            query.set("limit", value)
            query.delete("page")
        })
    }

    const start = total === 0 ? 0 : (page - 1) * currentLimit + 1
    const end = Math.min(page * currentLimit, total)

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
            <p className="font-medium text-gray-700">
                {total === 0 ? (
                    <>No results{q ? <> for <span className="text-black font-semibold">“{q}”</span></> : null}</>
                ) : (
                    <>
                        Showing{" "}
                        <span className="text-black font-semibold">{start}–{end}</span> of{" "}
                        <span className="text-black font-semibold">{total}</span> results
                    </>
                )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">Show:</span>
                    <select
                        value={String(currentLimit)}
                        onChange={limitHandler}
                        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                        <option value="72">72</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500">Sort by:</span>
                    <select
                        value={sort}
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
