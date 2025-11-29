import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { announcementColumn } from "../../constant/tableColumns";

function AdminAnnouncementHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // fetch data
  const { data, loading, refetch, error } = useGetData(
    `/admin/announcement.php?status=inactive`
  );

  // pagination
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // filter data
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.title?.toLowerCase().includes(search) ||
        item?.message?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Announcement History
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} announcement
            {filteredData.length > 1 ? "s" : ""}
          </span>

          <div className="flex items-center gap-2">
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
            columns={announcementColumn}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
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
    </>
  );
}

export default AdminAnnouncementHistory;
