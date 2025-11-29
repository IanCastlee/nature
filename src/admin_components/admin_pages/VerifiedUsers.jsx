import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBookingHistory } from "../admin_molecules/RenderActions";
import { users } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";

function VerifiedUsers() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch booking data
  const { data, loading, refetch, error } = useGetData(
    `/admin/users.php?status=1`
  );
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
        item?.firstname?.toLowerCase().includes(search) ||
        item?.lastname?.toString().includes(search) ||
        item?.email?.toString().includes(search) ||
        item?.phone?.toString().includes(search) ||
        item?.created_at?.toString().includes(search) ||
        item?.updated_at?.toString().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //=====================//
  //  view room details  //
  //=====================//
  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item);
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Verified Users
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} user(s)
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
            columns={users}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsBookingHistory({
                item,
                setShowForm,
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

      {showForm === "view fh-hall" && <ViewFHDetails fhId={viewFHDetailsId} />}
    </>
  );
}

export default VerifiedUsers;
