import { useEffect, useState } from "react";
import {
    Building2,
    Edit3,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";

import {
    createSpace,
    deleteSpace,
    getSpaces,
    updateSpace,
} from "../../api/space.api";
import SpaceForm from "../../components/admin/SpaceForm";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const Spaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingSpace, setEditingSpace] = useState(null);

    const fetchSpaces = async (showLoading = false) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const response = await getSpaces({
                page: 1,
                limit: 100,
                search: search || undefined,
            });

            setSpaces(response.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load spaces."
            );
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSpaces(search === "");
    }, [search]);

    const handleCreate = async (payload) => {
        try {
            setSaving(true);


            await createSpace(payload);

            setShowForm(false);
            await fetchSpaces();
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            setSaving(true);


            await updateSpace(editingSpace._id, payload);

            setEditingSpace(null);
            setShowForm(false);

            await fetchSpaces();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (space) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${space.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteSpace(space._id);

            await fetchSpaces();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete the space."
            );
        }
    };

    const openCreateForm = () => {
        setEditingSpace(null);
        setShowForm(true);
    };

    const openEditForm = (space) => {
        setEditingSpace(space);
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingSpace(null);
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
                        Spaces
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create and manage desks and meeting rooms.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Add Space
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search spaces..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Spaces */}
            {spaces.length === 0 ? (
                <EmptyState
                    title="No spaces found"
                    description="Create your first coworking space to get started."
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {spaces.map((space) => (
                        <SpaceAdminCard
                            key={space._id}
                            space={space}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingSpace ? "Edit Space" : "Add New Space"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingSpace
                                    ? "Update the workspace details."
                                    : "Add a new desk or meeting room."}
                            </p>
                        </div>

                        <div className="p-6">
                            <SpaceForm
                                initialData={editingSpace}
                                onSubmit={
                                    editingSpace
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

const SpaceAdminCard = ({
    space,
    onEdit,
    onDelete,
}) => {
    const isMeetingRoom = space.type === "meeting_room";

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Building2 size={22} />
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {isMeetingRoom ? "Meeting Room" : "Desk"}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">
                    {space.name}
                </h2>

                {space.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {space.description}
                    </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Users size={17} className="text-slate-400" />
                    Capacity: {space.capacity}
                </div>

                {space.amenities?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {space.amenities.map((amenity) => (
                            <span
                                key={amenity}
                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={() => onEdit(space)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(space)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Spaces;