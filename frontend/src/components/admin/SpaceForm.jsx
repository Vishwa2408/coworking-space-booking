import { useEffect, useState } from "react";

const initialForm = {
    name: "",
    type: "desk",
    capacity: "",
    amenities: "",
    description: "",
};

const SpaceForm = ({
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
                name: initialData.name || "",
                type: initialData.type || "desk",
                capacity: initialData.capacity || "",
                amenities: initialData.amenities?.join(", ") || "",
                description: initialData.description || "",
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

        if (!form.name.trim()) {
            setError("Space name is required.");
            return;
        }

        if (!form.capacity || Number(form.capacity) < 1) {
            setError("Capacity must be at least 1.");
            return;
        }

        const payload = {
            name: form.name.trim(),
            type: form.type,
            capacity: Number(form.capacity),
            amenities: form.amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            description: form.description.trim(),
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save the space."
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
                    Space Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Focus Desk 02"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Type
                    </label>

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="desk">Desk</option>
                        <option value="meeting_room">Meeting Room</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Capacity
                    </label>

                    <input
                        type="number"
                        name="capacity"
                        min="1"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amenities
                </label>

                <input
                    type="text"
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    placeholder="Wi-Fi, Power Outlet, Monitor"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                    Separate amenities with commas.
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe this workspace..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
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
                            ? "Update Space"
                            : "Create Space"}
                </button>
            </div>
        </form>
    );
};

export default SpaceForm;