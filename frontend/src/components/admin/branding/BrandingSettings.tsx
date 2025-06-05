import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchBranding } from "../../../store/features/brandingSlice";
import withMainComponent from "../../layout/withMainComponent";
import Popup from "../../layout/Popup";
import AddBranding from "./AddBranding";
import Spinner from "../../layout/Spinner";
import { Pencil } from "lucide-react";

const BrandingSettings = () => {
  const { branding, status } = useAppSelector((state) => state.branding);
  const dispatch = useAppDispatch();
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

  useEffect(() => {
    dispatch(fetchBranding());
  }, [dispatch]);

  return (
    <div className="p-4 pl-4 md:p-6 bg-whiten dark:bg-boxdark-2 min-h-screen">
      <h6 className="text-lg font-semibold text-body dark:text-bodydark mb-4">
        Branding Settings
      </h6>

      <div className="mt-5">
        {status === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : branding ? (
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Current Branding Configuration
              </h3>
              <button
                onClick={() => setOpenUpdatePopup(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
                aria-label="Update Branding"
              >
                <Pencil className="w-4 h-4" />
                Update Branding
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Color */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                    {branding.primaryColor}
                  </span>
                </div>
              </div>

              {/* Secondary Color */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                  <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                    {branding.secondaryColor}
                  </span>
                </div>
              </div>

              {/* Dark Mode Default */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Dark Mode Default
                </label>
                <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                  {branding.darkModeDefault ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Logo Light */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Light Logo
                </label>
                {branding.logoLight ? (
                  <div className="flex justify-center items-center h-20 bg-white  rounded-md border border-gray-200 dark:border-gray-700 p-2">
                    <img
                      src={branding.logoLight}
                      alt="Light Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    No logo uploaded
                  </span>
                )}
              </div>

              {/* Logo Dark */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Dark Logo
                </label>
                {branding.logoDark ? (
                  <div className="flex justify-center items-center h-20 bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 p-2">
                    <img
                      src={branding.logoDark}
                      alt="Dark Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    No logo uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-md p-6 text-center py-8">
            <span className="text-gray-500 dark:text-gray-400">
              No branding settings found.
            </span>
          </div>
        )}
      </div>

      <Popup
        title="Update Branding"
        open={openUpdatePopup}
        setOpen={setOpenUpdatePopup}
      >
        <AddBranding setOpenUpdatePopup={setOpenUpdatePopup} />
      </Popup>
    </div>
  );
};

export default withMainComponent(BrandingSettings);
