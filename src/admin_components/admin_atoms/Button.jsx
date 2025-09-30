import React from "react";
import { icons } from "../../constant/icon";
function Button({ label, className, handleClick, title }) {
  return (
    <button title={title} onClick={handleClick} className={`${className}`}>
      {label}
    </button>
  );
}

export default Button;
