import { uploadUrl } from "../utils/fileURL";

export const availableRoomColumns = [
  {
    title: "Image",
    key: "image",
    render: (item) => {
      const imageUrl = item.image
        ? `${uploadUrl.uploadurl}/room_categories/${item.image}`
        : "/default-room.jpg";

      return (
        <img
          src={imageUrl}
          alt={item.room_name || "Room"}
          className="w-10 h-10 rounded shadow-sm object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-room.jpg";
          }}
        />
      );
    },
  },
  {
    title: "Room Name",
    key: "room_name",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Capacity",
    key: "capacity",
  },
  {
    title: "Duration",
    key: "duration",
  },
];
