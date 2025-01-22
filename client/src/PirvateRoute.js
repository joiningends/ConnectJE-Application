
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem("whatsappusertoken");

  return (
    <Route
      {...rest}
      element={isLoggedIn ? <Component /> : <Navigate to="/SignIn" replace />}
    />
  );
};

export default PrivateRoute;
