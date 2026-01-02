import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActions } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import ViewRoomDetails from "../admin_molecules/ViewRoomDetails";
import { availableRoomColumns } from "../../constant/tableColumns";
import { useLocation } from "react-router-dom";
import Button from "../admin_atoms/Button";

function NotAvailableRoomPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [toggleRooms, setToggleRooms] = useState(true);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("not-available-room");

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewRoomDetailsId, setViewRoomDetailsId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch room data
  const { data, loading, refetch, error } = useGetData(
    `/admin/room.php?status=${toggleRooms ? "inactive" : "under_maintenance"}`
  );

  //================//
  // HANDLE CHANGE //
  //==============//

  //handlePageChange
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // DATA FILTERING //
  //===============//

  //Filtered data
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const search = searchTerm.toLowerCase();
      return (
        item?.room_name?.toLowerCase().includes(search) ||
        item?.price?.toString().includes(search) ||
        item?.capacity?.toString().includes(search) ||
        item?.duration?.toString().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //============================//
  //   HANDLE DELETE/INACTIVE //
  //=========================//

  //room
  const {
    setInactive,
    loading: inactiveLoading,
    error: inactiveError,
  } = useSetInactive("/admin/room.php", () => {
    refetch();
    setDeleteItem(null);
  });

  //=====================//
  //  view room details  //
  //=====================//
  const viewRoomDetails = (item) => {
    setShowForm("view room");
    setViewRoomDetailsId(item);
  };

  return (
    <>
      <div className="scroll-smooth">
        <div className="w-full flex flex-row items-center justify-between ">
          <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
            {toggleRooms
              ? " Not Available Room(s)"
              : "Under Maintenance Rooms(s)"}
          </h1>

          <Button
            onClick={() => setToggleRooms(!toggleRooms)}
            className="flex flex-row items-center h-[35px] bg-yellow-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
            label={
              toggleRooms ? "Show Under Maintenance" : "Show All Not Active"
            }
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="dark:text-gray-100 text-xs font-medium">
              Showing {filteredData.length} categor
              {filteredData.length !== 1 ? "ies" : "y"}
            </span>

            <div className="flex items-center gap-1 text-xs">
              <span className="dark:text-gray-300">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1
                 bg-white dark:bg-gray-800 dark:text-gray-100"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={100}>250</option>
                <option value={100}>500</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <GenericTable
            columns={availableRoomColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActions({
                item,
                showForm,
                isNotAvailablePage,
                onSetInactive: (item) => setDeleteItem(item),
                onSetViewRoomDetails: (item) => viewRoomDetails(item),
              });
            }}
          />
        </div>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {deleteItem?.room_id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.room_name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label={isNotAvailablePage ? "Yes, Set as available" : ""}
          label2="active"
          label3="This will set  this room to available."
          onConfirm={() => {
            setInactive({
              id: deleteItem?.room_id,
              action: isNotAvailablePage ? "set_active" : "set_inactive",
            });
          }}
        />
      )}

      {showForm === "view room" && (
        <ViewRoomDetails roomId={viewRoomDetailsId} />
      )}
    </>
  );
}

export default NotAvailableRoomPage;
