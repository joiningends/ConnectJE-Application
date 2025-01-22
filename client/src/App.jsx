// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignIn from "./components/signIn/SignIn.jsx";
import Admin from "./userRoutes/Admin.jsx";
import User from "./userRoutes/User.jsx";
import SalesMarketing from "./userRoutes/SalesMarketing.jsx";
import Scanner from "./userRoutes/Scanner.jsx";
import Optometrist from "./userRoutes/Optometrist.jsx";
import Partner from "./userRoutes/Partner.jsx";
import ForgotPassword from "./components/forgotPassword/FrogotPassword.jsx";
import ChangePassword from "./components/forgotPassword/ChangePassword.jsx";
// import UserFormFillGeneration from "./components/Event/UserFormFillGeneration.jsx";
import UserFormFillGenerationTimeSlot from "./components/Event/UserFormFillGenerationTimeSlot.jsx";
// import PrivacyPolicy from "./components/admin/newChanges/PrivacyPolicy.jsx";
import TermsAndConditions from "./components/admin/newChanges/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/admin/newChanges/PrivacyPolicy";
import AboutUs from "./components/admin/newChanges/AboutUs.jsx";
import Contact from "./components/admin/newChanges/ContactUs.jsx";
import CancellationAndRefundPolicy from "./components/admin/newChanges/Cancellation.jsx";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    !!localStorage.getItem("whatsappusertype")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("whatsappusertype"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return isAuthenticated;
};

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/SignIn" state={{ from: location }} />
  );
};

const App = () => {
  const userRole = localStorage.getItem("whatsappusertype");
  const isAuthenticated = !!userRole;

  return (
    <Router>
      <div className="flex h-screen">
        <div className="flex-grow p-6">
          <Routes>
            {/* Public Routes */}
            {/* <Route
              path="/normalEvent/:id"
              element={<UserFormFillGeneration />}
            /> */}
            <Route
              path="/eventTimeSlot/:id"
              element={<UserFormFillGenerationTimeSlot />}
            />
            <Route
              path="/ConnectJe_PrivacyPolicy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/ConnectJe_TermsAndConditions"
              element={<TermsAndConditions />}
            />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/ContactUs" element={<Contact />} />
            <Route
              path="/CancellationAndRefundPolicy"
              element={<CancellationAndRefundPolicy />}
            />
            <Route
              path="/SignIn"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={
                      userRole === "admin"
                        ? "/admin"
                        : userRole === "Sales Marketing"
                        ? "/salesMarketing"
                        : userRole === "Scanner"
                        ? "/scanner"
                        : userRole === "Optometrist"
                        ? "/optometrist"
                        : userRole === "Partner"
                        ? "/partner"
                        : "/WAprofile"
                    }
                  />
                ) : (
                  <SignIn />
                )
              }
            />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route
              path="/setPassword/client/reset/:token"
              element={<ChangePassword />}
            />

            {/* Protected Routes for Admin, User, Sales Marketing, Scanner, Optometrist, and Partner */}
            {userRole === "admin" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<Admin />} />}
              />
            )}
            {userRole === "user" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<User />} />}
              />
            )}
            {userRole === "Sales Marketing" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<SalesMarketing />} />}
              />
            )}
            {userRole === "Scanner" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<Scanner />} />}
              />
            )}
            {userRole === "Optometrist" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<Optometrist />} />}
              />
            )}
            {userRole === "Partner" && (
              <Route
                path="/*"
                element={<ProtectedRoute element={<Partner />} />}
              />
            )}

            <Route
              path="*"
              element={
                <Navigate
                  to={
                    isAuthenticated
                      ? userRole === "admin"
                        ? "/admin"
                        : userRole === "Sales Marketing"
                        ? "/salesMarketing"
                        : userRole === "Scanner"
                        ? "/scanner"
                        : userRole === "Optometrist"
                        ? "/optometrist"
                        : userRole === "Partner"
                        ? "/partner"
                        : "/user"
                      : "/SignIn"
                  }
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
