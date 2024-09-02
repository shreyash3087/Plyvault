"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToFirebase } from "@/utils/firebase";

const CreateProductPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [company, setCompany] = useState("");
  const [headings, setHeadings] = useState([""]);
  const [specs, setSpecs] = useState([""]);
  const [design, setDesign] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch("/api/check-token", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.user?.role === "Admin") {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        router.push("/dashboard");
      } finally {
        setLoading(false); 
      }
    };

    checkUserRole();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHeading = () => {
    setHeadings([...headings, ""]);
    setSpecs([...specs, ""]);
  };

  const handleRemoveSpec = (index) => {
    const newHeadings = [...headings];
    const newSpecs = [...specs];
    newHeadings.splice(index, 1);
    newSpecs.splice(index, 1);
    setHeadings(newHeadings);
    setSpecs(newSpecs);
  };

  const handleHeadingChange = (index, value) => {
    const newHeadings = [...headings];
    newHeadings[index] = value;
    setHeadings(newHeadings);
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...specs];
    newSpecs[index] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToFirebase(image);
      }


      const calculatedPrice = originalPrice - (originalPrice * discount) / 100;

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price: calculatedPrice.toFixed(2),
          originalPrice,
          discount,
          company,
          specification: {
            headings,
            specs,
          },
          design,
          imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create product");
      }
    } catch (error) {
      setError("An error occurred while creating the product.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; 
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#178573] text-white text-center py-6">
          <h2 className="text-3xl font-semibold">Create a New Product</h2>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Pricing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Original Price</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-300" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            <div className="space-y-4">
              {headings.map((heading, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    placeholder={`Heading ${index + 1}`}
                    value={heading}
                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                    placeholder={`Specification ${index + 1}`}
                    value={specs[index]}
                    onChange={(e) => handleSpecChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleRemoveSpec(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#178573] text-white rounded-lg shadow-sm hover:bg-[#6cb5a9] focus:outline-none focus:ring-2 focus:ring-[#178573]"
                onClick={handleAddHeading}
              >
                Add More Specifications
              </button>
            </div>
          </div>
          <hr className="my-8 border-gray-300" />
          <div>
            <h3 className="text-xl font-semibold mb-4">Design and Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Design</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#178573]"
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Image</label>
                <div className="relative">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  {/* Custom Choose Image Button */}
                  <button
                    type="button"
                    className="w-56 px-4 py-2 text-white bg-[#178573] border border-transparent rounded-lg shadow-sm hover:bg-[#6cb5a9] focus:outline-none focus:ring-2 focus:ring-[#178573] flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7v10M12 7v10M16 7v10M5 7h14M5 17h14"
                      ></path>
                    </svg>
                    Choose Image
                  </button>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Image Preview</h4>
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-1/2 h-auto object-cover border rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-center mt-6">{error}</p>}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-[#178573] text-white rounded-lg shadow-lg hover:bg-[#6cb5a9] focus:outline-none focus:ring-2 focus:ring-[#178573] transition duration-300 font-semibold"
              onClick={handleSubmit}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
