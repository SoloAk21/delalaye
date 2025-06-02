import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getStaffs } from "../../../store/features/staffSlice";
import withMainComponent from "../../layout/withMainComponent";
import { Staff } from "../../../model/models";
import Popup from "../../layout/Popup";
import Spinner from "../../layout/Spinner";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import AddStaff from "./AddStaff";
import UpdateStaff from "./UpdateStaff";
import { motion } from "framer-motion";

const Staffs: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 bg-whiten dark:bg-boxdark-2 rounded-xl shadow-md min-h-screen">
      <h6 className="text-lg font-bold text-body dark:text-bodydark mb-4">
        Staffs
      </h6>
      <StaffsList />
    </div>
  );
};

const StaffsList: React.FC = () => {
  const { staffs, status } = useAppSelector((state) => state.staff);
  const dispatch = useAppDispatch();
  const [updatedStaff, setUpdatedStaff] = useState<Staff | null>(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(25);
  const perPageOptions = [25, 50, 75, 100];

  useEffect(() => {
    dispatch(getStaffs());
  }, [dispatch]);

  const openInPopup = (staff: Staff) => {
    setUpdatedStaff(staff);
    setOpenUpdatePopup(true);
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastStaff = currentPage * usersPerPage;
  const indexOfFirstStaff = indexOfLastStaff - usersPerPage;
  const paginatedStaffs = filteredStaffs.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );
  const totalPages = Math.ceil(filteredStaffs.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 ml-4">
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staffs..."
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary text-sm"
          />
        </div>
        <motion.button
          onClick={() => setOpenAddPopup(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdAdd size={20} /> Add Staff
        </motion.button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-boxdark">
        <table className="w-full text-sm text-left text-body dark:text-bodydark">
          <thead className="bg-whiten dark:bg-boxdark-2">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-body dark:text-bodydark">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-body dark:text-bodydark">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-body dark:text-bodydark">
                Phone
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-body dark:text-bodydark">
                Role
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-body dark:text-bodydark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  <Spinner width="30px" />
                </td>
              </tr>
            ) : paginatedStaffs.length ? (
              paginatedStaffs.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-primary/5"
                >
                  <td className="px-6 py-4 text-xs font-medium">
                    {staff.fullName}
                  </td>
                  <td className="px-6 py-4 text-xs">{staff.email}</td>
                  <td className="px-6 py-4 text-xs">{staff.phone}</td>
                  <td className="px-6 py-4 text-xs capitalize">{staff.role}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      onClick={() => openInPopup(staff)}
                      className="bg-primary text-white px-3 py-1.5 text-xs rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit
                    </motion.button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-body dark:text-bodydark"
                >
                  No staffs registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center">
          <label
            htmlFor="usersPerPage"
            className="text-body dark:text-bodydark text-xs mr-2"
          >
            Lists Per Page:
          </label>
          <select
            id="usersPerPage"
            className="py-1.5 px-2 border border-stroke dark:border-strokedark rounded-md text-sm text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none"
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            value={usersPerPage}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-strokedark text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          >
            <FaArrowLeft size={12} />
          </motion.button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = currentPage + i;
            if (page > totalPages) return null;
            return (
              <motion.button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-md text-sm ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-boxdark text-body dark:text-bodydark border border-stroke dark:border-strokedark hover:bg-primary/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-strokedark text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          >
            <FaArrowRight size={12} />
          </motion.button>
        </div>
      </div>

      <Popup title="Add Staff" open={openAddPopup} setOpen={setOpenAddPopup}>
        <AddStaff setOpenUpdatePopup={setOpenAddPopup} />
      </Popup>
      {updatedStaff && (
        <Popup
          title="Update Staff"
          open={openUpdatePopup}
          setOpen={setOpenUpdatePopup}
        >
          <UpdateStaff
            staff={updatedStaff}
            setOpenUpdatePopup={setOpenUpdatePopup}
          />
        </Popup>
      )}
    </>
  );
};

export default withMainComponent(Staffs);
