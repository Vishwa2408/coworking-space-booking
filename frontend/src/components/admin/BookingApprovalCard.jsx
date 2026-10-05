import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

const BookingApprovalCard = ({
    booking,
    onApprove,
    onReject,
    actionLoading,
}) => {
    const isPending = booking.status === "pending";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {booking.space?.name || "Space"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {booking.member?.name || "Member"}
                    </p>

                    <p className="text-sm text-slate-500">
                        {booking.member?.email || ""}
                    </p>
                </div>

                <StatusBadge status={booking.status} />
            </div>

            <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Start
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDateTime(booking.startTime)}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        End
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDateTime(booking.endTime)}
                    </p>
                </div>
            </div>

            {isPending && (
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => onReject(booking)}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <XCircle size={17} />
                        Reject
                    </button>

                    <button
                        type="button"
                        onClick={() => onApprove(booking)}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 size={17} />
                        Approve
                    </button>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        pending: {
            label: "Pending",
            classes: "bg-amber-50 text-amber-700",
            icon: Clock3,
        },
        approved: {
            label: "Approved",
            classes: "bg-emerald-50 text-emerald-700",
            icon: CheckCircle2,
        },
        rejected: {
            label: "Rejected",
            classes: "bg-red-50 text-red-700",
            icon: XCircle,
        },
        cancelled: {
            label: "Cancelled",
            classes: "bg-slate-100 text-slate-600",
            icon: XCircle,
        },
    };

    const current = config[status] || config.pending;
    const Icon = current.icon;

    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${current.classes}`}
        >
            <Icon size={14} />
            {current.label}
        </span>
    );
};

export default BookingApprovalCard;