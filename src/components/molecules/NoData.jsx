import { images } from "../../constant/image";

function NoData() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <img src={images.empty} className="h-36 w-auto" alt="No Data" />
      <p className="dark:text-gray-500 text-gray-400">No Data Found</p>
    </div>
  );
}

export default NoData;
