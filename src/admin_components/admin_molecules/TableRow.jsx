import React, { memo } from "react";
import { icons } from "../../constant/icon";
import Button from "../admin_atoms/Button";
import { useRoomStore } from "../../store/useRoomStore";
import { uploadUrl } from "../../utils/fileURL";
function TableRow({ item, isHidden, onEdit, onSetInactive }) {
  const setShowForm = useRoomStore((state) => state.setShowForm);
  return (
    <tr
      key={item.category_id}
      className="dark:hover:bg-gray-900 hover:bg-gray-50"
    >
      <td className="h-[45px]  p-2 border dark:border-gray-700 border-gray-300">
        <img
          src={`${uploadUrl.uploadurl}/room_categories/${item.image}`}
          alt={item.category}
          className="w-auto h-full rounded shadow-sm"
        />
      </td>
      <td className="h-[45px]  p-2 border text-xs dark:border-gray-700 dark:text-gray-100 border-gray-300">
        {item.category}
      </td>
      <td className="flex flex-row justify-end p-0 border dark:border-gray-700 border-gray-300 align-middle">
        <div className="flex flex-row items-center gap-2 px-2 h-[45px]">
          <div className={`${isHidden} flex flex-row gap-2 items-center`}>
            <Button
              handleClick={() => setShowForm("amenities")}
              title="Add Amenities"
              className="flex items-center whitespace-nowrap bg-yellow-700 h-[27px] rounded-sm text-white px-2 text-xs font-normal hover:bg-gray-800"
              label={
                <>
                  Amenities <icons.IoAddOutline className="text-lg ml-1" />
                </>
              }
            />

            <Button
              handleClick={() => setShowForm("inclusions")}
              title="Add Inclusions"
              className="flex items-center whitespace-nowrap bg-yellow-600 h-[27px] rounded-sm text-white px-2 text-xs font-normal hover:bg-gray-800"
              label={
                <>
                  Inclusions <icons.IoAddOutline className="text-lg ml-1" />
                </>
              }
            />

            <Button
              handleClick={() => setShowForm("extras")}
              title="Add Extras"
              className="flex items-center whitespace-nowrap bg-yellow-500 h-[27px] rounded-sm text-white px-2 text-xs font-normal hover:bg-gray-800"
              label={
                <>
                  Extras <icons.IoAddOutline className="text-lg ml-1" />
                </>
              }
            />
          </div>

          <button
            onClick={() => {
              console.log("TableRow: onSetInactive clicked for", item);
              onSetInactive(item);
            }}
            title="Set as not active"
            className="h-[27px] ml-7 bg-red-500 rounded-sm w-[27px] text-white hover:bg-gray-700 flex flex-row justify-center items-center"
          >
            <icons.MdDeleteOutline />
          </button>

          <button
            onClick={() => onEdit(item)}
            title="Update"
            className="h-[27px] m bg-blue-500 rounded-sm w-[27px] text-white hover:bg-gray-700 flex flex-row justify-center items-center"
          >
            <icons.FaRegEdit />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default memo(TableRow);
