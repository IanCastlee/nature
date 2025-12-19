import React, { useState, useEffect } from "react";
import useGetData from "../../hooks/useGetData";
import useFormSubmit from "../../hooks/useFormSubmit";
import { uploadUrl } from "../../utils/fileURL";
import axiosInstance from "../../utils/axiosInstance";
import Input from "../../components/atoms/Input";

// Simple Toaster component
function Toaster({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 text-white rounded shadow ${bgColor}`}
    >
      {message}
    </div>
  );
}

function AdminSetting() {
  const { data, loading, refetch, error } = useGetData(
    `/admin/admin_setting.php`
  );

  const [formData, setFormData] = useState({
    hero_heading: "",
    hero_subheading: "",
    logo: null,
    email: "",
    globe_no: "",
    smart_no: "",
    fb: "",
    ig: "",
  });

  const [heroImages, setHeroImages] = useState([]);
  const [existingHeroImages, setExistingHeroImages] = useState([]);
  const [toast, setToast] = useState(null); // Toast state

  useEffect(() => {
    if (data) {
      setFormData({
        hero_heading: data.hero_heading || "",
        hero_subheading: data.hero_subheading || "",
        logo: null,
        email: data.email || "",
        globe_no: data.globe_no || "",
        smart_no: data.smart_no || "",
        fb: data.fb || "",
        ig: data.ig || "",
      });
      setExistingHeroImages(data.hero_images || []);
    }
  }, [data]);

  const {
    submit: submitForm,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/admin_setting.php", () => {
    refetch();
    setToast({ message: "Settings updated successfully!", type: "success" });
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "logo") setFormData((prev) => ({ ...prev, logo: files[0] }));
      if (name === "heroImages") setHeroImages(Array.from(files).slice(0, 5));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) payload.append(key, formData[key]);
    });
    heroImages.forEach((file) => payload.append("hero_images[]", file));
    submitForm(payload);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Admin Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage website content and contact information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700"
        >
          {/* CONTACT INFO */}
          <section className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Globe Number"
                name="globe_no"
                value={formData.globe_no}
                onChange={handleChange}
              />
              <Input
                label="Smart Number"
                name="smart_no"
                value={formData.smart_no}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SOCIAL LINKS */}
          <section className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Social Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Facebook URL"
                name="fb"
                value={formData.fb}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
              <Input
                label="Instagram URL"
                name="ig"
                value={formData.ig}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>
          </section>

          {/* HERO IMAGES */}
          <section className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Hero Images
            </h2>

            <input
              type="file"
              name="heroImages"
              multiple
              onChange={handleChange}
              className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />

            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
              {existingHeroImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-lg overflow-hidden shadow"
                >
                  <img
                    src={`${uploadUrl.uploadurl}/hero/${img.image}`}
                    alt="hero"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Delete this image?")) return;
                      const form = new FormData();
                      form.append("delete_hero_id", img.id);
                      const res = await axiosInstance.post(
                        "/admin/admin_setting.php",
                        form
                      );
                      if (res.data.success) {
                        setExistingHeroImages((prev) =>
                          prev.filter((i) => i.id !== img.id)
                        );
                        setToast({ message: "Image deleted", type: "success" });
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SUBMIT */}
          <section className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
            <button
              type="submit"
              disabled={formLoading}
              className="w-full md:w-auto px-6 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {formLoading ? "Saving..." : "Save Changes"}
            </button>
            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError.message}</p>
            )}
          </section>
        </form>

        {/* TOAST */}
        {toast && (
          <Toaster
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminSetting;
