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
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      };

      document.documentElement.style.setProperty(
        "--primary-color-rgb",
        hexToRgb(branding.primaryColor)
      );
      document.documentElement.style.setProperty(
        "--secondary-color-rgb",
        hexToRgb(branding.secondaryColor)
      );

      if (branding.darkModeDefault) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [branding]);

  return <>{children}</>;
};

export default BrandingProvider;
