import React, { useState } from "react";
import { dummyRooms } from "../../constant/mockData";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import TableRow from "../admin_molecules/TableRow";
import Pagination from "../admin_molecules/Pagination";
function RoomPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 2;

  const filteredRooms = dummyRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="scroll-smooth">
      <h1 className="text-lg font-bold mb-6 dark:text-gray-100">Rooms</h1>

      <div className="w-full flex flex-row justify-between items-center mb-2">
        <span className="dark:text-gray-100 text-xs font-medium">
          Showing {filteredRooms.length} room
          {filteredRooms.length !== 1 ? "s" : ""}
        </span>

        <div className="flex flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 h-[35px] text-xs px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            style="flex flex-row items-center  h-[35px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
            label={
              <>
                Add New{" "}
                <icons.IoAddOutline className="text-lg text-white ml-1" />
              </>
            }
          />
        </div>
      </div>

      {/* Room Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="dark:bg-gray-900 bg-white">
              <th className="p-2 dark:text-gray-100 border  text-left font-medium">
                Image
              </th>
              <th className="p-2 dark:text-gray-100 border  text-left font-medium">
                Room Name
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => <TableRow key={room.id} room={room} />)
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="p-4 text-center text-gray-500 border dark:border-gray-700"
                >
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RoomPage;
