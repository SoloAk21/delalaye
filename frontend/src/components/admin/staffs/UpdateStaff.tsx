import React, { useEffect, useState } from "react";
import { Staff } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { updateStaff } from "../../../store/features/staffSlice";
import { motion } from "framer-motion";

interface Props {
  staff: Staff;
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateStaff: React.FC<Props> = ({ staff, setOpenUpdatePopup }) => {
  const [values, setValues] = useState<Staff>({
    id: 0,
    fullName: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
  });
  const { status } = useAppSelector((state) => state.staff);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\s/g, "");
    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    if (staff) {
      const { id, fullName, email, phone, role } = staff;
      setValues({
        id,
        fullName,
        email,
        phone,
        role: role || "admin",
        password: "",
      });
    }
  }, [staff]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateStaff({
        id: Number(staff.id),
        updatedStaff: values,
        setOpenUpdatePopup,
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl">
      <form onSubmit={handleUpdate} className="space-y-4">
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
        <div className="flex gap-4 items-center mt-4">
          <motion.button
            type="button"
            onClick={() => {
              setOpenUpdatePopup(false);
              setValues({
                id: 0,
                fullName: "",
                email: "",
                phone: "",
                role: "admin",
                password: "",
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
            Update
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStaff;
