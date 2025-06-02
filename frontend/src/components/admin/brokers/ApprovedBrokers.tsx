import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { Broker } from "../../../model/models";
import {
  getApprovedBrokers,
  searchApprovedBrokers,
} from "../../../store/features/brokerSlice";
import Popup from "../../layout/Popup";
import UpdateBroker from "./UpdateBroker";
import Spinner from "../../layout/Spinner";
import { CiMenuKebab } from "react-icons/ci";
import ReactPaginate from "react-paginate";
import debounce from "lodash.debounce";
import {
  formatDate,
  accountExpired,
  calculateDateDifference,
} from "../../../utils/date";
import { motion } from "framer-motion";

const ApprovedBrokers: React.FC = () => {
  const { status, approvedBrokers, total } = useAppSelector(
    (state) => state.broker
  );
  const dispatch = useAppDispatch();
  const [updatedBroker, setUpdatedBroker] = useState<Broker | null>(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [brokersPerPage, setBrokersPerPage] = useState<number>(10);
  const brokersPerPageOptions = [10, 25, 50, 75, 100];
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(
      getApprovedBrokers({ _limit: brokersPerPage, _page: currentPage })
    );

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, currentPage, brokersPerPage]);

  const totalPages = Math.ceil(total / brokersPerPage);

  const openInPopup = (broker: Broker) => {
    setUpdatedBroker(broker);
    setOpenUpdatePopup(true);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const debouncedSearchApprovedBrokers = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim() === "") {
        setCurrentPage(1);
        dispatch(getApprovedBrokers({ _limit: brokersPerPage, _page: 1 }));
        return;
      }
      dispatch(
        searchApprovedBrokers({
          _limit: brokersPerPage,
          _page: currentPage,
          search: searchQuery,
          searchBy: "fullName",
        })
      );
    }, 500),
    [dispatch, brokersPerPage, currentPage]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    debouncedSearchApprovedBrokers(newQuery);
  };

  return (
    <>
      <div className="w-full sm:w-64 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search brokers..."
          className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary text-sm"
        />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-boxdark">
        <table className="w-full text-sm text-left text-body dark:text-bodydark">
          <thead className="bg-whiten dark:bg-boxdark-2">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold">Id</th>
              <th className="px-6 py-3 text-xs font-semibold">Name</th>
              <th className="px-6 py-3 text-xs font-semibold">Phone</th>
              <th className="px-6 py-3 text-xs font-semibold">Connections</th>
              <th className="px-6 py-3 text-xs font-semibold">
                Account Expire Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold">Services</th>
              <th className="px-6 py-3 text-xs font-semibold">Availability</th>
              <th className="px-6 py-3 text-xs font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  <Spinner width="30px" />
                </td>
              </tr>
            ) : approvedBrokers.length ? (
              approvedBrokers.map((broker) => (
                <tr
                  key={broker.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-primary/5"
                >
                  <td className="px-6 py-4 text-xs">{broker.id}</td>
                  <td className="px-6 py-4 text-xs">{broker.fullName}</td>
                  <td className="px-6 py-4 text-xs">{broker.phone}</td>
                  <td className="px-6 py-4 text-xs">
                    {broker.Connection?.length || 0}
                  </td>
                  <td
                    className={`px-6 py-4 text-xs ${
                      accountExpired(broker.serviceExprireDate!)
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {formatDate(broker.serviceExprireDate!)}
                      <span className="block text-xs">
                        {calculateDateDifference(broker.serviceExprireDate!)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {broker.services?.map((service) => service.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`w-4 h-4 border rounded-full ${
                        broker.avilableForWork ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4 relative text-center">
                    <motion.button
                      onClick={() => {
                        setOpenMenu(true);
                        setUpdatedBroker(broker);
                      }}
                      className="px-2 py-1 rounded hover:bg-primary/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CiMenuKebab size={20} />
                    </motion.button>
                    {openMenu && updatedBroker?.id === broker.id && (
                      <div
                        ref={menuRef}
                        className="z-50 text-xs bg-white dark:bg-boxdark border border-stroke dark:border-strokedark absolute top-10 right-8 flex flex-col w-36 shadow-md rounded-md"
                      >
                        <motion.button
                          className="text-left px-4 py-2 hover:bg-primary/10 text-body dark:text-bodydark"
                          onClick={() => {
                            setOpenMenu(false);
                            openInPopup(broker);
                          }}
                          whileHover={{
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          Update Broker
                        </motion.button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-body dark:text-bodydark"
                >
                  No brokers registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center">
          <label
            htmlFor="brokersPerPage"
            className="text-body dark:text-bodydark text-xs mr-2"
          >
            List Per Page:
          </label>
          <select
            id="brokersPerPage"
            className="py-1.5 px-2 border border-stroke dark:border-strokedark rounded-md text-sm text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none"
            onChange={(e) => setBrokersPerPage(Number(e.target.value))}
            value={brokersPerPage}
          >
            {brokersPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="pagination-container flex items-center gap-2">
          <ReactPaginate
            previousLabel={
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &lt;
              </motion.span>
            }
            nextLabel={
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &gt;
              </motion.span>
            }
            breakLabel="..."
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName="flex items-center gap-1"
            pageClassName="px-3 py-2 rounded-md text-sm"
            pageLinkClassName="text-body dark:text-bodydark hover:bg-primary/10"
            activeClassName="bg-primary text-white"
            previousClassName="px-3 py-2 rounded-md"
            nextClassName="px-3 py-2 rounded-md"
            previousLinkClassName="text-body dark:text-bodydark"
            nextLinkClassName="text-body dark:text-bodydark"
            breakClassName="px-3 py-2"
          />
        </div>
      </div>

      {updatedBroker && (
        <Popup
          title="Update Broker"
          open={openUpdatePopup}
          setOpen={setOpenUpdatePopup}
        >
          <UpdateBroker
            broker={updatedBroker}
            setOpenUpdatePopup={setOpenUpdatePopup}
            openUpdatePopup={openUpdatePopup}
          />
        </Popup>
      )}
    </>
  );
};

export default ApprovedBrokers;
