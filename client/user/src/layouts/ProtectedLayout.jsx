import { Navigate, Outlet } from "react-router-dom";
import AuthNavbar from "../components/auth/AuthNavbar";
import { useSelector } from "react-redux"
import ScrollToTop from "../components/common/ScrollToTop";
import { PATHS } from "../constants/constants";

export default function ProtectedLayout() {
  const { isLoggedIn } = useSelector(state => state.auth)
  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  return (
    <div className="flex flex-col min-h-screen ">
      <ScrollToTop />
      <AuthNavbar />
      <main className="flex-grow pt-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
