import React from "react";

function Button({ label, style, onClick, title, disabled }) {
  return (
    <button
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`${style}`}
    >
      {label}
    </button>
  );
}

export default Button;
