import React from "react";

function Blur({ top, isReverse, blur }) {
  return (
    <div
      className={`absolute ${top} ${
        isReverse ? "left-10" : "right-10"
      } ${blur} bg-yellow-300/40 dark:bg-white/50 blur-3xl rounded-full`}
    ></div>
  );
}

export default Blur;
