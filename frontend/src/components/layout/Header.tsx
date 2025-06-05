import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/features/authSlice";
import { MdLogout } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, setOpen);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", JSON.stringify(true));
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", JSON.stringify(false));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  return (
    <header className="bg-white dark:bg-boxdark h-16 w-full shadow-md flex items-center justify-end px-6 mb-3 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-body dark:text-bodydark hover:text-primary dark:hover:text-primary transition-colors"
        >
          {isDarkMode ? <BsSun size={20} /> : <BsMoonStars size={20} />}
        </button>
        <p className="text-sm font-medium text-body dark:text-bodydark">
          {user?.fullName}
        </p>
        <div ref={wrapperRef} className="relative">
          <motion.button
            onClick={() => setOpen(!open)}
            className="text-body dark:text-bodydark hover:text-primary dark:hover:text-primary focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaRegUserCircle size={24} />
          </motion.button>

          <motion.div
            id="dropdown"
            className={`absolute right-0 top-10 z-50 w-44 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg shadow-lg divide-y divide-stroke dark:divide-strokedark ${
              open ? "block" : "hidden"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2 text-sm text-body dark:text-bodydark">
              <li>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                >
                  <MdLogout size={16} /> Logout
                </button>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

// Hook to detect outside click
function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, setOpen]);
}

export default Header;
