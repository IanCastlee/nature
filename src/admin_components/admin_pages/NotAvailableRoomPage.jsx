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

function NotAvailableRoomPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("not-available-room");

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewRoomDetailsId, setViewRoomDetailsId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch room data
  const { data, loading, refetch, error } = useGetData(
    `/admin/room.php?status=inactive`
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
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Not Available Rooms
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} room
            {filteredData.length > 1 ? "s" : ""}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search room"
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
          label3="This will set the data to available."
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
