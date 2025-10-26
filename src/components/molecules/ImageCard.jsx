import React, { useState } from "react";
import { images } from "../../constant/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../utils/fileURL";

function ImageCard({ item }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div
        key={item.id}
        className="max-w-[400px] h-auto relative overflow-hidden rounded-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => setSelectedImage(item)}
      >
        <LazyLoadImage
          src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
          effect="blur"
          wrapperClassName="w-full h-48"
          className="w-full h-full object-cover absolute top-0 left-0"
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition duration-300 flex flex-col justify-end p-2">
          <h2 className="text-white text-sm">
            {`${item.firstname} ${item.lastname}`}
          </h2>
          <p className="text-white text-xs">{item.date_posted}</p>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex top-0 items-center justify-center z-50 p-0 m-0 overflow-hidden"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
            alt="Selected"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}

export default ImageCard;
