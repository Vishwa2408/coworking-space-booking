import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    CalendarCheck,
    Clock3,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getSpaces } from "../../api/space.api";
import { getAllBookings } from "../../api/adminBooking.api";
import { getAccessToken } from "../../utils/storage";
import { BOOKING_STATUS } from "../../utils/constants";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const Dashboard = () => {
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [spacesResponse, bookingsResponse] = await Promise.all([
                getSpaces({ page: 1, limit: 100 }),
                getAllBookings({ page: 1, limit: 100 }),
            ]);

            setSpaces(spacesResponse.data?.data || []);
            setBookings(bookingsResponse.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const stats = useMemo(() => {
        return {
            totalSpaces: spaces.length,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(
                (booking) => booking.status === BOOKING_STATUS.PENDING
            ).length,
            approvedBookings: bookings.filter(
                (booking) => booking.status === BOOKING_STATUS.APPROVED
            ).length,
        };
    }, [spaces, bookings]);

    const recentBookings = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    Administration
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage your coworking spaces, bookings and availability.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Spaces"
                    value={stats.totalSpaces}
                    icon={Building2}
                    description="Active coworking spaces"
                />

                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={CalendarCheck}
                    description="All booking requests"
                />

                <StatCard
                    title="Pending"
                    value={stats.pendingBookings}
                    icon={Clock3}
                    description="Awaiting approval"
                />

                <StatCard
                    title="Approved"
                    value={stats.approvedBookings}
                    icon={CheckCircle2}
                    description="Approved bookings"
                />
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Recent Bookings
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest booking activity
                        </p>
                    </div>

                    <Link
                        to="/admin/bookings"
                        className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        View all
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="p-6">
                    {recentBookings.length === 0 ? (
                        <EmptyState
                            title="No bookings yet"
                            description="Booking requests will appear here."
                        />
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <BookingRow
                                    key={booking._id}
                                    booking={booking}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
};

const BookingRow = ({ booking }) => {
    const statusClasses = {
        pending: "bg-amber-50 text-amber-700",
        approved: "bg-emerald-50 text-emerald-700",
        rejected: "bg-red-50 text-red-700",
        cancelled: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                    {booking.space?.name || "Space"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {booking.member?.name || "Member"}
                    {" • "}
                    {new Date(booking.startTime).toLocaleString("en-IN")}
                </p>
            </div>

            <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[booking.status] ||
                    "bg-slate-100 text-slate-600"
                    }`}
            >
                {booking.status}
            </span>
        </div>
    );
};

export default Dashboard;