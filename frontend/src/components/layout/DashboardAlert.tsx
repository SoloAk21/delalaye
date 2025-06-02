import React from "react";
import { useAppSelector } from "../../store/store";
import { MdInfo } from "react-icons/md";
import { motion } from "framer-motion";

const DashboardAlert: React.FC = () => {
  const { alerts } = useAppSelector((state) => state.alert);

  return (
    <div className="fixed top-20 right-2 z-50 space-y-2">
      {alerts.length > 0 &&
        alerts.map((alert) => (
          <motion.div
            key={alert.id}
            className="flex items-center p-4 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <MdInfo className="flex-shrink-0 w-5 h-5 mr-3" />
            <div>
              {alert.title && (
                <span className="font-medium">{alert.title}</span>
              )}{" "}
              {alert.msg}
            </div>
          </motion.div>
        ))}
    </div>
  );
};

export default DashboardAlert;
