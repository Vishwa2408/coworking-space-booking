import { useEffect, useState } from "react";
import { CalendarCheck, RefreshCw } from "lucide-react";

import {
    approveBooking,
    getAllBookings,
    rejectBooking,
} from "../../api/adminBooking.api";

import { getSpaces } from "../../api/space.api";
import { getAccessToken } from "../../utils/storage";

import BookingApprovalCard from "../../components/admin/BookingApprovalCard";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [spaces, setSpaces] = useState([]);

    const [status, setStatus] = useState("");
    const [space, setSpace] = useState("");
    const [date, setDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page: 1,
                limit: 100,
            };

            if (status) {
                params.status = status;
            }

            if (space) {
                params.space = space;
            }

            if (date) {
                params.date = date;
            }

            const response = await getAllBookings(params)

            setBookings(response.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchSpaces = async () => {
        try {
            const response = await getSpaces({
                page: 1,
                limit: 100,
            });

            setSpaces(response.data?.data || []);
        } catch {
            // Booking list can still work if the space filter fails.
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [status, space, date]);

    const handleApprove = async (booking) => {
        const confirmed = window.confirm(
            `Approve the booking for ${booking.space?.name || "this space"}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            await approveBooking(booking._id)

            await fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to approve booking."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (booking) => {
        const confirmed = window.confirm(
            `Reject the booking for ${booking.space?.name || "this space"}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            await rejectBooking(booking._id)

            await fetchBookings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reject booking."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const resetFilters = () => {
        setStatus("");
        setSpace("");
        setDate("");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Bookings
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Review and manage member booking requests.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchBookings}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <CalendarCheck
                        size={18}
                        className="text-indigo-600"
                    />

                    <h2 className="font-semibold text-slate-900">
                        Filters
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Space
                        </label>

                        <select
                            value={space}
                            onChange={(event) =>
                                setSpace(event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">All spaces</option>

                            {spaces.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Clear filters
                </button>
            </div>

            {/* Bookings */}
            {loading ? (
                <Loading />
            ) : bookings.length === 0 ? (
                <EmptyState
                    title="No bookings found"
                    description="There are no bookings matching the selected filters."
                />
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <BookingApprovalCard
                            key={booking._id}
                            booking={booking}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            actionLoading={actionLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;