"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadImageToFirebase } from "@/utils/firebase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductDetail = () => {
  const { id: productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    company: "",
    specification: {
      headings: [],
      specs: [],
    },
    design: "",
    imageUrl: "",
  });
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newHeading, setNewHeading] = useState("");
  const [newSpec, setNewSpec] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.product);
        setEditedProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    const checkUserToken = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("User not authenticated");
        }
        const data = await response.json();
        setUserRole(data.user?.role);
        setUserId(data.user?._id);
      } catch (error) {
        console.error("Error checking user token:", error);
        setError("User authentication failed. Please log in.");
        router.push("/login");
        return null;
      }
    };

    fetchProduct();
    checkUserToken();
  }, [productId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
  
      try {
        const imageUrl = await uploadImageToFirebase(file);
        setEditedProduct((prevProduct) => ({
          ...prevProduct,
          imageUrl,
        }));
        toast.success("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!userRole) {
      setError("User not authenticated.");
      toast.error("User not authenticated.");
      return;
    }
  

    if (editedProduct.imageUrl) {
      try {
        if (userRole === "Admin") {
          const response = await fetch(`/api/products/${product._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedProduct),
          });
  
          if (!response.ok) throw new Error("Failed to update product");
          toast.success("Product updated successfully");
          router.push("/dashboard");
        } else {
          const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product._id,
              ...editedProduct,
              userId,
            }),
          });
  
          if (!response.ok) throw new Error("Failed to submit changes for review");
          toast.success("Changes submitted for review");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error submitting product:", error);
        toast.error("An error occurred while submitting the product.");
      }
    } else {
      toast.error("Image upload failed. Please upload a valid image.");
    }
  };
  

  const handleAddSpecification = () => {
    const updatedHeadings = [...editedProduct.specification.headings];
    const updatedSpecs = [...editedProduct.specification.specs];
    if (newHeading && newSpec) {
      if (editingIndex !== null) {
        updatedHeadings[editingIndex] = newHeading;
        updatedSpecs[editingIndex] = newSpec;
        setEditingIndex(null);
      } else {
        updatedHeadings.push(newHeading);
        updatedSpecs.push(newSpec);
      }
      setEditedProduct({
        ...editedProduct,
        specification: {
          headings: updatedHeadings,
          specs: updatedSpecs,
        },
      });
      setNewHeading("");
      setNewSpec("");
    }
  };

  const handleEditSpecification = (index) => {
    setEditingIndex(index);
    setNewHeading(editedProduct.specification.headings[index]);
    setNewSpec(editedProduct.specification.specs[index]);
  };

  const handleRemoveSpecification = (index) => {
    const updatedHeadings = editedProduct.specification.headings.filter(
      (_, i) => i !== index
    );
    const updatedSpecs = editedProduct.specification.specs.filter(
      (_, i) => i !== index
    );
    setEditedProduct({
      ...editedProduct,
      specification: {
        headings: updatedHeadings,
        specs: updatedSpecs,
      },
    });
  };

  if (!product)
    return <p className="text-center text-gray-500 min-h-screen">Loading...</p>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-8 bg-gray-100">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="w-full lg:w-1/2">
          {/* Product Image Section */}
          <div className="relative mb-6">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {isEditing && (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {userRole === "Admin" ? "Save Changes" : "Submit for Review"}
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 rounded-lg shadow-xl">
          {/* Product Details and Edit Form */}
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedProduct.title}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      title: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-3 w-full mb-2"
                  placeholder="Product Title"
                />
                {editedProduct.company && (
                  <input
                    type="text"
                    value={editedProduct.company}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        company: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded p-3 w-full mb-2"
                    placeholder="Company Name"
                  />
                )}
                {editedProduct.originalPrice && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-2">
                    <input
                      type="number"
                      value={editedProduct.originalPrice}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          originalPrice: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded p-3 w-full"
                      placeholder="Original Price"
                    />
                    <input
                      type="number"
                      value={editedProduct.discount}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          discount: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded p-3 w-full"
                      placeholder="Discount"
                    />
                  </div>
                )}
                <textarea
                  value={editedProduct.description}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-3 w-full mb-4"
                  placeholder="Product Description"
                />
                <input
                  type="text"
                  value={editedProduct.design}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      design: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-3 w-full mb-4"
                  placeholder="Design"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mb-4"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover mt-2 border border-gray-300 rounded"
                  />
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {product.title}
                </h1>
                {product.company && (
                  <p className="text-lg sm:text-xl text-gray-600 mb-4">
                    {product.company}
                  </p>
                )}
                {product.originalPrice && (
                  <div className="text-sm text-gray-700 mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    {product.discount > 0 && (
                      <span className="text-green-500 text-xl sm:text-2xl">
                        Rs. {product.price}
                      </span>
                    )}
                    <del className="text-gray-600">
                      Rs. {product.originalPrice}
                    </del>
                    <div className="bg-[#43831e] text-white text-sm px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  </div>
                )}
                <p className="text-lg text-gray-600 mb-4">
                  {product.description}
                </p>
                {product.design && (
                  <p className="text-lg text-gray-600 mb-4">
                    Design: {product.design}
                  </p>
                )}
              </>
            )}
            {product.specification && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3">Specifications:</h3>
                {product.specification.headings.map((heading, index) => (
                  <div
                    key={index}
                    className="mb-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                  >
                    <h4 className="font-bold">{heading} :</h4>
                    <p>{product.specification.specs[index]}</p>
                    {isEditing && (
                      <div className="mt-2 flex gap-2 flex-col sm:flex-row">
                        <button
                          onClick={() => handleEditSpecification(index)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveSpecification(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newHeading}
                      onChange={(e) => setNewHeading(e.target.value)}
                      className="border border-gray-300 rounded p-3 w-full mb-2"
                      placeholder="Heading"
                    />
                    <textarea
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      className="border border-gray-300 rounded p-3 w-full mb-4"
                      placeholder="Specification Detail"
                    />
                    <button
                      onClick={handleAddSpecification}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                      {editingIndex !== null
                        ? "Update Specification"
                        : "Add Specification"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
