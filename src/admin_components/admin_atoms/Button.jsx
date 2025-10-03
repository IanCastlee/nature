function Button({ label, className, onClick, title }) {
  return (
    <button title={title} onClick={onClick} className={`${className}`}>
      {label}
    </button>
  );
}

export default Button;
