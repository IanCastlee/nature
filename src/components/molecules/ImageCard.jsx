import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../utils/fileURL";

function ImageCard({ item }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div
        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden rounded-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => setSelectedImage(item)}
      >
        <LazyLoadImage
          src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover absolute top-0 left-0"
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition duration-300 flex flex-col justify-end p-2">
          <h2 className="text-white text-xs sm:text-base">{item.caption}</h2>
          <p className="text-white text-xs sm:text-sm">{item.date_posted}</p>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
            alt="Selected"
            className="max-w-full max-h-full sm:max-w-[100%] sm:max-h-[90%] shadow-lg"
          />
        </div>
      )}
    </>
  );
}

export default ImageCard;
