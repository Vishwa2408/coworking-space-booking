import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const loggedInUser = await login(formData);

            if (loggedInUser.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/member/dashboard");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your email and password."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Left section */}
                <div className="hidden bg-slate-900 px-12 py-12 lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                <LogIn size={20} />
                            </div>

                            <span className="text-xl font-bold text-white">
                                WorkSpace
                            </span>
                        </div>

                        <div className="mt-32 max-w-lg">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                                Coworking made simple
                            </p>

                            <h1 className="text-5xl font-bold leading-tight text-white">
                                Find your space.
                                <br />
                                Book your time.
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-400">
                                Discover desks and meeting rooms that fit your workday and
                                reserve them in just a few clicks.
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        © 2026 WorkSpace. All rights reserved.
                    </p>
                </div>

                {/* Login section */}
                <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <p className="text-sm font-semibold text-indigo-600 lg:hidden">
                                WorkSpace
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Sign in to manage your coworking bookings.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((previous) => !previous)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Create an account
                            </Link>
                        </p>

                        <Link
                            to="/"
                            className="mt-6 block text-center text-sm text-slate-400 hover:text-slate-600"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;