import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();

  return (
    <main className="grid min-h-screen place-items-center bg-white dark:bg-boxdark-2 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary dark:text-primary">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-body dark:text-bodydark sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-body dark:text-bodydark">
          {error.statusText || error.message}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Go back home
            </Link>
          </motion.div>
          <motion.a
            href="mailto:support@ashewa.com"
            className="text-sm font-semibold text-body dark:text-bodydark hover:text-primary dark:hover:text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact support <span aria-hidden="true">→</span>
          </motion.a>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
