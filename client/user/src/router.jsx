import { createBrowserRouter } from "react-router-dom";
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
import Events from "./pages/Events";
import TournamentRegistration from "./components/Tournment/TournamentRegistration";
import TournamentDetails from "./components/tournament/TournmentDetails";
import CoachingDetails from "./components/tournament/CoachingDetails";
import { PATHS } from "./constants/constants";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      // 1. Root-level routes (no city prefix)
      { index: true, element: <Home /> },
      { path: PATHS.LOGIN, element: <Login /> },
      { path: PATHS.SIGNUP, element: <SignUp /> },
      { path: PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: PATHS.RESET_PASSWORD, element: <ResetPassword /> },
      { path: PATHS.CONTACT_US, element: <ContactUs /> },

      // 2. City-prefixed routes (public)
      {
        path: ":city",
        children: [
          { index: true, element: <Home /> },
          { path: PATHS.TURFS, element: <Turf /> },
          { path: PATHS.TURF_DETAILS, element: <TurfDetails /> },
          { path: PATHS.TOURNAMENTS, element: <Events /> },
          { path: PATHS.TOURNAMENT_DETAILS, element: <TournamentDetails /> },
          { path: PATHS.COACHING_DETAILS, element: <CoachingDetails /> },
          { path: PATHS.BECOME_OWNER, element: <BecomeOwner /> },
          // Allow login/signup with city prefix to preserve context
          { path: PATHS.LOGIN, element: <Login /> },
          { path: PATHS.SIGNUP, element: <SignUp /> },
          { path: PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
          { path: PATHS.RESET_PASSWORD, element: <ResetPassword /> },
          { path: PATHS.CONTACT_US, element: <ContactUs /> },
        ],
      },
    ],
  },
  {
    // 3. Authenticated city-prefixed routes
    path: "/auth/:city",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: PATHS.TURFS, element: <Turf /> },
      { path: PATHS.TURF_DETAILS, element: <TurfDetails /> },
      { path: PATHS.RESERVE, element: <Reservation /> },
      { path: PATHS.BECOME_OWNER, element: <BecomeOwner /> },
      { path: PATHS.BOOKING_HISTORY, element: <TurfBookingHistory /> },
      { path: PATHS.TOURNAMENTS, element: <Events /> },
      { path: PATHS.TOURNAMENT_REGISTER, element: <TournamentRegistration /> },
      { path: PATHS.TOURNAMENT_DETAILS, element: <TournamentDetails /> },
      { path: PATHS.COACHING_DETAILS, element: <CoachingDetails /> },
    ],
  },
]);

export default router;
