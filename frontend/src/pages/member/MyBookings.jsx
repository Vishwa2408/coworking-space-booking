import { useEffect, useState } from "react";
import { CalendarDays, Clock, XCircle } from "lucide-react";
import { getMyBookings, cancelBooking } from "../../api/booking.api";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../utils/formatters";
import { BOOKING_STATUS } from "../../utils/constants";

const MyBookings = () => {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await getMyBookings({})
            console.log("My bookings:", response.data.data);

            setBookings(response.data.data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your bookings."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const shouldCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!shouldCancel) {
            return;
        }

        try {

            await cancelBooking(bookingId);

            await fetchBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to cancel the booking."
            );
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case BOOKING_STATUS.APPROVED:
                return "bg-emerald-50 text-emerald-700";

            case BOOKING_STATUS.PENDING:
                return "bg-amber-50 text-amber-700";

            case BOOKING_STATUS.REJECTED:
                return "bg-red-50 text-red-700";

            case BOOKING_STATUS.CANCELLED:
                return "bg-slate-100 text-slate-500";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading your bookings...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    {user?.name}
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    My Bookings
                </h1>

                <p className="mt-2 text-slate-500">
                    View and manage your coworking space bookings.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <CalendarDays className="text-slate-400" size={25} />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-slate-900">
                        No bookings yet
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Your bookings will appear here once you reserve a space.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="font-semibold text-slate-900">
                                            {booking.space?.name || "Coworking Space"}
                                        </h2>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={16} />
                                            <span>
                                                {formatDateTime(booking.startTime)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>
                                                Until {formatDateTime(booking.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {(booking.status === BOOKING_STATUS.PENDING ||
                                    booking.status === BOOKING_STATUS.APPROVED) && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking._id)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <XCircle size={17} />
                                            Cancel
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;