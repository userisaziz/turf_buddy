import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Turf from "./components/turf/Turf";
import TurfDetails from "./components/turf/TurfDetails";
import BecomeOwner from "./features/becomeOwner/BecomeOwner";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Reservation from "./components/Reservation";
import TurfBookingHistory from "./components/turf/TurfBookingHistory";
import NotFound from "./components/common/NotFound";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ContactUs from "./pages/ContactUs";
import TournamentList from "./pages/Tournament";
import TournamentRegistration from "./components/Tournment/TournamentRegistration";
import TournamentDetails from "./components/tournament/TournmentDetails";
import { PATHS } from "./constants/constants";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: ":city",
        children: [
          {
            path: PATHS.HOME,
            element: <Home />,
          },
          {
            path: PATHS.LOGIN,
            element: <Login />,
          },
          {
            path: PATHS.SIGNUP,
            element: <SignUp />,
          },
          {
            path: PATHS.RESET_PASSWORD,
            element: <ResetPassword />,
          },
          {
            path: PATHS.FORGOT_PASSWORD,
            element: <ForgotPassword />,
          },
          {
            path: PATHS.TURFS,
            element: <Turf />,
          },
          {
            path: PATHS.TURF_DETAILS,
            element: <TurfDetails />,
          },
          {
            path: PATHS.CONTACT_US,
            element: <ContactUs />,
          },
        ],
      },
      // Redirect root to a city selection logic managed in Root/Navbar
      // or handle it by letting Root render and showing the popup.
    ],
  },
  {
    path: "/auth/:city",
    element: <ProtectedLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Home />,
      },
      {
        path: PATHS.TURFS,
        element: <Turf />,
      },
      {
        path: PATHS.TURF_DETAILS,
        element: <TurfDetails />,
      },
      {
        path: PATHS.RESERVE,
        element: <Reservation />,
      },
      {
        path: PATHS.BECOME_OWNER,
        element: <BecomeOwner />,
      },
      {
        path: PATHS.BOOKING_HISTORY,
        element: <TurfBookingHistory />,
      },
      {
        path: PATHS.TOURNAMENTS,
        element: <TournamentList />,
      },
      {
        path: PATHS.TOURNAMENT_REGISTER,
        element: <TournamentRegistration />,
      },
      {
        path: PATHS.TOURNAMENT_DETAILS,
        element: <TournamentDetails />,
      },
    ],
  },
]);

export default router;
