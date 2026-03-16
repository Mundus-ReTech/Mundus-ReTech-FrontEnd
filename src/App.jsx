import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/nav";
import Home from "./pages/Home";
import ListingPage from "./pages/ListingPage";
import LandingPage from "./pages/landingPage";
import PartnersPage from "./pages/PartnersPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/LogIn";
import SmallBusinessDashboard from "./pages/SmallBusinessDashboard";
import EnterpriseBusinessDashboard from "./pages/EnterpriseBusinessDashboard";
import NewListingPage from "./pages/NewListing";
import CheckoutForm from "./pages/CheckoutForm";
import Cart from "./pages/Cart";
import Return from "./pages/Return";

// TODO: import this from wherever your auth hook actually lives
// import { useAuthUser } from "./auth/useAuthUser";

export default function App() {
  function RequireRole({ roles, children }) {
    // If you aren't using auth yet, comment this out entirely.
    // const user = useAuthUser();
    // if (!user) return <Navigate to="/login" replace />;
    // return roles.includes(user.role) ? children : <Navigate to="/" replace />;

    return children;
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* ReTech public homepage */}
        <Route path="/" element={<LandingPage />} />

        {/* Keep old homepage accessible if needed */}
        <Route path="/home" element={<Home />} />

        {/* Optional: avoid duplicate public landing routes */}
        <Route path="/landing" element={<Navigate to="/" replace />} />

        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/dashboard/smb"
          element={
            <RequireRole roles={["smb"]}>
              <SmallBusinessDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/enterprise"
          element={
            <RequireRole roles={["enterprise"]}>
              <EnterpriseBusinessDashboard />
            </RequireRole>
          }
        />

        <Route path="/sell/new" element={<NewListingPage />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}