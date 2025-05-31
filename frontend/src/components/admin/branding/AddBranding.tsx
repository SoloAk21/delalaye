import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateBranding } from "../../../store/features/brandingSlice";
import Spinner from "../../layout/Spinner";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { FiUpload } from "react-icons/fi";
import { Branding } from "../../../model/models";

interface Props {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBranding: React.FC<Props> = ({ setOpenUpdatePopup }) => {
  const { branding, status } = useAppSelector((state) => state.branding);
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<Partial<Branding>>({
    primaryColor: "#FFA05C",
    secondaryColor: "#898989",
    darkModeDefault: false,
  });
  const [primaryColorInput, setPrimaryColorInput] = useState("#FFA05C");
  const [secondaryColorInput, setSecondaryColorInput] = useState("#898989");
  const [logoLight, setLogoLight] = useState<File | null>(null);
  const [logoDark, setLogoDark] = useState<File | null>(null);
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);

  useEffect(() => {
    if (branding) {
      setValues({
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        darkModeDefault: branding.darkModeDefault,
      });
      setPrimaryColorInput(branding.primaryColor);
      setSecondaryColorInput(branding.secondaryColor);
      setLogoLightPreview(branding.logoLight || null);
      setLogoDarkPreview(branding.logoDark || null);
    }
  }, [branding]);

  useEffect(() => {
    // Clean up object URLs
    return () => {
      if (logoLightPreview && !branding?.logoLight)
        URL.revokeObjectURL(logoLightPreview);
      if (logoDarkPreview && !branding?.logoDark)
        URL.revokeObjectURL(logoDarkPreview);
    };
  }, [logoLightPreview, logoDarkPreview, branding]);

  const validateAndConvertColor = (input: string): string | null => {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

    if (hexRegex.test(input)) {
      if (input.length === 4) {
        return `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`;
      }
      return input;
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
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="py-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
          {/* Primary Color */}
          <div className="relative z-0 w-full sm:w-1/2 group">
            <label
              htmlFor="primaryColor"
              className="block mb-1 text-sm text-slate-500 dark:text-gray-400"
            >
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={values.primaryColor}
                onChange={(e) => handleColorPickerChange(e, "primary")}
                className="w-10 h-10 rounded-md border cursor-pointer"
              />
              <input
                type="text"
                name="primaryColor"
                id="primaryColor"
                value={primaryColorInput}
                onChange={(e) => handleColorInputChange(e, "primary")}
                placeholder="e.g., #098761 or rgb(9, 135, 97)"
                className="block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="relative z-0 w-full sm:w-1/2 group">
            <label
              htmlFor="secondaryColor"
              className="block mb-1 text-sm text-slate-500 dark:text-gray-400"
            >
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={values.secondaryColor}
                onChange={(e) => handleColorPickerChange(e, "secondary")}
                className="w-10 h-10 rounded-md border cursor-pointer"
              />
              <input
                type="text"
                name="secondaryColor"
                id="secondaryColor"
                value={secondaryColorInput}
                onChange={(e) => handleColorInputChange(e, "secondary")}
                placeholder="e.g., #098761 or rgb(9, 135, 97)"
                className="block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div className="pb-4 relative z-0 w-full group">
          <label className="flex items-center gap-3 text-sm text-slate-500">
            Dark Mode Default
            <motion.div
              className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"
              animate={{
                backgroundColor: values.darkModeDefault ? "#FFA05C" : "#E5E7EB",
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.input
                type="checkbox"
                name="darkModeDefault"
                checked={values.darkModeDefault}
                onChange={(e) =>
                  setValues({ ...values, darkModeDefault: e.target.checked })
                }
                className="sr-only peer"
                aria-label="Toggle dark mode default"
              />
              <motion.div
                className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full border border-gray-300 dark:border-gray-600"
                animate={{ x: values.darkModeDefault ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>
          </label>
        </div>
        <div className="relative z-0 w-full group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="logoLight"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-medium rounded-md cursor-pointer hover:bg-primary/20 focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                <FiUpload size={16} />
                Choose Logo Light
                <input
                  type="file"
                  name="logoLight"
                  id="logoLight"
                  accept="image/png,image/svg+xml"
                  onChange={(e) => handleFileChange(e, "light")}
                  className="hidden"
                  aria-label="Upload logo light"
                />
              </label>
              <span className="text-sm text-gray-900 dark:text-gray-300">
                {logoLight ? logoLight.name : "No file chosen"}
              </span>
            </div>
            {logoLightPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={logoLightPreview}
                  alt="Logo Light Preview"
                  className="max-h-24 object-contain rounded-md border border-gray-300 dark:border-gray-600"
                />
              </motion.div>
            )}
          </div>
          <label
            htmlFor="logoLight"
            className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Logo Light (PNG/SVG, max 2MB)
          </label>
        </div>
        <div className="relative z-0 w-full group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="logoDark"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-medium rounded-md cursor-pointer hover:bg-primary/20 focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                <FiUpload size={16} />
                Choose Logo Dark
                <input
                  type="file"
                  name="logoDark"
                  id="logoDark"
                  accept="image/png,image/svg+xml"
                  onChange={(e) => handleFileChange(e, "dark")}
                  className="hidden"
                  aria-label="Upload logo dark"
                />
              </label>
              <span className="text-sm text-gray-900 dark:text-gray-300">
                {logoDark ? logoDark.name : "No file chosen"}
              </span>
            </div>
            {logoDarkPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={logoDarkPreview}
                  alt="Logo Dark Preview"
                  className="max-h-24 object-contain rounded-md border border-gray-300 dark:border-gray-600"
                />
              </motion.div>
            )}
          </div>
          <label
            htmlFor="logoDark"
            className="peer-focus:font-medium absolute text-sm text-slate-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Logo Dark (PNG/SVG, max 2MB)
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <motion.button
            type="button"
            onClick={() => setOpenUpdatePopup(false)}
            className="font-medium border border-primary text-primary px-4 py-2 rounded hover:underline w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 font-medium rounded text-sm px-4 py-2 w-full sm:w-auto flex items-center gap-2"
            disabled={status === "loading"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === "loading" && <Spinner width="20px" />}
            Update Branding
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddBranding;
