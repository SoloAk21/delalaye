import { useEffect, useState } from "react";
import withMainComponent from "../../layout/withMainComponent";
import ApprovedBrokers from "./ApprovedBrokers";
import NotApprovedBrokers from "./NotApprovedBrokers";
import { Link, useLocation } from "react-router-dom";

const Brokers: React.FC = () => {
  const [activeLink, setActiveLink] = useState<"approved" | "notapproved">(
    "notapproved"
  );
  const [isLinkSet, setIsLinkSet] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    setActiveLink(tab === "approved" ? "approved" : "notapproved");
    setIsLinkSet(true);
  }, [location.search]);

  return (
    <div className="p-4 sm:p-6 pl-4 ml-4  bg-white dark:bg-boxdark rounded-lg shadow-md">
      <h6 className="text-lg font-semibold text-body dark:text-bodydark mb-4">
        Manage Accounts
      </h6>
      <div className="text-sm font-medium text-center text-body dark:text-bodydark border-b-2 border-stroke dark:border-strokedark">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <Link
              to="/admin/brokers/?tab=approved"
              onClick={() => setActiveLink("approved")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeLink === "approved"
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-primary hover:border-primary/50"
              }`}
            >
              Approved
            </Link>
          </li>
          <li className="mr-2">
            <Link
              to="/admin/brokers/?tab=registered"
              onClick={() => setActiveLink("notapproved")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeLink === "notapproved"
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-primary hover:border-primary/50"
              }`}
            >
              Not Approved
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        {isLinkSet && activeLink === "approved" && <ApprovedBrokers />}
        {isLinkSet && activeLink === "notapproved" && <NotApprovedBrokers />}
      </div>
    </div>
  );
};

export default withMainComponent(Brokers);
