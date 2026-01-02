import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsCottage } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { availableCottageColumns } from "../../constant/tableColumns";
import { useLocation } from "react-router-dom";
import ViewCottageDetails from "../admin_molecules/ViewCottageDetails";

function NotAvailableCottage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes(
    "not-available-cottage"
  );

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewCottageDetailsId, setViewCottageDetailsId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch room data
  const { data, loading, refetch, error } = useGetData(
    `/admin/cottage.php?status=inactive`
  );

  console.log("NOT INACTUVE : ", data);

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
        item?.name?.toLowerCase().includes(search) ||
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
  } = useSetInactive("/admin/cottage.php", () => {
    refetch();
    setDeleteItem(null);
  });
  //=====================//
  //  view room details  //
  //=====================//

  const viewCottageDetails = (item) => {
    setShowForm("view cottage");
    setViewCottageDetailsId(item);
  };
  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Not Active Cottage
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} cottage
            {filteredData.length > 1 ? "s" : ""}
          </span>

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
            columns={availableCottageColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsCottage({
                item,
                showForm,
                isNotAvailablePage,
                onSetInactive: (item) => setDeleteItem(item),
                onSetViewCottageDetails: (item) => viewCottageDetails(item),
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

      {deleteItem?.cottage_id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label={isNotAvailablePage ? "Yes, Set as available" : ""}
          label2="active"
          label3="This will set the data to available."
          onConfirm={() => {
            setInactive({
              id: deleteItem?.cottage_id,
              action: isNotAvailablePage ? "set_active" : "set_inactive",
            });
          }}
        />
      )}

      {showForm === "view cottage" && (
        <ViewCottageDetails cottageId={viewCottageDetailsId} />
      )}
    </>
  );
}

export default NotAvailableCottage;
