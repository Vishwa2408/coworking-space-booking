import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SPACE_TYPES } from "../../utils/constants";

const SpaceCard = ({ space }) => {
    const isMeetingRoom = space.type === SPACE_TYPES.MEETING_ROOM;

    return (
        <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            {/* Visual header */}
            <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500">
                <div className="text-center text-white">
                    <div className="text-5xl">
                        {isMeetingRoom ? "🏢" : "💻"}
                    </div>

                    <p className="mt-2 text-sm font-medium text-indigo-100">
                        {isMeetingRoom ? "Meeting Room" : "Desk"}
                    </p>
                </div>

                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm">
                    {space.type.replace("_", " ")}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">
                    {space.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {space.description || "A comfortable workspace for your needs."}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Users size={17} className="text-indigo-500" />

                    <span>
                        Capacity: <strong>{space.capacity}</strong>
                    </span>
                </div>

                {space.amenities?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {space.amenities.slice(0, 3).map((amenity) => (
                            <span
                                key={amenity}
                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                                {amenity}
                            </span>
                        ))}

                        {space.amenities.length > 3 && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                +{space.amenities.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <Link
                    to={`/spaces/${space._id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-indigo-600"
                >
                    View details
                    <ArrowRight size={17} />
                </Link>
            </div>
        </div>
    );
};

export default SpaceCard;