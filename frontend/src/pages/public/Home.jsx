import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    Monitor,
    Users,
    Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden bg-slate-950">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

                <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
                    {/* Hero Content */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-indigo-200">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Flexible workspace, whenever you need it
                        </div>

                        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Find the right space
                            <span className="block text-indigo-400">
                                for your next idea.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                            Book desks and meeting rooms with real-time availability.
                            Choose a space, pick your time and get to work.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/spaces"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                            >
                                Browse Spaces
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Create an Account
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-400"
                                />
                                Real-time availability
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-400"
                                />
                                Easy booking
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-400"
                                />
                                Flexible workspaces
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="hidden lg:block">
                        <div className="relative mx-auto max-w-lg">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
                                <div className="rounded-2xl bg-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-indigo-600">
                                                AVAILABLE SPACE
                                            </p>

                                            <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                Focus Desk 01
                                            </h3>
                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Monitor size={21} />
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <Users
                                                size={18}
                                                className="text-slate-400"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Capacity
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                1 person
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <Wifi
                                                size={18}
                                                className="text-slate-400"
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Amenities
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                                Wi-Fi
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                            <Clock3 size={17} />
                                            Available today
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-white p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <CalendarCheck size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Booking
                                        </p>
                                        <p className="text-sm font-bold text-slate-900">
                                            Confirmed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            Everything you need
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            A simpler way to book your workspace
                        </h2>

                        <p className="mt-4 text-slate-500">
                            Find a workspace that fits your schedule and book it
                            without unnecessary steps.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <FeatureCard
                            icon={Monitor}
                            title="Flexible Workspaces"
                            description="Choose from focused desks and meeting rooms based on your needs."
                        />

                        <FeatureCard
                            icon={CalendarCheck}
                            title="Real-time Availability"
                            description="Check space availability for a specific date before making a booking."
                        />

                        <FeatureCard
                            icon={Clock3}
                            title="Easy Booking"
                            description="Select your date and time, submit your request and manage your bookings from your dashboard."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-xl sm:px-12">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Ready to find your workspace?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-indigo-100">
                            Explore available desks and meeting rooms and find a
                            space that works for you.
                        </p>

                        <Link
                            to="/spaces"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                            Explore Spaces
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
            </p>
        </div>
    );
};

export default Home;