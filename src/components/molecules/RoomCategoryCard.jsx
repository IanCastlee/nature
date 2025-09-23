import React from "react";

function RoomCategoryCard({ item }) {
  return (
    <article className="w-full md:w-[49%] lg:w-[49%] h-[200px] relative group overflow-hidden rounded-md cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        className={`
          absolute inset-0 
          bg-black bg-opacity-50 
          flex items-center justify-center 
          transition-opacity duration-300

          opacity-100   sm:opacity-100 md:opacity-100 
          lg:opacity-0  lg:group-hover:opacity-100
        `}
      >
        <h4 className="text-white text-center text-lg md:text-lg lg:text-2xl font-semibold px-2 max-w-[400px]">
          {item.name}
        </h4>
      </div>
    </article>
  );
}

export default RoomCategoryCard;
