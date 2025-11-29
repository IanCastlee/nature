import React, { useState, useEffect } from "react";
import useGetData from "../../hooks/useGetData";
import useFormSubmit from "../../hooks/useFormSubmit";
import { uploadUrl } from "../../utils/fileURL";

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
  });

  const [heroImages, setHeroImages] = useState([]);
  const [existingHeroImages, setExistingHeroImages] = useState([]);

  useEffect(() => {
    if (data) {
      setFormData({
        hero_heading: data.hero_heading || "",
        hero_subheading: data.hero_subheading || "",
        logo: null,
        email: data.email || "",
        globe_no: data.globe_no || "",
        smart_no: data.smart_no || "",
      });
      setExistingHeroImages(data.hero_images || []);
    }
  }, [data]);

  const {
    submit: submitForm,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/admin_setting.php", () => refetch());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "logo") setFormData((prev) => ({ ...prev, logo: files[0] }));
      if (name === "heroImages") {
        const selectedFiles = Array.from(files).slice(0, 5);
        setHeroImages(selectedFiles);
      }
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Admin Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        {/* Hero Heading */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Hero Heading
          </label>
          <input
            type="text"
            name="hero_heading"
            value={formData.hero_heading}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Hero Subheading */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Hero Subheading
          </label>
          <input
            type="text"
            name="hero_subheading"
            value={formData.hero_subheading}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Globe No */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Globe No
          </label>
          <input
            type="text"
            name="globe_no"
            value={formData.globe_no}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Smart No */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Smart No
          </label>
          <input
            type="text"
            name="smart_no"
            value={formData.smart_no}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            className="block"
          />
          {data.logo && (
            <img
              src={`${uploadUrl.uploadurl}/logo/${data.logo}`}
              alt="logo"
              className="mt-2 w-32 h-auto rounded border"
            />
          )}
        </div>

        {/* Hero Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Hero Images (max 5)
          </label>
          <input
            type="file"
            name="heroImages"
            multiple
            onChange={handleChange}
            className="block mb-2"
          />
          <div className="flex flex-wrap gap-4">
            {existingHeroImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24">
                <img
                  src={`${uploadUrl.uploadurl}/hero/${img.image}`}
                  alt="hero"
                  className="w-full h-full object-cover rounded border"
                />
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Delete this image?")) {
                      try {
                        const res = await axiosInstance.post(
                          "/admin/admin_setting.php",
                          {
                            delete_hero_id: img.id,
                          }
                        );
                        if (res.data.success) {
                          setExistingHeroImages((prev) =>
                            prev.filter((i) => i.id !== img.id)
                          );
                        } else {
                          alert(res.data.message || "Failed to delete image.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Something went wrong while deleting.");
                      }
                    }
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                >
                  ×
                </button>
              </div>
            ))}

            {heroImages.map((file, i) => (
              <div
                key={i}
                className="w-24 h-24 flex items-center justify-center text-sm text-gray-700 border rounded bg-gray-100"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formLoading}
          className={`w-full py-2 px-4 rounded text-white font-semibold ${
            formLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {formLoading ? "Saving..." : "Save Settings"}
        </button>

        {formError && <p className="text-red-500 mt-2">{formError.message}</p>}
      </form>
    </div>
  );
}

export default AdminSetting;
