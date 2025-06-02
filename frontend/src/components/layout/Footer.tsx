import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-boxdark h-16 w-full flex items-center justify-center border-t border-stroke dark:border-strokedark">
      <p className="text-xs text-body dark:text-bodydark">
        Copyright © Ashewa Technologies {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
