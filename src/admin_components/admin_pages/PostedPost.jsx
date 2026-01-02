import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsGallery } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { galleryColumn } from "../../constant/tableColumns";
import { useLocation } from "react-router-dom";

function PostedPost() {
  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("posted-post");

  const [rejectItem, setRejectItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //================//
  //  DATA FETCH    //
  //================//
  const { data, loading, refetch, error } = useGetData(
    `/gallery/gallery.php?status=posted`
  );

  //=================//
  // DATA FILTERING  //
  //=================//
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.firstname?.toLowerCase().includes(search) ||
        item?.lastname?.toLowerCase().includes(search) ||
        item?.date_posted.toString().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  //============================//
  // HANDLE APPROVE / REJECT    //
  //============================//
  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/gallery/gallery.php",
    () => {
      refetch();
      setRejectItem(null);
    }
  );

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Posted Post
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} posted post
            {filteredData.length !== 1 ? "s" : ""}
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
            columns={galleryColumn}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsGallery({
                item,
                onSetReject: (item) => setRejectItem(item),
                isNotAvailablePage,
              })
            }
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

      {/* Reject Modal */}
      {rejectItem?.id && (
        <DeleteModal
          item={rejectItem}
          name={rejectItem?.firstname}
          loading={inactiveLoading}
          onCancel={() => setRejectItem(null)}
          label="Yes, Reject"
          label2="reject post"
          label3="This post will be removed."
          onConfirm={() =>
            setInactive({
              id: rejectItem?.id,
              action: "set_reject",
            })
          }
        />
      )}
    </>
  );
}

export default PostedPost;
