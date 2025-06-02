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
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          dashboardMatchAdmin
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <LuLayoutDashboard className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/dashboard/"
        >
          Dashboard <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminBrokersRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <LuUsers className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/brokers/"
        >
          Brokers <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminServicesRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <MdOutlineMiscellaneousServices className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/services/"
        >
          Services <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminStaffRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <RiAdminFill className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/staff/"
        >
          Staff <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminSmsRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <MdOutlineMessage className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/sms/"
        >
          Sms <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminSettingRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <IoSettingsOutline className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/admin/settings/"
        >
          Settings <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          adminBrandingRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <FaPalette className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
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
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          dashboardMatchFinance
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <LuLayoutDashboard className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/finance/dashboard/"
        >
          Dashboard <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          financePaymentsRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <MdOutlineMiscellaneousServices className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/finance/payments/"
        >
          Payments <IoIosArrowForward />
        </NavLink>
      </li>
      <li
        className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded p-2 transition-colors duration-200 ${
          financePaymentHistoryRoute
            ? "bg-primary/10 font-medium text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5"
        }`}
      >
        <MdOutlineMessage className="text-lg" />
        <NavLink
          className="text-sm md:text-base flex items-center w-full justify-between"
          to="/finance/payment-history/"
        >
          History <IoIosArrowForward />
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="flex min-h-screen">
      <div
        id="sidebar"
        className="bg-white dark:bg-boxdark h-full fixed top-0 left-0 w-20 md:w-64 flex flex-col p-2 md:p-4 shadow-card border-r border-stroke dark:border-strokedark z-50"
      >
        <div className="my-6 md:my-8">
          <NavLink to="/" className="font-medium">
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
      <div className="flex-1 ml-20 md:ml-64 bg-whiten dark:bg-boxdark-2 min-h-screen">
        <Outlet />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Sidebar;
