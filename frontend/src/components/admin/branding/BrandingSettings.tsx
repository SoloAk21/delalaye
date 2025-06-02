import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchBranding } from "../../../store/features/brandingSlice";
import withMainComponent from "../../layout/withMainComponent";
import Popup from "../../layout/Popup";
import AddBranding from "./AddBranding";
import Spinner from "../../layout/Spinner";

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
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Current Branding
              </h3>
              <button
                onClick={() => setOpenUpdatePopup(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Update Branding
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-500 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-md"
                    style={{ backgroundColor: branding.primaryColor }}
                  ></div>
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    {branding.primaryColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-md"
                    style={{ backgroundColor: branding.secondaryColor }}
                  ></div>
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    {branding.secondaryColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">
                  Dark Mode Default
                </label>
                <span className="text-sm text-gray-900 dark:text-gray-300">
                  {branding.darkModeDefault ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">
                  Logo Light
                </label>
                {branding.logoLight ? (
                  <img
                    src={branding.logoLight}
                    alt="Light Logo"
                    className="h-12 object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    No logo
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">
                  Logo Dark
                </label>
                {branding.logoDark ? (
                  <img
                    src={branding.logoDark}
                    alt="Dark Logo"
                    className="h-12 object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    No logo
                  </span>
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
