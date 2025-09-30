import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import TableRow from "../admin_molecules/TableRow";
import Pagination from "../admin_molecules/Pagination";
import Input from "../../components/atoms/Input";
import DropDown from "../../components/atoms/DropDown";
import { options } from "../../constant/mockData";
import { motion } from "framer-motion";
import { dummyRooms } from "../../constant/mockData";

function NotAvailableRoomPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 2;
  const [showForm1, setShowForm1] = useState(false);

  const filteredData = dummyRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastData = currentPage * roomsPerPage;
  const indexOfFirstData = indexOfLastData - roomsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Not Available Rooms
        </h1>

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} room
            {filteredData.length !== 1 ? "s" : ""}
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
              handleClick={() => setShowForm1(true)}
              className="flex flex-row items-center  h-[35px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
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
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="dark:bg-gray-900 bg-white">
                <th className="p-2 dark:text-gray-100   text-left font-medium">
                  Image
                </th>
                <th className="p-2 dark:text-gray-100  text-left font-medium">
                  Room Name
                </th>

                <th className="p-2 dark:text-gray-100  text-right font-medium w-fit ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((room) => (
                  <TableRow key={room.id} room={room} isHidden="hidden" />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="p-4 text-center text-gray-500 border dark:border-gray-700"
                  >
                    No Rooms Found.
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

      {showForm1 && (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex flex-row justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[700px] rounded-lg bg-white dark:bg-gray-800 p-4"
          >
            <div className="flex flex-row justify-between items-center mb-5">
              <h3 className="dark:text-white text-lg">Add Room</h3>
              <icons.MdOutlineClose
                onClick={() => setShowForm1(false)}
                className="text-lg cursor-pointer dark:text-gray-100"
              />
            </div>
            <form action="" className="w-full flex flex-col gap-3">
              <div className="w-1/2 flex flex-row ">
                <DropDown options={options} />
              </div>
              <div className="w-full flex flex-row gap-2">
                <Input label="Room Name" />
                <Input label="Price" isNumber={true} />
              </div>
              <div className="w-full flex flex-row gap-2">
                <Input label="Quantity" />
                <Input label="Duration" />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default NotAvailableRoomPage;
