import React from "react";
import { NavLink, Outlet, useMatch } from "react-router-dom";
import { Toaster } from "sonner";
import { IoIosArrowForward } from "react-icons/io";
import { LuLayoutDashboard, LuUsers } from "react-icons/lu";
import {
  MdOutlineMiscellaneousServices,
  MdOutlineMessage,
} from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPalette } from "react-icons/fa";
import { useAppSelector } from "../../store/store";
import Logo from "../../assets/logo.png";

interface Props {
  role?: string;
}

const Sidebar: React.FC<Props> = ({ role }: Props) => {
  const { branding } = useAppSelector((state) => state.branding);
  const isDarkMode = document.documentElement.classList.contains("dark");

  const dashboardMatchAdmin = useMatch("/admin/dashboard/");
  const adminBrokersRoute = useMatch("/admin/brokers/");
  const adminStaffRoute = useMatch("/admin/staff/");
  const adminSmsRoute = useMatch("/admin/sms/");
  const adminSettingRoute = useMatch("/admin/settings/");
  const adminServicesRoute = useMatch("/admin/services/");
  const adminBrandingRoute = useMatch("/admin/branding/");

  const dashboardMatchFinance = useMatch("/finance/dashboard/");
  const financePaymentsRoute = useMatch("/finance/payments/");
  const financePaymentHistoryRoute = useMatch("/finance/payment-history/");

  const logoSrc = branding
    ? isDarkMode
      ? branding.logoDark || Logo
      : branding.logoLight || Logo
    : Logo;

  const adminNavigation = (
    <>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          dashboardMatchAdmin
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <LuLayoutDashboard />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/dashboard/"
        >
          Dashboard <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminBrokersRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <LuUsers />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/brokers/"
        >
          Brokers <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminServicesRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <MdOutlineMiscellaneousServices />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/services/"
        >
          Services <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminStaffRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <RiAdminFill />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/staff/"
        >
          Staff <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminSmsRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <MdOutlineMessage />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/sms/"
        >
          Sms <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminSettingRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <IoSettingsOutline />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/settings/"
        >
          Settings <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          adminBrandingRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <FaPalette />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/admin/branding/"
        >
          Branding <IoIosArrowForward />
        </NavLink>
      </li>
    </>
  );

  const financeNavigation = (
    <>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          dashboardMatchFinance
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <LuLayoutDashboard />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/finance/dashboard/"
        >
          Dashboard <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          financePaymentsRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <MdOutlineMiscellaneousServices />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/finance/payments/"
        >
          Payments <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 ${
          financePaymentHistoryRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        <MdOutlineMessage />
        <NavLink
          className="text-sm md:text-base text-center flex items-center w-full justify-between"
          to="/finance/payment-history/"
        >
          History <IoIosArrowForward />
        </NavLink>
      </li>
    </>
  );

  return (
    <>
      <div
        id="sidebar"
        className="bg-white dark:bg-boxdark h-full fixed top-0 left-0 w-24 md:w-56 flex flex-col p-2 md:p-4 shadow-card border-r border-gray-200 dark:border-gray-700"
      >
        <div className="my-8">
          <NavLink to="/" className="font-medium text-white">
            <img
              className="m-auto max-h-12 object-contain"
              src={logoSrc}
              alt="Delalaye Broker Logo"
              width={80}
              loading="lazy"
            />
          </NavLink>
        </div>
        <nav>
          <ul className="list-none flex flex-col gap-1 md:gap-3 w-full">
            {role === "admin" && adminNavigation}
            {role === "finance" && financeNavigation}
          </ul>
        </nav>
      </div>
      <Outlet />
      <Toaster />
    </>
  );
};

export default Sidebar;
