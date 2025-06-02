import React from "react";
import "./Spinner.css";
interface Props {
  width?: string;
}

const Spinner: React.FC<Props> = ({ width = "3.25em" }) => {
  return (
    <div className="flex justify-center items-center">
      <svg
        className="animate-spin"
        width={width}
        height={width}
        viewBox="0 0 50 50"
        style={{ transformOrigin: "center" }}
      >
        <circle
          className="text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="90, 200"
          strokeDashoffset="0"
          strokeLinecap="round"
          r="20"
          cy="25"
          cx="25"
        />
      </svg>
    </div>
  );
};

export default Spinner;
