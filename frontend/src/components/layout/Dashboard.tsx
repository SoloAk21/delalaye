import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchUser } from "../../store/features/authSlice";
import { Navigate } from "react-router-dom";
import setAuthToken from "../../utils/setAuthToken";
import DashboardAlert from "./DashboardAlert";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const Dashboard: React.FC = () => {
  const { isAuthenticated, status, user, token } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (
    (status === "idle" || status === "failed") &&
    !isAuthenticated &&
    token === null
  ) {
    console.log("status: " + status);
    console.log("isAuthenticated: " + isAuthenticated);
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      <DashboardAlert />
      <Sidebar role={user?.role} />
    </div>
  );
};

export default Dashboard;
