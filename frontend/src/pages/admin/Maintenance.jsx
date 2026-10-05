import { useEffect, useState } from "react";
import {
    CalendarCog,
    Edit3,
    Plus,
    Trash2,
} from "lucide-react";

import {
    createMaintenance,
    deleteMaintenance,
    getMaintenance,
    updateMaintenance,
} from "../../api/maintenance.api";

import { getSpaces } from "../../api/space.api";

import MaintenanceForm from "../../components/admin/MaintenanceForm";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { formatDateTime } from "../../utils/formatters";

const Maintenance = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [spaces, setSpaces] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingMaintenance, setEditingMaintenance] =
        useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [maintenanceResponse, spacesResponse] =
                await Promise.all([
                    getMaintenance(),
                    getSpaces({
                        page: 1,
                        limit: 100,
                    }),
                ]);

            setMaintenance(
                maintenanceResponse.data?.data || []
            );

            setSpaces(spacesResponse.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load maintenance data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (payload) => {
        try {
            setSaving(true);


            await createMaintenance(payload);

            setShowForm(false);

            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            setSaving(true);

            await updateMaintenance(
                editingMaintenance._id,
                payload,
            );

            setEditingMaintenance(null);
            setShowForm(false);

            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        const spaceName =
            item.space?.name || "this space";

        const confirmed = window.confirm(
            `Are you sure you want to remove the maintenance window for "${spaceName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");


            await deleteMaintenance(item._id);

            await fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete maintenance window."
            );
        }
    };

    const openCreateForm = () => {
        setEditingMaintenance(null);
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setEditingMaintenance(item);
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingMaintenance(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Maintenance
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Block spaces during maintenance periods.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Block Time
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Maintenance List */}
            {maintenance.length === 0 ? (
                <EmptyState
                    title="No maintenance windows"
                    description="Blocked maintenance periods will appear here."
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {maintenance.map((item) => (
                        <MaintenanceCard
                            key={item._id}
                            item={item}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingMaintenance
                                    ? "Edit Maintenance"
                                    : "Block Maintenance Time"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingMaintenance
                                    ? "Update the blocked time range."
                                    : "Make a space unavailable for a specific date and time range."}
                            </p>
                        </div>

                        <div className="p-6">
                            <MaintenanceForm
                                spaces={spaces}
                                initialData={editingMaintenance}
                                onSubmit={
                                    editingMaintenance
                                        ? handleUpdate
                                        : handleCreate
                                }
                                onCancel={closeForm}
                                loading={saving}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MaintenanceCard = ({
    item,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <CalendarCog size={21} />
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Maintenance
                </span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
                {item.space?.name || "Space"}
            </h2>

            <div className="mt-4 space-y-2 text-sm">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Starts
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                        {formatDateTime(item.startTime)}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Ends
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                        {formatDateTime(item.endTime)}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <Edit3 size={16} />
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Maintenance;