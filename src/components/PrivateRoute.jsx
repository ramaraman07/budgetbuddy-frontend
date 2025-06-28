import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
