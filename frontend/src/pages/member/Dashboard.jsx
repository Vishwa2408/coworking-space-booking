import { useEffect, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../api/booking.api";
import { getAccessToken } from "../../utils/storage";
import { BOOKING_STATUS } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError("");


            const response = await getMyBookings({});

            setBookings(response.data.data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === BOOKING_STATUS.PENDING
    ).length;

    const approvedBookings = bookings.filter(
        (booking) => booking.status === BOOKING_STATUS.APPROVED
    ).length;

    const upcomingBookings = bookings.filter((booking) => {
        const isUpcoming =
            new Date(booking.startTime) > new Date();

        return (
            isUpcoming &&
            [
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.APPROVED,
            ].includes(booking.status)
        );
    }).length;

    const recentBookings = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 4);

    const stats = [
        {
            label: "Total bookings",
            value: totalBookings,
            icon: CalendarDays,
            iconClass: "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Pending",
            value: pendingBookings,
            icon: Clock3,
            iconClass: "bg-amber-50 text-amber-600",
        },
        {
            label: "Approved",
            value: approvedBookings,
            icon: CheckCircle2,
            iconClass: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Upcoming",
            value: upcomingBookings,
            icon: CalendarDays,
            iconClass: "bg-violet-50 text-violet-600",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading your dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Member Dashboard
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Welcome back!
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Here's an overview of your workspace
                            activity.
                        </p>
                    </div>

                    <Link
                        to="/spaces"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Book a space
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {stat.label}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                                    >
                                        <Icon size={21} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent bookings */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent bookings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest workspace reservations.
                            </p>
                        </div>

                        <Link
                            to="/member/bookings"
                            className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
                        >
                            View all
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <CalendarDays
                                size={32}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-3 font-semibold text-slate-900">
                                No bookings yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Start by finding a workspace that
                                suits you.
                            </p>

                            <Link
                                to="/spaces"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Browse spaces
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-slate-100">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {booking.space?.name ||
                                                    "Space"}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {formatDateTime(
                                                    booking.startTime
                                                )}{" "}
                                                —{" "}
                                                {formatDateTime(
                                                    booking.endTime
                                                )}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${booking.status ===
                                                BOOKING_STATUS.APPROVED
                                                ? "bg-emerald-50 text-emerald-700"
                                                : booking.status ===
                                                    BOOKING_STATUS.PENDING
                                                    ? "bg-amber-50 text-amber-700"
                                                    : booking.status ===
                                                        BOOKING_STATUS.REJECTED
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 px-5 py-4 sm:hidden">
                                <Link
                                    to="/member/bookings"
                                    className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600"
                                >
                                    View all bookings
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;