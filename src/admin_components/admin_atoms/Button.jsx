import React from "react";
import { icons } from "../../constant/icon";
function Button({ label, style }) {
  return <button className={`${style}`}>{label}</button>;
}

export default Button;
