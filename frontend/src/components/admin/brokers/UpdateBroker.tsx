import { ChangeEvent, useEffect, useState } from "react";
import { Broker } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import Compressor from "compressorjs";
import {
  updateBroker,
  updateBrokerProfilePic,
} from "../../../store/features/brokerSlice";
import convertToBase64 from "../../../utils/convertToBase64";
import { toast } from "sonner";
import validatePhoneNumber from "../../../utils/validatePhone";
import { getServices } from "../../../store/features/serviceSlice";
import { motion } from "framer-motion";

interface Props {
  broker: Broker;
  openUpdatePopup: boolean;
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const maxSize = 70 * 1024; // 70kb

const UpdateBroker: React.FC<Props> = ({
  broker,
  setOpenUpdatePopup,
  openUpdatePopup,
}) => {
  const { services } = useAppSelector((state) => state.service);
  const { status } = useAppSelector((state) => state.broker);
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<Broker>({
    id: 0,
    fullName: "",
    email: "",
    phone: "",
    photo: "",
    password: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validPhone, setValidPhone] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (broker) {
      setValues({
        id: broker.id || 0,
        fullName: broker.fullName || "",
        email: broker.email || "",
        phone: broker.phone || "",
        photo: broker.photo || "",
        password: "",
      });
      if (broker.services)
        setSelectedServices(broker.services.map((service) => service.name));
    }
  }, [broker, openUpdatePopup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setValidPhone(validatePhoneNumber(value));
    }
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSize) {
        setErrorMessage(
          "File size exceeds the limit. Please choose a smaller file. Max (70kb)"
        );
        setValues({ ...values, photo: "" });
      } else {
        setErrorMessage("");
        new Compressor(file, {
          quality: 0.6,
          async success(result) {
            const base64 = (await convertToBase64(result as File)).slice(
              "data:image/jpeg;base64,".length
            );
            setValues({ ...values, photo: base64 });
            dispatch(
              updateBrokerProfilePic({
                photo: base64,
                setValues,
                id: Number(broker.id!),
              })
            );
          },
          error(err) {
            toast(err.message);
          },
        });
      }
    } else {
      setValues({ ...values, photo: "" });
    }
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedServices((prev) =>
      prev.includes(selectedValue)
        ? prev.filter((item) => item !== selectedValue)
        : [...prev, selectedValue]
    );
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validPhone) {
      dispatch(
        updateBroker({
          id: Number(broker.id),
          updatedBroker: values,
          setOpenUpdatePopup,
          selectedServices: services
            .filter((service) => selectedServices.includes(service.name))
            .map((service) => service.id),
        })
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl">
      <form onSubmit={handleUpdate} className="space-y-4">
        {!broker.photo && !values.photo ? (
          <div>
            <label className="flex flex-col items-center justify-center w-36 h-36 rounded-full border-2 border-dashed border-stroke dark:border-strokedark cursor-pointer bg-gray-50 dark:bg-boxdark">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Profile photo
                </p>
              </div>
              <input
                id="serviceChargereceiptPhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </label>
            {errorMessage && (
              <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
            )}
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <div className="relative">
              <img
                className="w-36 h-36 rounded-full"
                src={`data:image/jpeg;base64,${values.photo}`}
                alt={broker.fullName}
                loading="lazy"
              />
              {status === "loading" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Spinner width="24px" />
                </div>
              )}
            </div>
            <label
              htmlFor="profilePhoto"
              className="bg-primary px-4 py-2 rounded-md text-sm text-white font-medium cursor-pointer hover:bg-primary/90"
            >
              Change Photo
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />
            {errorMessage && (
              <p className="text-xs text-red-600">{errorMessage}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Name *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter name"
            required
            value={values.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            placeholder="Enter email"
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
            value={broker.phone}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          {!validPhone && (
            <p className="text-sm text-red-600 mt-1">
              Phone number must start with country code and be 10-13 digits.
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-body dark:text-bodydark mb-1">
            Services
          </label>
          <select
            id="services"
            multiple
            value={selectedServices}
            onChange={handleServiceChange}
            className="w-full py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark bg-white dark:bg-boxdark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
          >
            {services.length > 0 &&
              services.map((service) => (
                <option key={service.id} value={service.name} className="p-2">
                  {service.name}
                </option>
              ))}
          </select>
          <p className="text-sm font-medium text-body dark:text-bodydark mt-2">
            Selected Services:{" "}
            <span className="font-semibold text-primary">
              {selectedServices.join(", ")}
            </span>
          </p>
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
                photo: "",
                services: [],
              });
              setSelectedServices([]);
            }}
            className="font-medium border border-primary text-primary dark:text-primary px-4 py-2 rounded-md text-sm hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="flex items-center gap-2 text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium rounded-md text-sm  py-2 disabled px-2 disabled:opacity-50"
            disabled={status === "loading"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === "loading" && <Spinner width="24px" />}
            Update
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBroker;
