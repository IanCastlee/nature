import React, { memo } from "react";

function TableRow({ room }) {
  return (
    <tr key={room.id} className="dark:hover:bg-gray-700">
      <td className="p-2 border dark:border-gray-700 border-gray-300">
        <img
          src={room.image}
          alt={room.name}
          className="w-10 h-10 rounded shadow-sm"
        />
      </td>
      <td className="p-2 border text-xs dark:border-gray-700 dark:text-gray-100 border-gray-300">
        {room.name}
      </td>
    </tr>
  );
}

export default memo(TableRow);
