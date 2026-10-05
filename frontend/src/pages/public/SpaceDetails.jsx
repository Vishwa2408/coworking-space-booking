import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    Users,
    Wrench,
    XCircle,
} from "lucide-react";
import {
    getSpaceAvailability,
    getSpaceById,
} from "../../api/space.api";
import { formatDateTime } from "../../utils/formatters";
import { BOOKING_STATUS } from "../../utils/constants";
import BookingForm from "../../components/bookings/BookingForm";

const SpaceDetails = () => {
    const { id } = useParams();

    const [space, setSpace] = useState(null);
    const [availability, setAvailability] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isAvailabilityLoading, setIsAvailabilityLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [availabilityError, setAvailabilityError] = useState("");

    const fetchSpace = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await getSpaceById(id);

            setSpace(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load space details."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailability = async () => {
        try {
            setIsAvailabilityLoading(true);
            setAvailabilityError("");

            const response = await getSpaceAvailability(
                id,
                selectedDate
            );

            setAvailability(response.data.data);
        } catch (error) {
            setAvailabilityError(
                error.response?.data?.message ||
                "Unable to load availability."
            );
        } finally {
            setIsAvailabilityLoading(false);
        }
    };

    useEffect(() => {
        fetchSpace();
    }, [id]);

    useEffect(() => {
        fetchAvailability();
    }, [id, selectedDate]);

    const getBookingStatusClasses = (status) => {
        if (status === BOOKING_STATUS.APPROVED) {
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        }

        if (status === BOOKING_STATUS.PENDING) {
            return "border-amber-200 bg-amber-50 text-amber-700";
        }

        return "border-slate-200 bg-slate-50 text-slate-600";
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading space details...
                </p>
            </div>
        );
    }

    if (error || !space) {
        return (
            <div className="mx-auto max-w-4xl py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                    Unable to load space
                </h1>

                <p className="mt-2 text-sm text-red-600">
                    {error || "Space not found."}
                </p>

                <Link
                    to="/spaces"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                    <ArrowLeft size={17} />
                    Back to spaces
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back */}
                <Link
                    to="/spaces"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to spaces
                </Link>

                {/* Space header */}
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 px-6 py-12 text-center">
                        <div>
                            <div className="text-6xl">
                                {space.type === "meeting_room"
                                    ? "🏢"
                                    : "💻"}
                            </div>

                            <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-indigo-100">
                                {space.type.replace("_", " ")}
                            </p>

                            <h1 className="mt-2 text-4xl font-bold text-white">
                                {space.name}
                            </h1>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    About this space
                                </h2>

                                <p className="mt-3 leading-7 text-slate-600">
                                    {space.description ||
                                        "A comfortable workspace for your needs."}
                                </p>

                                {/* Capacity */}
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Users size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Capacity
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {space.capacity}{" "}
                                            {space.capacity === 1
                                                ? "person"
                                                : "people"}
                                        </p>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mt-8">
                                    <h3 className="font-semibold text-slate-900">
                                        Amenities
                                    </h3>

                                    {space.amenities?.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {space.amenities.map(
                                                (amenity) => (
                                                    <span
                                                        key={amenity}
                                                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
                                                    >
                                                        {amenity}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-slate-500">
                                            No amenities listed.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Booking CTA */}
                            {/* <div className="mt-8">
                                <BookingForm spaceId={space._id} />
                            </div> */}
                        </div>

                        <div className="mt-8">
                            <BookingForm spaceId={space._id} />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-indigo-600">
                                Availability
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                Check this space
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Select a date to see existing bookings and
                                maintenance windows.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="availability-date"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Select date
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="availability-date"
                                    type="date"
                                    value={selectedDate}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(event) =>
                                        setSelectedDate(
                                            event.target.value
                                        )
                                    }
                                    className="rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability error */}
                    {availabilityError && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {availabilityError}
                        </div>
                    )}

                    {/* Loading */}
                    {isAvailabilityLoading ? (
                        <div className="flex min-h-48 items-center justify-center">
                            <p className="text-sm text-slate-500">
                                Checking availability...
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 space-y-6">
                            {/* Bookings */}
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <Clock
                                        size={18}
                                        className="text-indigo-500"
                                    />

                                    <h3 className="font-semibold text-slate-900">
                                        Bookings
                                    </h3>
                                </div>

                                {availability?.bookings?.length > 0 ? (
                                    <div className="space-y-3">
                                        {availability.bookings.map(
                                            (booking) => (
                                                <div
                                                    key={booking._id}
                                                    className={`rounded-xl border p-4 ${getBookingStatusClasses(
                                                        booking.status
                                                    )}`}
                                                >
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={16} />

                                                            <span className="text-sm font-medium">
                                                                {formatDateTime(
                                                                    booking.startTime
                                                                )}{" "}
                                                                —{" "}
                                                                {formatDateTime(
                                                                    booking.endTime
                                                                )}
                                                            </span>
                                                        </div>

                                                        <span className="text-xs font-bold uppercase">
                                                            {
                                                                booking.status
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                        <CheckCircle2
                                            size={20}
                                            className="text-emerald-600"
                                        />

                                        <div>
                                            <p className="font-medium text-emerald-800">
                                                No bookings
                                            </p>

                                            <p className="text-sm text-emerald-700">
                                                No pending or approved bookings
                                                were found for this date.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Maintenance */}
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <Wrench
                                        size={18}
                                        className="text-orange-500"
                                    />

                                    <h3 className="font-semibold text-slate-900">
                                        Maintenance
                                    </h3>
                                </div>

                                {availability?.maintenance?.length > 0 ? (
                                    <div className="space-y-3">
                                        {availability.maintenance.map(
                                            (item) => (
                                                <div
                                                    key={item._id}
                                                    className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Wrench size={16} />

                                                        <span className="text-sm font-medium">
                                                            {formatDateTime(
                                                                item.startTime
                                                            )}{" "}
                                                            —{" "}
                                                            {formatDateTime(
                                                                item.endTime
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <CheckCircle2
                                            size={20}
                                            className="text-slate-400"
                                        />

                                        <p className="text-sm text-slate-600">
                                            No maintenance windows for this
                                            date.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Overall state */}
                            {!availability?.bookings?.length &&
                                !availability?.maintenance?.length && (
                                    <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-center">
                                        <CheckCircle2
                                            size={28}
                                            className="mx-auto text-emerald-600"
                                        />

                                        <h3 className="mt-3 font-semibold text-emerald-900">
                                            Space looks available
                                        </h3>

                                        <p className="mt-1 text-sm text-emerald-700">
                                            No existing bookings or maintenance
                                            windows were found for the selected
                                            date.
                                        </p>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpaceDetails;