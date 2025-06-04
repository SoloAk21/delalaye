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

  console.log("Branding Settings:", branding);

  return (
    <div className="shadow p-3 rounded">
      <h6 className="font-bold text-secondary">Branding Settings</h6>
      <div className="mt-4">
        {status === "loading" ? (
          <Spinner />
        ) : branding ? (
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Current Branding
              </h3>
              <button
                onClick={() => setOpenUpdatePopup(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                aria-label="Update Branding"
              >
                <Pencil className="w-4 h-4" />
                Update Branding
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-md border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                    {branding.primaryColor}
                  </span>
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-md border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                  <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                    {branding.secondaryColor}
                  </span>
                </div>
              </div>

              {/* Dark Mode Default */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Dark Mode Default
                </label>
                <span className="text-base font-medium text-gray-900 dark:text-gray-300">
                  {branding.darkModeDefault ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Logo Light */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Logo Light
                </label>
                {branding.logoLight ? (
                  <img
                    src={branding.logoLight}
                    alt="Light Logo"
                    className="h-16 object-contain rounded-md border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No logo uploaded</span>
                )}
              </div>

              {/* Logo Dark */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Logo Dark
                </label>
                {branding.logoDark ? (
                  <img
                    src={branding.logoDark}
                    alt="Dark Logo"
                    className="h-16 object-contain rounded-md border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No logo uploaded</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">No branding settings found.</div>
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
