const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    const { page, totalPages } = pagination;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Previous
            </button>

            <span className="px-3 text-sm text-slate-500">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;