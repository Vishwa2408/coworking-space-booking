import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MemberLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navigationItems = [
        {
            label: "Dashboard",
            path: "/member/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Bookings",
            path: "/member/bookings",
            icon: CalendarDays,
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-20 items-center border-b border-slate-100 px-6">
                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                                W
                            </div>

                            <div>
                                <p className="font-bold text-slate-900">WorkSpace</p>
                                <p className="text-xs text-slate-400">Member Portal</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon size={19} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="border-t border-slate-100 p-4">
                        <div className="mb-3 rounded-xl bg-slate-50 p-3">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    <Link
                        to="/member/dashboard"
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                            W
                        </div>

                        <span className="font-bold text-slate-900">WorkSpace</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((previous) => !previous)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white px-4 py-4">
                        <nav className="space-y-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="min-h-screen lg:ml-64">
                <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MemberLayout;