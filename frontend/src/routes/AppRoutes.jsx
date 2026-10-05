import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MemberLayout from "../layouts/MemberLayout";
import Dashboard from "../pages/member/Dashboard";
import MyBookings from "../pages/member/MyBookings";
import Spaces from "../pages/public/Spaces";
import SpaceDetails from "../pages/public/SpaceDetails";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminSpaces from "../pages/admin/Spaces";
import AdminMaintenance from "../pages/admin/Maintenance";
import AdminBookings from "../pages/admin/Bookings";
import PublicLayout from "../layouts/PublicLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public pages */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>


                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/spaces" element={<Spaces />} />
                    <Route path="/spaces/:id" element={<SpaceDetails />} />
                </Route>

                {/* Member pages*/}
                <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
                    <Route element={<MemberLayout />}>
                        <Route path="/member/dashboard" element={<Dashboard />} />
                        <Route path="/member/bookings" element={<MyBookings />} />
                    </Route>
                </Route>

                {/* Admin pages */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/spaces" element={<AdminSpaces />} />
                        <Route path="/admin/maintenance" element={<AdminMaintenance />} />
                        <Route path="/admin/bookings" element={<AdminBookings />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;