import React, { useState } from "react";
import { NewPackage } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addPackage } from "../../../store/features/settingSlice";
import { motion } from "framer-motion";

interface Props {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddPackage: React.FC<Props> = ({ setOpenUpdatePopup }) => {
  const [values, setValues] = useState<NewPackage>({
    name: "",
    totalDays: 0,
    discount: 0,
    status: "ACTIVE",
  });
  const { status } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]:
        name === "totalDays" || name === "discount" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addPackage({ ...values, setOpenUpdatePopup }));
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Package Name
          </label>
          <input
            type="text"
            placeholder="Enter package name"
            name="name"
            value={values.name}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Total Days
          </label>
          <input
            type="number"
            placeholder="Enter total days"
            name="totalDays"
            value={values.totalDays}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Discount
          </label>
          <input
            type="number"
            placeholder="Enter discount amount"
            name="discount"
            value={values.discount}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-3 text-sm font-medium text-body dark:text-bodydark">
            Active
            <button
              type="button"
              onClick={() =>
                setValues({
                  ...values,
                  status: values.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                })
              }
              className={`rounded-full relative border border-stroke dark:border-strokedark w-11 h-6 ${
                values.status === "ACTIVE"
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-200 dark:bg-strokedark"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-lg transition-transform mx-1 bg-white ${
                  values.status === "ACTIVE"
                    ? "transform translate-x-full"
                    : "transform translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>

        <div className="flex gap-4 items-center mt-4">
          <motion.button
            type="button"
            onClick={() => {
              setOpenUpdatePopup(false);
              setValues({
                name: "",
                totalDays: 0,
                discount: 0,
                status: "ACTIVE",
              });
            }}
            className="font-medium border border-primary text-primary dark:text-primary px-4 py-2 rounded-md text-sm hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="flex items-center gap-2 text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium rounded-md text-sm px-4 py-2 disabled:opacity-50"
            disabled={status === "loading"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === "loading" && <Spinner width="20px" />}
            Add
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddPackage;
