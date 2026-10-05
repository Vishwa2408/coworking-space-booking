import { NavLink, useNavigate } from "react-router-dom";
import {
    CalendarCheck,
    LayoutDashboard,
    LogOut,
    Settings,
    Building2,
} from "lucide-react";
import { clearTokens } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        clearTokens();
        setUser(null);
        navigate("/login");
    };

    const navItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Spaces",
            path: "/admin/spaces",
            icon: Building2,
        },
        {
            label: "Maintenance",
            path: "/admin/maintenance",
            icon: Settings,
        },
        {
            label: "Bookings",
            path: "/admin/bookings",
            icon: CalendarCheck,
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                <SidebarContent
                    navItems={navItems}
                    user={user}
                    handleLogout={handleLogout}
                />
            </aside>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                {/* Mobile navigation will be added during responsive polish */}
            </div>
        </>
    );
};

const SidebarContent = ({ navItems, user, handleLogout }) => {
    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-20 items-center border-b border-slate-200 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            WorkSpace
                        </h1>
                        <p className="text-xs text-slate-500">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-6">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Admin User */}
            <div className="border-t border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {user?.name || "Admin"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {user?.email || "Administrator"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <LogOut size={19} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;