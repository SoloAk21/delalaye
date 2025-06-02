import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ConfirmModal } from "../../../model/models";
import {
  approveBroker,
  deleteBroker,
  getRegisteredBrokers,
  searchRegisteredBrokers,
} from "../../../store/features/brokerSlice";
import ConfirmDialog from "../../layout/ConfirmDialog";
import ReactPaginate from "react-paginate";
import Spinner from "../../layout/Spinner";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";

const NotApprovedBrokers: React.FC = () => {
  const dispatch = useAppDispatch();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModal>({
    open: false,
    title: "Delete Broker",
    subTitle: "Are you sure you want to delete this broker?",
    type: "delete",
    buttonLabel: "Delete",
    onConfirm: () => {},
  });

  const { status, notapprovedBrokers, total } = useAppSelector(
    (state) => state.broker
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [brokersPerPage, setBrokersPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const brokersPerPageOptions = [25, 50, 75, 100];

  useEffect(() => {
    dispatch(
      getRegisteredBrokers({ _limit: brokersPerPage, _page: currentPage })
    );
  }, [dispatch, currentPage, brokersPerPage]);

  const totalPages = Math.ceil(total / brokersPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleApprove = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Approve Broker",
      subTitle: "Are you sure you want to approve this broker?",
      type: "approve",
      buttonLabel: "Approve",
      onConfirm: () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        dispatch(approveBroker({ id }));
      },
    });
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Delete Broker",
      subTitle: "Are you sure you want to delete this broker?",
      type: "delete",
      buttonLabel: "Delete",
      onConfirm: () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        dispatch(deleteBroker(id));
      },
    });
  };

  const debouncedSearchRegisteredBrokers = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim() === "") {
        setCurrentPage(1);
        dispatch(getRegisteredBrokers({ _limit: brokersPerPage, _page: 1 }));
        return;
      }
      dispatch(
        searchRegisteredBrokers({
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
    debouncedSearchRegisteredBrokers(newQuery);
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
              <th className="px-6 py-3 text-xs font-semibold">No</th>
              <th className="px-6 py-3 text-xs font-semibold">Broker Name</th>
              <th className="px-6 py-3 text-xs font-semibold">Phone</th>
              <th className="px-6 py-3 text-xs font-semibold">Email</th>
              <th className="px-6 py-3 text-xs font-semibold">Services</th>
              <th className="px-6 py-3 text-xs font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={6} className="py-6 text-center">
                  <Spinner width="30px" />
                </td>
              </tr>
            ) : notapprovedBrokers.length ? (
              notapprovedBrokers.map((broker, index) => {
                const brokerNumber =
                  (currentPage - 1) * brokersPerPage + index + 1;
                return (
                  <tr
                    key={broker.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-primary/5"
                  >
                    <td className="px-6 py-4 text-xs">{brokerNumber}</td>
                    <td className="px-6 py-4 text-xs">{broker.fullName}</td>
                    <td className="px-6 py-4 text-xs">{broker.phone}</td>
                    <td className="px-6 py-4 text-xs">{broker.email}</td>
                    <td className="px-6 py-4 text-xs">
                      {broker.services?.length || 0}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <motion.button
                        onClick={() => handleApprove(broker.id!)}
                        className="bg-primary text-white px-4 py-2 rounded-md text-xs hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(broker.id!)}
                        className="border border-red-600 text-red-600 px-4 py-2 rounded-md text-xs hover:bg-red-600/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
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

      <ConfirmDialog
        title={confirmDialog.title}
        subTitle={confirmDialog.subTitle}
        open={confirmDialog.open}
        onConfirm={confirmDialog.onConfirm}
        setConfirmDialog={setConfirmDialog}
        buttonLabel={confirmDialog.buttonLabel}
        type={confirmDialog.type}
      />
    </>
  );
};

export default NotApprovedBrokers;
