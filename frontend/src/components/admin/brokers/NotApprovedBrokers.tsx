import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {  ConfirmModal } from "../../../model/models";
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

const NotApprovedBrokers = () => {
  const dispatch = useAppDispatch();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmModal>({
    open: false,
    title: "Delete broker",
    subTitle: "Are you sure you want to delete this broker",
    type: "delete",
    buttonLabel: "Delete",
    onConfirm: () => {},
  });

  const { status, notapprovedBrokers, total,  } = useAppSelector(
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
  }, [currentPage,brokersPerPage]);


  const totalPages: number = Math.ceil(total / brokersPerPage);
  const handlePageChange = ({ selected }: { selected: number }) => {
    console.log(`selected ${selected}`);
    setCurrentPage(selected + 1);
  };
  const handleApprove = (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Approve broker",
      subTitle: "Are you sure you want to approve this broker",
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
      title: "Delete broker",
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
        if (searchQuery.trim() === '') {
          setCurrentPage(1);
          dispatch(getRegisteredBrokers({_limit:brokersPerPage,_page:1}))
            return;
        }
        dispatch(searchRegisteredBrokers({_limit:brokersPerPage,_page:currentPage,search:searchQuery,searchBy:'fullName'}));
    }, 500), // 500 milliseconds debounce delay
    [dispatch]
);
const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  const newQuery = e.target.value;
  setSearchQuery(newQuery);
        debouncedSearchRegisteredBrokers(newQuery);

}

  return (
    <>
      <div className="w-fit my-2 border  border-slate-400 rounded-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search brokers..."
          className="text-black w-full px-4 py-2 text-sm"
        />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-1">
        <table
          id="registeredUsers"
          className="w-full text-sm text-left text-gray-800"
        >
          <thead className="text-xs text-slate-400  bg-tomoca">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Broker name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Services
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {status === "loading" ? (
              <tr>
                <th colSpan={6}>
                  <Spinner />
                </th>
              </tr>
            ) : (
              <>
                {notapprovedBrokers.map((broker, index) => {
                  const brokerNumber =
                    (currentPage - 1) * brokersPerPage + index + 1;
                  return (
                    <tr key={broker.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {brokerNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {broker.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {broker.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {broker.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {broker.services?.length}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            handleApprove(broker.id!);
                          }}
                          className="font-medium text-white bg-primary px-4 py-2 rounded"
                        >
                          Approve
                        </button>
                        <button
                          className="border border-red-900 px-4 py-2 rounded text-red-900 hover:bg-red-200 ml-4"
                          onClick={() => handleDelete(broker.id!)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex items-center mx-4">
          <label htmlFor="brokersPerPage" className="text-gray-600 text-xs">
            List Per Page:
          </label>
          <select
            className="text-sm p-1.5"
            onChange={(e) => setBrokersPerPage(Number(e.target.value))}
            id="brokersPerPage"
            value={brokersPerPage}
          >
            {brokersPerPageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="pagination-container">
          <ReactPaginate
            previousLabel={`< `}
            nextLabel={` >`}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
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
