import React from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";

interface Props {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<Props> = ({ title, children, open, setOpen }) => {
  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } fixed inset-0 z-50 overflow-auto bg-black/30 items-center justify-center p-4 sm:p-6`}
    >
      <motion.div
        className="flex flex-col w-full max-w-lg bg-white dark:bg-boxdark rounded-xl shadow-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between w-full border-b border-stroke dark:border-strokedark p-4">
          <h6 className="text-lg font-medium text-body dark:text-bodydark flex-grow">
            {title}
          </h6>
          <motion.button
            onClick={() => setOpen(false)}
            className="text-white bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 font-medium rounded-md text-sm p-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdClose size={20} />
          </motion.button>
        </div>
        <div className="p-4 w-full">{children}</div>
      </motion.div>
    </div>
  );
};

export default Popup;
