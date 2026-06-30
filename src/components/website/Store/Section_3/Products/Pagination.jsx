const Pagination = () => {
    return (
        <div className="flex justify-center gap-2 text-sm">
            <button className="px-3 py-1 border rounded bg-green-500 text-white">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">Next</button>
        </div>
    );
};

export default Pagination;
