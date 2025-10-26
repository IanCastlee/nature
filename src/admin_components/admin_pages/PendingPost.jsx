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

function PendingPost() {
  const [approveItem, setApproveItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //================//
  //  DATA FETCH    //
  //================//
  const { data, loading, refetch, error } = useGetData(
    `/gallery/gallery.php?status=pending`
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
      setApproveItem(null);
      setRejectItem(null);
    }
  );

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Pending Post
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} pending post
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
                onSetApprove: (item) => setApproveItem(item),
                onSetReject: (item) => setRejectItem(item),
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

      {/* Approve Modal */}
      {approveItem?.id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={inactiveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="approve post"
          label3="This will be visible in Gallery."
          onConfirm={() =>
            setInactive({
              id: approveItem?.id,
              action: "set_approve",
            })
          }
        />
      )}

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

export default PendingPost;
