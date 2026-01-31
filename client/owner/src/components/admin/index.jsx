//  User Management
import UserManagement from "./UserManagement/UserPage";
import OwnerManagement from "./OwnerManagement/OwnerViewer";
import OwnerRequests from "./OwnerRequests/NewOwnerRequests"; // Assuming NewOwnerRequests is the main export for OwnerRequests
import Tournments from "./Tournments"; // Assuming a Tournments module exists
import Transactions from "./Transactions/TransactionSection";
import Turf from "./Turf/TurfList"; // Assuming TurfList is the main export for Turf
import Dashboard from "./Dashboard/AdminDashboard"; // Assuming AdminDashboard is the main export for Dashboard
import Coaching from "./Coaching"; // New import for Coaching

export {
    UserManagement,
    OwnerManagement,
    OwnerRequests,
    Tournments,
    Transactions,
    Turf,
    Dashboard,
    Coaching
};

//  Owner Requests
export { default as NewOwnerRequests } from "./OwnerRequests/NewOwnerRequests";
export { default as RejectedOwnerRequests } from "./OwnerRequests/RejectedOwnerRequests"

// Dashboard
export { default as AdminDashboard } from "./Dashboard/AdminDashboard"

// Owner Management
export { default as OwnerViewer } from "./OwnerManagement/OwnerViewer"

// Turf
export { default as TurfList } from "./Turf/TurfList"
export { default as AllTurf } from "./Turf/AllTurf"

// Transactions
export { default as TransactionSection } from "./Transactions/TransactionSection"