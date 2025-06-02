import React from "react";
import { ConfirmModal } from "../../model/models";
import { motion } from "framer-motion";

interface Props extends ConfirmModal {
  setConfirmDialog: React.Dispatch<React.SetStateAction<ConfirmModal>>;
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  onConfirm,
  title,
  subTitle,
  setConfirmDialog,
  type,
  buttonLabel,
}: Props) => {
  const buttonStyle =
    type === "approve"
      ? "bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/50"
      : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500/50";

  return (
    <motion.div
      id="popup-modal"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${
        open ? "block" : "hidden"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full max-w-md">
        <div className="relative bg-white dark:bg-boxdark rounded-lg shadow-lg">
          <motion.button
            onClick={() =>
              setConfirmDialog({
                open: false,
                title,
                subTitle,
                onConfirm,
                buttonLabel,
                type,
              })
            }
            className="absolute top-3 right-2.5 text-body dark:text-bodydark bg-transparent hover:bg-gray-200 dark:hover:bg-strokedark hover:text-gray-900 dark:hover:text-white rounded-lg text-sm p-1.5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </motion.button>
          <div className="p-6 text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 dark:text-gray-500 w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-body dark:text-bodydark">
              {subTitle}
            </h3>
            <motion.button
              onClick={onConfirm}
              type="button"
              className={`${buttonStyle} text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {buttonLabel}
            </motion.button>
            <motion.button
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  title,
                  subTitle,
                  onConfirm,
                  buttonLabel,
                  type,
                })
              }
              type="button"
              className="text-body dark:text-bodydark bg-white dark:bg-boxdark hover:bg-gray-100 dark:hover:bg-strokedark border border-stroke dark:border-strokedark rounded-lg text-sm font-medium px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-strokedark"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmDialog;
