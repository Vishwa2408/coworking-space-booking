import { useEffect, useState } from "react";

const initialForm = {
    space: "",
    startTime: "",
    endTime: "",
};

const MaintenanceForm = ({
    spaces = [],
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setForm({
                space: initialData.space?._id || initialData.space || "",
                startTime: initialData.startTime
                    ? toDateTimeLocal(initialData.startTime)
                    : "",
                endTime: initialData.endTime
                    ? toDateTimeLocal(initialData.endTime)
                    : "",
            });
        } else {
            setForm(initialForm);
        }
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.space) {
            setError("Please select a space.");
            return;
        }

        if (!form.startTime || !form.endTime) {
            setError("Start time and end time are required.");
            return;
        }

        const start = new Date(form.startTime);
        const end = new Date(form.endTime);

        if (end <= start) {
            setError("End time must be after start time.");
            return;
        }

        try {
            await onSubmit({
                space: form.space,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save maintenance window."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Space
                </label>

                <select
                    name="space"
                    value={form.space}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">Select a space</option>

                    {spaces.map((space) => (
                        <option key={space._id} value={space._id}>
                            {space.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Start Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        End Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Saving..."
                        : initialData
                            ? "Update Maintenance"
                            : "Block Time"}
                </button>
            </div>
        </form>
    );
};

const toDateTimeLocal = (value) => {
    const date = new Date(value);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
};

export default MaintenanceForm;