import React from "react";

function Button({ label, style }) {
  return <button className={`${style}`}>{label}</button>;
}

export default Button;
