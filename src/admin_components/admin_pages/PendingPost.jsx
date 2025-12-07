import React, { useState } from "react";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import { renderActionsGallery } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { galleryColumn } from "../../constant/tableColumns";
import useFormSubmit from "../../hooks/useFormSubmit";
import Pagination from "../../admin_components/admin_molecules/Pagination";
import SearchInput from "../../admin_components/admin_atoms/SearchInput";
import GenericTable from "../../admin_components/admin_molecules/GenericTable";
import Button from "../admin_atoms/Button";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";

function PendingPost() {
  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  // Fetch pending posts
  const { data, loading, refetch } = useGetData(
    `/gallery/gallery.php?status=posted`
  );

  // Approve / Delete handler
  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/gallery/gallery.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  // Upload form submit
  const { submit, loading: formLoading } = useFormSubmit(
    "/gallery/gallery.php",
    () => {
      setFiles([]);
      setCaptions([]);
      setShowModal(false);
      refetch();
      alert("Images uploaded successfully!");
    }
  );

  // Filtering
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.date_posted?.toLowerCase().includes(search) ||
        item?.caption?.toLowerCase().includes(search)
      );
    }) || [];

  // Pagination
  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // File selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCaptions(selectedFiles.map(() => ""));
  };

  // Caption edit
  const handleCaptionChange = (index, value) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  // Upload
  const handleUpload = async () => {
    if (files.length < 1) {
      setError("Please select at least 1 image.");
      return;
    }

    setError("");
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
      formData.append(`caption${index}`, captions[index] || "");
    });

    await submit(formData);
  };

  return (
    <div className="scroll-smooth">
      <h1 className="text-lg font-bold mb-6 dark:text-gray-100">Gallery</h1>

      {/* Search + Add Button */}
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <span className="dark:text-gray-100 text-xs font-medium">
          Showing {filteredData.length} post(s)
          {filteredData.length !== 1 ? "s" : ""}
        </span>

        <div className="flex flex-row items-center gap-2">
          <SearchInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />

          <Button
            onClick={() => setShowModal(true)}
            className="flex flex-row items-center h-[35px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
            label={
              <>
                Add Image <IoAddOutline className="text-lg text-white ml-1" />
              </>
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <GenericTable
          columns={galleryColumn}
          data={currentData}
          loading={loading}
          noDataComponent={<NoData />}
          renderActions={(item) =>
            renderActionsGallery({
              item,
              onSetDelete: (item) => setDeleteItem(item),
            })
          }
        />
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-md w-full max-w-lg p-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <IoCloseOutline size={24} />
            </button>

            <h2 className="font-semibold mb-2 text-gray-800 dark:text-white">
              Upload Images
            </h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />

            {files.map((file, index) => (
              <div key={index} className="flex flex-col mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {file.name}
                </span>
                <input
                  type="text"
                  placeholder="Enter caption"
                  value={captions[index]}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  className="mt-1 p-1 rounded text-black"
                />
              </div>
            ))}

            <button
              onClick={handleUpload}
              disabled={formLoading}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
            >
              {formLoading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteItem?.id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.image}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Delete"
          label2="delete image"
          label3="This image will be permanently removed."
          onConfirm={() =>
            setInactive({
              id: deleteItem?.id,
              action: "set_delete",
            })
          }
        />
      )}
    </div>
  );
}

export default PendingPost;
