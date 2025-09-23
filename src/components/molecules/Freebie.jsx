import React from "react";

function Freebie({ item }) {
  return (
    <article
      key={item.name}
      className="w-[130px] bg-black/70 dark:bg-black/70 rounded-lg flex flex-col items-center justify-center p-3"
    >
      <img className="h-10 w-10" src={item.image} alt={`${item.name} icon`} />
      <p className="text-xs font-medium text-center text-gray-200">
        {item.name}
      </p>
    </article>
  );
}

export default Freebie;
