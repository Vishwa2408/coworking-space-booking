import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { getSpaces } from "../../api/space.api";
import SpaceCard from "../../components/spaces/SpaceCard";
import SpaceFilters from "../../components/spaces/SpaceFilters";
import Pagination from "../../components/common/Pagination";

const Spaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        type: "",
        capacity: "",
        date: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const fetchSpaces = async (showLoading = false) => {
        try {
            if (showLoading) {
                setIsLoading(true);
            }
            setError("");

            const params = {
                page,
                limit: 6,
            };

            if (filters.search) {
                params.search = filters.search;
            }

            if (filters.type) {
                params.type = filters.type;
            }

            if (filters.capacity) {
                params.capacity = filters.capacity;
            }

            if (filters.date) {
                params.date = filters.date;
            }

            const response = await getSpaces(params);

            setSpaces(response.data.data || []);
            setPagination(response.data.pagination || null);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load spaces."
            );
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSpaces(page === 1 && !filters.search && !filters.type && !filters.capacity && !filters.date);
    }, [page, filters]);

    const handleFilterChange = (name, value) => {
        setPage(1);

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setPage(1);

        setFilters({
            search: "",
            type: "",
            capacity: "",
            date: "",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Building2 size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Browse Spaces
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Find a desk or meeting room that fits your needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <SpaceFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleReset}
                />

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <p className="text-sm text-slate-500">
                            Loading available spaces...
                        </p>
                    </div>
                ) : spaces.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No spaces found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results */}
                        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {spaces.map((space) => (
                                <SpaceCard key={space._id} space={space} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-10">
                            <Pagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Spaces;