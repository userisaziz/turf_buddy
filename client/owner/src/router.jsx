import { createBrowserRouter } from "react-router-dom";

// import {ProtectedRoute} from "@components/ProtectedRoute"

import Home from "@pages/Home.jsx";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";

//  all the components that are used in the layout
import { AdminLayout, OwnerLayout, GuestLayout } from "@layouts";

//  all the components that are used in the owner dashboard
import {
  AddTurf,
  OwnerDashboard,
  TurfManagement,
  OwnerReviews,
  OwnerBookings,
} from "@components/owner";

//  all the components that are used in the admin dashboard
import {
  UserManagement,
  NewOwnerRequests,
  RejectedOwnerRequests,
  AdminDashboard,
  OwnerViewer,
  TurfList,
  AllTurf,
  TransactionSection,
} from "@components/admin";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";

// 404 page

import { NotFound } from "@components/common";

import Reservation from "./components/owner/Reservation";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      {
        path: "owner-requests",
        children: [
          { path: "new", element: <NewOwnerRequests /> },
          { path: "rejected", element: <RejectedOwnerRequests /> },
        ],
      },
      { path: "users", element: <UserManagement /> },
      {
        path: "owners",
        children: [
          { path: "", element: <OwnerViewer /> },
          { path: ":ownerId/turf", element: <TurfList /> },
        ],
      },

      { path: "turfs", element: <AllTurf /> },
      { path: "transactions", element: <TransactionSection /> },
    ],
  },
  {
    path: "/owner",
    element: (
      <ProtectedRoute requiredRole="owner">
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <OwnerDashboard /> },
      { path: "add-turf", element: <AddTurf /> },
      { path: "turfs", element: <TurfManagement /> },
      { path: "reviews", element: <OwnerReviews /> },
      { path: "bookings", element: <OwnerBookings /> },
      { path: "reservations", element: <Reservation /> },
    ],
  },
]);

export default router;
