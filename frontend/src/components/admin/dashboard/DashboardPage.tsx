import React, { useEffect } from "react";
import withMainComponent from "../../layout/withMainComponent";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { CounterStat } from "./CounterStat";
import { getAdminDashboardStat } from "../../../store/features/dashboardSlice";
import ServicesStat from "./ServicesStat";
import { TopupStat } from "./TopupStat";

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { status, totalBrokers, totalConnections, totalUsers } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(getAdminDashboardStat());
  }, [dispatch]);

  return (
    <div className="p-4 pl-4 md:p-6 bg-whiten dark:bg-boxdark-2 min-h-screen">
      <h4 className="text-xl font-medium text-secondary dark:text-bodydark">
        Welcome, {user?.fullName}
      </h4>
      {status === "loading" ? (
        <div
          role="status"
          className="flex flex-col md:flex-row gap-4 md:gap-8 mt-5 animate-pulse"
        >
          <div className="shadow-md w-full md:w-1/3 bg-slate-100 dark:bg-strokedark py-2 rounded-xl h-40"></div>
          <div className="shadow-md w-full md:w-1/3 bg-slate-100 dark:bg-strokedark py-2 rounded-xl h-40"></div>
          <div className="shadow-md w-full md:w-1/3 bg-slate-100 dark:bg-strokedark py-2 rounded-xl h-40"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-5">
          <div className="shadow-md w-full md:w-1/3 bg-white dark:bg-boxdark py-2 rounded-xl">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                  <h4 className="tracking-wide text-sm font-normal text-body dark:text-bodydark">
                    Customers
                  </h4>
                  <h4 className="font-semibold text-2xl text-primary dark:text-primary">
                    {totalUsers}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-md w-full md:w-1/3 bg-white dark:bg-boxdark py-2 rounded-xl">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                  <h4 className="tracking-wide text-sm font-normal text-body dark:text-bodydark">
                    Brokers
                  </h4>
                  <h4 className="font-semibold text-2xl text-primary dark:text-primary">
                    {totalBrokers}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-md w-full md:w-1/3 bg-white dark:bg-boxdark py-2 rounded-xl">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                  <h4 className="tracking-wide text-sm font-normal text-body dark:text-bodydark">
                    Connections
                  </h4>
                  <h4 className="font-semibold text-2xl text-primary dark:text-primary">
                    {totalConnections}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-8 flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="w-full lg:w-3/4 bg-white dark:bg-boxdark rounded-xl shadow-md">
          <CounterStat />
        </div>
        <div className="w-full lg:w-1/4 bg-white dark:bg-boxdark rounded-xl shadow-md">
          <ServicesStat />
        </div>
      </div>
      <div className="my-4 w-full bg-white dark:bg-boxdark rounded-xl shadow-md">
        <TopupStat />
      </div>
    </div>
  );
};

export default withMainComponent(DashboardPage);
