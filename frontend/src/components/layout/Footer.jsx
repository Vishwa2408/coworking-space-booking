import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <Building2 size={18} />
                            </div>

                            <span className="font-bold text-slate-900">
                                WorkSpace
                            </span>
                        </Link>

                        <p className="mt-3 max-w-sm text-sm text-slate-500">
                            A simple coworking space booking platform for desks
                            and meeting rooms.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-5 text-sm">
                        <Link
                            to="/"
                            className="text-slate-500 hover:text-indigo-600"
                        >
                            Home
                        </Link>

                        <Link
                            to="/spaces"
                            className="text-slate-500 hover:text-indigo-600"
                        >
                            Spaces
                        </Link>

                        <Link
                            to="/login"
                            className="text-slate-500 hover:text-indigo-600"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="text-slate-500 hover:text-indigo-600"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-400">
                    © {new Date().getFullYear()} WorkSpace. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;