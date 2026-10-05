import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Building2,
    Menu,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { clearTokens } from "../../utils/storage";

const Navbar = () => {
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        clearTokens();
        setUser(null);
        setMobileOpen(false);
        navigate("/login");
    };

    const getNavItems = () => {
        if (!user) {
            return [
                { label: "Home", path: "/" },
                { label: "Spaces", path: "/spaces" },
            ];
        }

        if (user.role === "admin") {
            return [
                { label: "Dashboard", path: "/admin/dashboard" },
                { label: "Spaces", path: "/admin/spaces" },
                { label: "Maintenance", path: "/admin/maintenance" },
                { label: "Bookings", path: "/admin/bookings" },
            ];
        }

        return [
            { label: "Home", path: "/" },
            { label: "Browse Spaces", path: "/spaces" },
            { label: "Dashboard", path: "/member/dashboard" },
            { label: "My Bookings", path: "/member/bookings" },
        ];
    };

    const navItems = getNavItems();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <p className="text-lg font-bold text-slate-900">
                            WorkSpace
                        </p>
                        <p className="hidden text-[11px] text-slate-500 sm:block">
                            Coworking made simple
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `rounded-lg px-4 py-2 text-sm font-medium transition ${isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 lg:flex">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                <UserCircle
                                    size={20}
                                    className="text-indigo-600"
                                />

                                <div className="max-w-32">
                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {user.name}
                                    </p>

                                    <p className="text-xs capitalize text-slate-500">
                                        {user.role}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                title="Logout"
                            >
                                <LogOut size={19} />
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((current) => !current)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-xl px-4 py-3 text-sm font-medium ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        {!user ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;