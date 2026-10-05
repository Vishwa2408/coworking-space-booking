import { useState } from "react";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { createBooking } from "../../api/booking.api";

const BookingForm = ({ spaceId, onSuccess }) => {
    const getToday = () => {
        return new Date().toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        date: getToday(),
        startTime: "",
        endTime: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.date || !formData.startTime || !formData.endTime) {
            setError("Please select a date, start time and end time.");
            return;
        }

        if (formData.endTime <= formData.startTime) {
            setError("End time must be after start time.");
            return;
        }

        const startDateTime = new Date(
            `${formData.date}T${formData.startTime}`
        );

        const endDateTime = new Date(
            `${formData.date}T${formData.endTime}`
        );

        if (startDateTime <= new Date()) {
            setError("Booking start time must be in the future.");
            return;
        }

        try {
            setIsSubmitting(true);

            await createBooking({
                space: spaceId,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
            });

            setSuccess(
                "Booking request created successfully. Waiting for admin approval."
            );

            setFormData({
                date: formData.date,
                startTime: "",
                endTime: "",
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create booking."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    Reserve this space
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Create a booking
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Select the date and time you would like to use this space.
                </p>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
            >
                <div className="grid gap-5 md:grid-cols-3">
                    {/* Date */}
                    <div>
                        <label
                            htmlFor="booking-date"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Date
                        </label>

                        <div className="relative">
                            <CalendarDays
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="booking-date"
                                name="date"
                                type="date"
                                value={formData.date}
                                min={getToday()}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Start time */}
                    <div>
                        <label
                            htmlFor="booking-start-time"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Start time
                        </label>

                        <div className="relative">
                            <Clock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="booking-start-time"
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* End time */}
                    <div>
                        <label
                            htmlFor="booking-end-time"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            End time
                        </label>

                        <div className="relative">
                            <Clock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="booking-end-time"
                                name="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {isSubmitting && (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    )}

                    {isSubmitting
                        ? "Creating booking..."
                        : "Request booking"}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;