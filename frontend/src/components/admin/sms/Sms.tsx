import { ChangeEvent, useEffect, useState } from "react";
import withMainComponent from "../../layout/withMainComponent";
import { getServices } from "../../../store/features/serviceSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { sendSms } from "../../../store/features/settingSlice";
import { motion } from "framer-motion";

const Sms: React.FC = () => {
  const { services } = useAppSelector((state) => state.service);
  const { status } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();

  const [to, setTo] = useState<"brokers" | "users">("brokers");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [smsMessage, setSmsMessage] = useState<string>("");

  const resetValues = () => {
    setSelectedServices([]);
    setSmsMessage("");
  };

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedServices((prev) =>
      prev.includes(selectedValue)
        ? prev.filter((item) => item !== selectedValue)
        : [...prev, selectedValue]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      sendSms({
        to,
        services: selectedServices.map((serviceId) => Number(serviceId)),
        message: smsMessage,
        resetValues,
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 pl-4 ml-4 bg-white dark:bg-boxdark rounded-lg shadow-md min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-lg font-semibold text-body dark:text-bodydark mb-4">
          Send SMS
        </h1>
        <div>
          <h3 className="text-sm font-medium text-body dark:text-bodydark mb-2">
            Select Recipients
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center px-3 py-2 border border-stroke dark:border-strokedark rounded-md bg-white dark:bg-boxdark cursor-pointer">
              <input
                checked={to === "brokers"}
                id="bordered-radio-1"
                type="radio"
                name="recipients"
                className="w-4 h-4 accent-primary bg-white dark:bg-boxdark border-gray-300 focus:ring-primary checked:bg-primary"
                onChange={() => setTo("brokers")}
              />
              <span className="ml-2 text-sm text-body dark:text-bodydark">
                All Brokers
              </span>
            </label>
            <label className="flex items-center px-3 py-2 border border-stroke dark:border-strokedark rounded-md bg-white dark:bg-boxdark cursor-pointer">
              <input
                checked={to === "users"}
                id="bordered-radio-2"
                type="radio"
                name="recipients"
                className="w-4 h-4 accent-primary bg-white dark:bg-boxdark border-gray-300 focus:ring-primary checked:bg-primary"
                onChange={() => setTo("users")}
              />
              <span className="ml-2 text-sm text-body dark:text-bodydark">
                All Users
              </span>
            </label>
          </div>
        </div>

        {to === "brokers" && (
          <div>
            <label
              htmlFor="services"
              className="block text-sm font-medium text-body dark:text-bodydark mb-2"
            >
              Select by Service
            </label>
            <select
              id="services"
              multiple
              className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-sm text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
              value={selectedServices}
              onChange={handleServiceChange}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id} className="p-1">
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="sms-message"
            className="block text-sm font-medium text-body dark:text-bodydark mb-2"
          >
            Enter SMS
          </label>
          <textarea
            id="sms-message"
            value={smsMessage}
            placeholder="Type message..."
            required
            onChange={(e) => setSmsMessage(e.target.value)}
            className="w-full h-48 py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-sm text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === "loading"}
          className="text-sm font-medium text-primary hover:text-primary/90 dark:hover:text-primary/90 py-2 px-4 rounded border border-primary dark:border-primary hover:bg-primary/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === "loading" ? <Spinner width="20px" /> : "Send"}
        </motion.button>
      </form>
    </div>
  );
};

export default withMainComponent(Sms);
