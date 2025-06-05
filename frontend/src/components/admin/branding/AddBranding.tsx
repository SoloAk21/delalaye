import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateBranding } from "../../../store/features/brandingSlice";
import Spinner from "../../layout/Spinner";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FiUpload, FiImage } from "react-icons/fi";

// Define the Branding interface if not imported from elsewhere
interface Branding {
  primaryColor: string;
  secondaryColor: string;
  darkModeDefault: boolean;
  logoLight?: string;
  logoDark?: string;
}

interface Props {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBranding: React.FC<Props> = ({ setOpenUpdatePopup }) => {
  const { branding, status } = useAppSelector((state) => state.branding);
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<Partial<Branding>>({
    primaryColor: "#3C50E0",
    secondaryColor: "#64748B",
    darkModeDefault: false,
  });
  const [primaryColorInput, setPrimaryColorInput] = useState("#3C50E0");
  const [secondaryColorInput, setSecondaryColorInput] = useState("#64748B");
  const [logoLight, setLogoLight] = useState<File | null>(null);
  const [logoDark, setLogoDark] = useState<File | null>(null);
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);

  // Initialize with branding slice data
  useEffect(() => {
    if (branding) {
      setValues({
        primaryColor: branding.primaryColor || "#3C50E0",
        secondaryColor: branding.secondaryColor || "#64748B",
        darkModeDefault: branding.darkModeDefault || false,
      });
      setPrimaryColorInput(branding.primaryColor || "#3C50E0");
      setSecondaryColorInput(branding.secondaryColor || "#64748B");

      // Set previews from branding slice (only if URLs are valid and not already set)
      if (branding.logoLight && !logoLightPreview) {
        setLogoLightPreview(branding.logoLight);
      }
      if (branding.logoDark && !logoDarkPreview) {
        setLogoDarkPreview(branding.logoDark);
      }
    }
  }, [branding]);

  // Clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      if (logoLightPreview && logoLightPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoLightPreview);
      }
      if (logoDarkPreview && logoDarkPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoDarkPreview);
      }
    };
  }, [logoLightPreview, logoDarkPreview]);

  const validateAndConvertColor = (input: string): string | null => {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

    if (hexRegex.test(input)) {
      if (input.length === 4) {
        return `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`.toUpperCase();
      }
      return input.toUpperCase();
    } else if (rgbRegex.test(input)) {
      const match = input.match(rgbRegex);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        if (r <= 255 && g <= 255 && b <= 255) {
          return `#${((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        }
      }
    }
    return null;
  };

  const handleColorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "primary" | "secondary"
  ) => {
    const { value } = e.target;
    if (type === "primary") {
      setPrimaryColorInput(value);
      const validColor = validateAndConvertColor(value);
      if (validColor) {
        setValues({ ...values, primaryColor: validColor });
      }
    } else {
      setSecondaryColorInput(value);
      const validColor = validateAndConvertColor(value);
      if (validColor) {
        setValues({ ...values, secondaryColor: validColor });
      }
    }
  };

  const handleColorPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "primary" | "secondary"
  ) => {
    const { value } = e.target;
    if (type === "primary") {
      setValues({ ...values, primaryColor: value });
      setPrimaryColorInput(value);
    } else {
      setValues({ ...values, secondaryColor: value });
      setSecondaryColorInput(value);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "light" | "dark"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/svg+xml"].includes(file.type)) {
        toast.error("Only PNG and SVG files are allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);

      if (type === "light") {
        setLogoLight(file);
        setLogoLightPreview(previewUrl);
      } else {
        setLogoDark(file);
        setLogoDarkPreview(previewUrl);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const primaryValid = validateAndConvertColor(primaryColorInput);
    const secondaryValid = validateAndConvertColor(secondaryColorInput);

    if (!primaryValid || !secondaryValid) {
      toast.error("Please enter valid hex or RGB colors");
      return;
    }

    const formData = new FormData();
    formData.append("primaryColor", primaryValid);
    formData.append("secondaryColor", secondaryValid);
    formData.append("darkModeDefault", String(values.darkModeDefault || false));
    if (logoLight) formData.append("logoLight", logoLight);
    if (logoDark) formData.append("logoDark", logoDark);

    dispatch(updateBranding({ brandingData: formData, setOpenUpdatePopup }));
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-xl relative">
      <form onSubmit={handleSubmit} className="py-4 space-y-6">
        {/* Color Inputs */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
          <div className="w-full sm:w-1/2">
            <label
              htmlFor="primaryColor"
              className="block mb-1 text-sm font-medium text-body dark:text-bodydark"
            >
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={values.primaryColor}
                onChange={(e) => handleColorPickerChange(e, "primary")}
                className="w-10 h-10 rounded-md border border-stroke dark:border-strokedark cursor-pointer"
              />
              <input
                type="text"
                id="primaryColor"
                value={primaryColorInput}
                onChange={(e) => handleColorInputChange(e, "primary")}
                placeholder="e.g., #3C50E0 or rgb(60, 80, 224)"
                className="block py-2 px-3 w-full text-sm bg-transparent border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
              />
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <label
              htmlFor="secondaryColor"
              className="block mb-1 text-sm font-medium text-body dark:text-bodydark"
            >
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={values.secondaryColor}
                onChange={(e) => handleColorPickerChange(e, "secondary")}
                className="w-10 h-10 rounded-md border border-stroke dark:border-strokedark cursor-pointer"
              />
              <input
                type="text"
                id="secondaryColor"
                value={secondaryColorInput}
                onChange={(e) => handleColorInputChange(e, "secondary")}
                placeholder="e.g., #64748B or rgb(100, 116, 139)"
                className="block py-2 px-3 w-full text-sm bg-transparent border border-stroke dark:border-strokedark rounded-md text-body dark:text-bodydark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="pb-4">
          <label className="flex items-center gap-3 text-sm font-medium text-body dark:text-bodydark cursor-pointer">
            Dark Mode Default
            <motion.div
              className="relative w-12 h-6 rounded-full"
              animate={{
                backgroundColor: values.darkModeDefault
                  ? values.primaryColor || "#3C50E0"
                  : "#E5E7EB",
              }}
              transition={{ duration: 0.3 }}
              onClick={() =>
                setValues({
                  ...values,
                  darkModeDefault: !values.darkModeDefault,
                })
              }
              role="switch"
              tabIndex={0}
              aria-checked={values.darkModeDefault}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setValues({
                    ...values,
                    darkModeDefault: !values.darkModeDefault,
                  });
                }
              }}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{ x: values.darkModeDefault ? 24 : 0 }}
              />
            </motion.div>
          </label>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(
            [
              {
                label: "Light Logo",
                id: "logoLight",
                preview: logoLightPreview,
                type: "light" as "light",
              },
              {
                label: "Dark Logo",
                id: "logoDark",
                preview: logoDarkPreview,
                type: "dark" as "dark",
              },
            ] as {
              label: string;
              id: string;
              preview: string | null;
              type: "light" | "dark";
            }[]
          ).map(({ label, id, preview, type }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white"
              >
                {label}
              </label>

              <label
                htmlFor={id}
                className="flex items-center justify-center gap-2 w-full h-12 px-4 text-sm font-medium text-white bg-primary rounded-lg cursor-pointer hover:bg-primary-dark transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <FiUpload className="w-4 h-4" />
                Upload {label}
                <input
                  id={id}
                  type="file"
                  accept="image/png,image/svg+xml"
                  onChange={(e) => handleFileChange(e, type)}
                  className="hidden"
                />
              </label>

              <div className="mt-3">
                <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <FiImage className="w-4 h-4" />
                  Preview:
                </p>
                {preview ? (
                  <div
                    className={`relative w-full h-24 rounded-lg p-2 border flex items-center justify-center ${
                      type === "light"
                        ? "bg-white border-gray-300"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  >
                    <img
                      src={preview}
                      alt={`${label} Preview`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <span className="text-gray-500 dark:text-gray-400">
                      No file selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex justify-center items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? <Spinner /> : "Save Branding"}
        </button>
      </form>
    </div>
  );
};

export default AddBranding;
