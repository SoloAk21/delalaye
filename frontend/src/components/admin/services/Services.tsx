import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getServices } from "../../../store/features/serviceSlice";
import withMainComponent from "../../layout/withMainComponent";
import { Service } from "../../../model/models";
import Popup from "../../layout/Popup";
import Spinner from "../../layout/Spinner";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import AddService from "./AddService";
import UpdateService from "./UpdateService";
import { motion } from "framer-motion";

const Services: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-whiten dark:bg-boxdark-2 min-h-screen">
      <h1 className="text-xl font-medium text-secondary dark:text-bodydark mb-4">
        Services
      </h1>
      <ServicesList />
    </div>
  );
};

const ServicesList: React.FC = () => {
  const { services, status } = useAppSelector((state) => state.service);
  const dispatch = useAppDispatch();
  const [updatedService, setUpdatedService] = useState<Service | null>(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(25);
  const perPageOptions = [25, 50, 75, 100];

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const openInPopup = (service: Service) => {
    setUpdatedService(service);
    setOpenUpdatePopup(true);
  };

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastService = currentPage * usersPerPage;
  const indexOfFirstService = indexOfLastService - usersPerPage;
  const paginatedServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white dark:bg-boxdark rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-sm text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
          />
        </div>
        <motion.button
          onClick={() => setOpenAddPopup(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdAdd size={20} />
          Add Service
        </motion.button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-body dark:text-bodydark">
          <thead className="bg-whiten dark:bg-boxdark-2">
            <tr>
              <th className="px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Service Name</th>
              <th className="px-4 py-3 font-medium">Service Rate</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <div className="flex justify-center">
                    <Spinner width="30px" />
                  </div>
                </td>
              </tr>
            ) : paginatedServices.length ? (
              paginatedServices.map((service, index) => (
                <tr
                  key={service.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-primary/5"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">{service.name}</td>
                  <td className="px-4 py-3">{service.serviceRate}</td>
                  <td className="px-4 py-3">
                    <motion.button
                      onClick={() => openInPopup(service)}
                      className="bg-primary text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
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
                  colSpan={4}
                  className="py-8 text-center text-sm text-body dark:text-bodydark"
                >
                  No services registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-6">
        <div className="flex items-center gap-2">
          <label
            htmlFor="usersPerPage"
            className="text-sm text-body dark:text-bodydark"
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
            className={`px-3 py-2 rounded-md text-sm ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-strokedark text-gray-400 dark:text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          >
            <FaArrowLeft size={12} />
          </motion.button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = i + 1;
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
            className={`px-3 py-2 rounded-md text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-strokedark text-gray-400 dark:text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          >
            <FaArrowRight size={12} />
          </motion.button>
        </div>
      </div>

      <Popup title="Add Service" open={openAddPopup} setOpen={setOpenAddPopup}>
        <AddService setOpenUpdatePopup={setOpenAddPopup} />
      </Popup>
      {updatedService && (
        <Popup
          title="Update Service"
          open={openUpdatePopup}
          setOpen={setOpenUpdatePopup}
        >
          <UpdateService
            service={updatedService}
            setOpenUpdatePopup={setOpenUpdatePopup}
          />
        </Popup>
      )}
    </div>
  );
};

export default withMainComponent(Services);
