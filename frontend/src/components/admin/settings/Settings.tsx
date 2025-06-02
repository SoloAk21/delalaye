import React, { useState, useEffect } from "react";
import withMainComponent from "../../layout/withMainComponent";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import {
  getSettings,
  updateDailyFee,
  updatePackage,
  updatePackageStatus,
} from "../../../store/features/settingSlice";
import { Package } from "../../../model/models";
import Popup from "../../layout/Popup";
import AddPackage from "./AddPackage";
import Spinner from "../../layout/Spinner";
import { motion } from "framer-motion";

const Setting: React.FC = () => {
  const { dailyFee, packages, status, task } = useAppSelector(
    (state) => state.setting
  );
  const dispatch = useAppDispatch();
  const [dailyFeeAmount, setDailyFee] = useState<number>(0);
  const [values, setValues] = useState<Package>({
    id: 0,
    discount: 0,
    name: "",
    status: "ACTIVE",
    totalDays: 0,
  });
  const [editPackage, setEditPackage] = useState<boolean>(false);
  const [editDailyFee, setEditDailyFee] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleEditPackage = (pkg: Package) => {
    setEditPackage(true);
    setValues(pkg);
  };

  const handleToggleActive = (id: number) => {
    setValues({ ...values, id });
    dispatch(updatePackageStatus(id));
  };

  const handleUpdatePackage = () => {
    dispatch(updatePackage({ updatedPackage: values, setEditPackage }));
  };

  return (
    <div className="p-4 sm:p-6 ml-4  bg-whiten dark:bg-boxdark-2 min-h-screen">
      <h1 className="text-lg font-bold mb-4 text-body dark:text-bodydark">
        Settings
      </h1>
      <h3 className="block text-sm mb-2 font-semibold text-body dark:text-bodydark">
        Daily Fee Charge Amount
      </h3>

      {editDailyFee ? (
        <form
          className="my-2 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(
              updateDailyFee({ dailyFee: dailyFeeAmount, setEditDailyFee })
            );
          }}
        >
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="number"
              value={dailyFeeAmount}
              onChange={(e) => setDailyFee(Number(e.target.value))}
              className="border border-stroke dark:border-strokedark rounded-md w-24 py-2 px-4 text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            />
            <div className="flex gap-2 items-center">
              <motion.button
                type="button"
                onClick={() => setEditDailyFee(false)}
                className="font-medium border border-primary text-primary dark:text-primary px-4 py-2 rounded-md text-sm hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={status === "loading" && task === "dailyFee"}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors font-medium text-sm disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === "loading" && task === "dailyFee" && (
                  <Spinner width="20px" />
                )}
                Update
              </motion.button>
            </div>
          </div>
        </form>
      ) : (
        <div className="my-2 text-left">
          <div className="flex space-x-4 mb-4">
            <input
              type="number"
              value={dailyFee}
              readOnly
              className="border border-stroke dark:border-strokedark rounded-md w-24 py-2 px-4 text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none"
            />
            <motion.button
              onClick={() => {
                setEditDailyFee(true);
                setDailyFee(dailyFee);
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update
            </motion.button>
          </div>
        </div>
      )}

      <hr className="my-8 border-stroke dark:border-strokedark" />

      <div className="flex justify-between w-full items-center">
        <h3 className="text-sm mb-4 font-semibold text-body dark:text-bodydark">
          Packages
        </h3>
        <motion.button
          onClick={() => setOpenAddPopup(true)}
          className="mb-4 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md flex gap-1 items-center text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoIosAdd size={20} />
          Create Package
        </motion.button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 bg-white dark:bg-boxdark">
        <table className="w-full text-sm text-left text-body dark:text-bodydark">
          <thead className="bg-whiten dark:bg-boxdark-2">
            <tr>
              <th className="py-3 px-4 border-b border-stroke dark:border-strokedark text-left font-semibold">
                Package Title
              </th>
              <th className="py-3 px-4 border-b border-stroke dark:border-strokedark text-left font-semibold">
                Days
              </th>
              <th className="py-3 px-4 border-b border-stroke dark:border-strokedark text-left font-semibold">
                Discount
              </th>
              <th className="py-3 px-4 border-b border-stroke dark:border-strokedark text-left font-semibold">
                Active
              </th>
              <th className="py-3 px-4 border-b border-stroke dark:border-strokedark text-left font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {packages &&
              packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-primary/5"
                >
                  {editPackage && values.id === pkg.id ? (
                    <>
                      <td className="py-3 px-4 text-left">
                        <input
                          type="text"
                          value={values.name}
                          onChange={(e) =>
                            setValues({ ...values, name: e.target.value })
                          }
                          className="border border-stroke dark:border-strokedark px-2 py-1 rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary w-full"
                        />
                      </td>
                      <td className="py-3 px-4 text-left">
                        <input
                          type="number"
                          value={values.totalDays}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              totalDays: Number(e.target.value),
                            })
                          }
                          className="border border-stroke dark:border-strokedark px-2 py-1 rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary w-full"
                        />
                      </td>
                      <td className="py-3 px-4 text-left">
                        <input
                          type="number"
                          value={values.discount}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              discount: Number(e.target.value),
                            })
                          }
                          className="border border-stroke dark:border-strokedark px-2 py-1 rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary w-full"
                        />
                      </td>
                      <td className="py-3 px-4 text-left"></td>
                      <td className="py-3 px-4 text-left flex gap-2">
                        <motion.button
                          onClick={handleUpdatePackage}
                          className="bg-primary text-white text-sm px-3 py-1 rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={() => setEditPackage(false)}
                          className="border border-primary text-primary dark:text-primary text-sm px-3 py-1 rounded-md hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-left">{pkg.name}</td>
                      <td className="py-3 px-4 text-left">{pkg.totalDays}</td>
                      <td className="py-3 px-4 text-left">{pkg.discount}</td>
                      <td className="py-3 px-4 text-left">
                        {status === "loading" &&
                        task === "status_update" &&
                        values.id === pkg.id ? (
                          <Spinner width="20px" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(pkg.id)}
                            className={`rounded-full relative border border-stroke dark:border-strokedark w-11 h-6 ${
                              pkg.status === "ACTIVE"
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-gray-200 dark:bg-strokedark"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded-lg transition-transform mx-1 bg-white ${
                                pkg.status === "ACTIVE"
                                  ? "transform translate-x-full"
                                  : "transform translate-x-0"
                              }`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <CiEdit
                          className="cursor-pointer text-primary dark:text-primary hover:text-primary/80"
                          size={20}
                          onClick={() => handleEditPackage(pkg)}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Popup title="Add Package" open={openAddPopup} setOpen={setOpenAddPopup}>
        <AddPackage setOpenUpdatePopup={setOpenAddPopup} />
      </Popup>
    </div>
  );
};

export default withMainComponent(Setting);
