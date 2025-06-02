import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const LoginLogo = () => {
  const [largeLogo, setLargeLogo] = useState(false);

  return (
    <Link
      to="/"
      className="mb-6 inline-block"
      onClick={() => setLargeLogo(!largeLogo)}
    >
      <img
        src={Logo}
        alt="Logo"
        className={`mx-auto transition-all duration-300 ${
          largeLogo ? "w-64" : "w-40"
        }`}
        style={{ cursor: "pointer" }}
      />
    </Link>
  );
};

export default LoginLogo;
