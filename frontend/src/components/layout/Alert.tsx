import React from "react";
import { useAppSelector } from "../../store/store";
import { MdInfo } from "react-icons/md";

const Alert: React.FC = () => {
  const { alerts } = useAppSelector((state) => state.alert);

  return (
    <>
      <div className="absolute top-2 right-2">
        {alerts.length > 0 &&
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
            >
              <MdInfo className="flex-shrink-0 inline-block w-5 h-5 mr-3" />
              <div>
                {alert.title && (
                  <span className="font-medium">{alert.title}</span>
                )}{" "}
                {alert.msg}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Alert;
