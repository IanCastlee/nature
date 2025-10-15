import React from "react";

function Button({ label, style, onClick, title }) {
  return (
    <button title={title} onClick={onClick} className={`${style}`}>
      {label}
    </button>
  );
}

export default Button;
