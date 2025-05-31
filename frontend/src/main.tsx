import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./components/layout/ErrorPage.tsx";
import Staff from "./components/admin/staffs/Staff.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import Dashboard from "./components/layout/Dashboard.tsx";
import AdminDashboardPage from "./components/admin/dashboard/DashboardPage.tsx";

import AdminBrokers from './components/admin/brokers/Brokers.tsx'
import AdminServices from './components/admin/services/Services.tsx'
import Sms from "./components/admin/sms/Sms.tsx";
import Settings from "./components/admin/settings/Settings.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  
  
  
  {
    path: "/admin",
    element: <Dashboard />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "/admin/brokers",
        element: <AdminBrokers />,
      },
      {
        path: "/admin/services",
        element: <AdminServices />,
      },
      {
        path: "/admin/staff",
        element: <Staff />,
      },
      {
        path: "/admin/sms",
        element: <Sms />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      // {
      //   path: "branches",
      //   element: <Branches />,
      // },
      // {
      //   path: "branches/add",
      //   element: <AddBranch />,
      // },
      // {
      //   path: "requests",
      //   element: <Requests />,
      // },
      // {
      //   path: "requests/approve/:id",
      //   element: <ApproveRequest />
      // },
      // {
      //   path: "requests/edit/:id",
      //   element: <EditRequest />
      // },
      // {
      //   path: "requests/approved/:id",
      //   element: <ApprovedRequest />
      // }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <Router>
      <App />
    </Router> */}
    </Provider>
  </React.StrictMode>
);
