import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchBranding } from "../../store/features/brandingSlice";

interface Props {
  children: React.ReactNode;
}

const BrandingProvider: React.FC<Props> = ({ children }) => {
  const { branding } = useAppSelector((state) => state.branding);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBranding());
  }, [dispatch]);

  useEffect(() => {
    if (branding) {
      document.documentElement.style.setProperty(
        "--primary",
        branding.primaryColor || "#3C50E0"
      );
      document.documentElement.style.setProperty(
        "--secondary",
        branding.secondaryColor || "#64748B"
      );

      const lightLogo = branding.logoLight
        ? `${import.meta.env.VITE_API_URL}${branding.logoLight}`
        : "/assets/logo.png";
      const darkLogo = branding.logoDark
        ? `${import.meta.env.VITE_API_URL}${branding.logoDark}`
        : "/assets/logo.png";
      document.documentElement.style.setProperty(
        "--logo-light",
        `url(${lightLogo})`
      );
      document.documentElement.style.setProperty(
        "--logo-dark",
        `url(${darkLogo})`
      );
    }
  }, [branding]);

  return <>{children}</>;
};

export default BrandingProvider;
