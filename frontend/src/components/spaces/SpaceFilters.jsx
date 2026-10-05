import { RotateCcw, Search } from "lucide-react";
import { SPACE_TYPES } from "../../utils/constants";

const SpaceFilters = ({ filters, onChange, onReset }) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="search"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Search
                    </label>

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            id="search"
                            type="text"
                            value={filters.search}
                            onChange={(event) =>
                                onChange("search", event.target.value)
                            }
                            placeholder="Search spaces..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* Type */}
                <div>
                    <label
                        htmlFor="type"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Space type
                    </label>

                    <select
                        id="type"
                        value={filters.type}
                        onChange={(event) =>
                            onChange("type", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    >
                        <option value="">All types</option>
                        <option value={SPACE_TYPES.DESK}>Desk</option>
                        <option value={SPACE_TYPES.MEETING_ROOM}>
                            Meeting room
                        </option>
                    </select>
                </div>

                {/* Capacity */}
                <div>
                    <label
                        htmlFor="capacity"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Minimum capacity
                    </label>

                    <input
                        id="capacity"
                        type="number"
                        min="1"
                        value={filters.capacity}
                        onChange={(event) =>
                            onChange("capacity", event.target.value)
                        }
                        placeholder="e.g. 4"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                </div>

                {/* Date */}
                <div>
                    <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Availability date
                    </label>

                    <input
                        id="date"
                        type="date"
                        value={filters.date}
                        onChange={(event) =>
                            onChange("date", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                    <RotateCcw size={16} />
                    Reset filters
                </button>
            </div>
        </div>
    );
};

export default SpaceFilters;