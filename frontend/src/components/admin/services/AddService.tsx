import React, { useState } from "react";
import { NewService } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addService } from "../../../store/features/serviceSlice";
import { motion } from "framer-motion";

interface Props {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddService: React.FC<Props> = ({ setOpenUpdatePopup }) => {
  const [values, setValues] = useState<NewService>({
    name: "",
    description: "",
    serviceRate: 10,
  });
  const { status } = useAppSelector((state) => state.service);
  const dispatch = useAppDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: name === "serviceRate" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addService({
        ...values,
        setOpenUpdatePopup,
        setValues,
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Service Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter service name"
            required
            value={values.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter description"
            value={values.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Service Rate *
          </label>
          <input
            type="number"
            name="serviceRate"
            id="serviceRate"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter service rate"
            required
            value={values.serviceRate}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex gap-4 items-center mt-4">
          <motion.button
            type="button"
            onClick={() => {
              setOpenUpdatePopup(false);
              setValues({
                name: "",
                description: "",
                serviceRate: 10,
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

export default AddService;
