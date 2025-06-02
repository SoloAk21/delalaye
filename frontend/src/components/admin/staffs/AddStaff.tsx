import React, { useState } from "react";
import { NewStaff } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addStaff } from "../../../store/features/staffSlice";
import { motion } from "framer-motion";

interface Props {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddStaff: React.FC<Props> = ({ setOpenUpdatePopup }) => {
  const [values, setValues] = useState<NewStaff>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
  });
  const { status } = useAppSelector((state) => state.staff);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addStaff({
        staff: values,
        setOpenUpdatePopup,
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Staff Name *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter staff name"
            required
            value={values.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter email"
            required
            value={values.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Phone *
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter phone number"
            required
            value={values.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Role *
          </label>
          <select
            name="role"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            required
            value={values.role}
            onChange={handleInputChange}
          >
            <option value="admin">Admin</option>
            <option value="cs">Customer Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter password"
            required
            value={values.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex gap-4 items-center mt-4">
          <motion.button
            type="button"
            onClick={() => {
              setOpenUpdatePopup(false);
              setValues({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                role: "admin",
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

export default AddStaff;
