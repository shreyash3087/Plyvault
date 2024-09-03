"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.user?.role === "Admin") {
          setAdminId(data.user._id);
          setIsAdmin(true);
          fetchReviews(); 
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast.error("Failed to fetch user role. Redirecting...");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [router]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews/pending");
      const data = await res.json();

      if (data && Array.isArray(data.reviews)) {
        const reviewsWithOriginalProduct = await Promise.all(
          data.reviews.map(async (review) => {
            try {
              const productRes = await fetch(
                `/api/products/${review.productId}`
              );
              const productData = await productRes.json();

              return {
                ...review,
                originalProduct: productData.product,
              };
            } catch (error) {
              console.error(
                `Failed to fetch product data for review ${review._id}`,
                error
              );
              return { ...review, originalProduct: null };
            }
          })
        );
        setReviews(reviewsWithOriginalProduct);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews.");
      setReviews([]);
    }
  };

  const formatSpecification = (specification) => {
    if (!specification || !specification.headings || !specification.specs) {
      return "N/A";
    }

    return specification.headings
      .map((heading, index) => `${heading}: ${specification.specs[index]}`)
      .join(", ");
  };

  const getModifiedFields = (review) => {
    const { originalProduct, title, price, imageUrl, description, company, design, discount, specification } = review;
    const modifiedFields = {};
  
    if (originalProduct) {
      if (title !== originalProduct.title) {
        modifiedFields.title = {
          old: originalProduct.title || "N/A",
          new: title || "N/A",
        };
      }
      if (price !== originalProduct.price) {
        modifiedFields.price = {
          old: originalProduct.price || "N/A",
          new: price || "N/A",
        };
      }
      if (imageUrl !== originalProduct.imageUrl) {
        modifiedFields.imageUrl = {
          old: originalProduct.imageUrl || "N/A",
          new: imageUrl || "N/A",
        };
      }
      if (description !== originalProduct.description) {
        modifiedFields.description = {
          old: originalProduct.description || "N/A",
          new: description || "N/A",
        };
      }
      if (company !== originalProduct.company) {
        modifiedFields.company = {
          old: originalProduct.company || "N/A",
          new: company || "N/A",
        };
      }
      if (design !== originalProduct.design) {
        modifiedFields.design = {
          old: originalProduct.design || "N/A",
          new: design || "N/A",
        };
      }
      if (discount !== originalProduct.discount) {
        modifiedFields.discount = {
          old: originalProduct.discount || "N/A",
          new: discount || "N/A",
        };
      }
      if (JSON.stringify(specification) !== JSON.stringify(originalProduct.specification)) {
        modifiedFields.specification = {
          old: formatSpecification(originalProduct.specification) || "N/A",
          new: formatSpecification(specification) || "N/A",
        };
      }
    }
  
    return modifiedFields;
  };

  const handleReviewAction = async (reviewId, action) => {
    const review = reviews.find((r) => r._id === reviewId);

    if (!review) {
      toast.error("Review not found");
      return;
    }

    const productUpdate =
      action === "approved" ? getModifiedFields(review) : null;

    if (!adminId) {
      toast.error("Admin ID is not available");
      return;
    }

    try {
      if (action === "approved" && productUpdate) {
        const productUpdateRes = await fetch(
          `/api/products/${review.productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productUpdate),
          }
        );

        if (!productUpdateRes.ok) {
          throw new Error("Failed to update product");
        }
      }

      const reviewUpdateRes = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action,
          adminId: adminId,
        }),
      });

      if (reviewUpdateRes.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
        toast.success(`Review ${action} successfully`);
      } else {
        throw new Error("Failed to update review");
      }
    } catch (error) {
      console.error("Error handling review action:", error);
      toast.error(`Error ${action === "approved" ? "approving" : "rejecting"} review`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>; 
  }

  if (!isAdmin) {
    return null; 
  }

  return (
    <div className="container px-24 bg-gray-100 max-sm:px-4 pt-4 mx-auto min-h-screen max-w-screen overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Pending Reviews</h1>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review._id} className="mb-4 border p-4 bg-white rounded-lg">
              <h2 className="font-bold my-3">{review.title || "No product title available"}</h2>
              <p>Requested by: {review.userId || "Unknown author"}</p>
              <p>Changes:</p>
              <ul>
                {Object.entries(getModifiedFields(review)).map(
                  ([field, value]) => (
                    <li key={field} className="mb-2">
                      <strong>{field}:</strong>
                      <br />
                      {field === 'imageUrl' && value.old !== 'N/A' ? (
                        <>
                          <div className="mb-2">
                            <strong>Old Image:</strong>
                            <br />
                            <img src={value.old} alt="Old" className="w-32 h-32 object-cover mt-2" />
                          </div>
                          <div>
                            <strong>New Image:</strong>
                            <br />
                            <img src={value.new} alt="New" className="w-32 h-32 object-cover mt-2" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <strong>Old:</strong> {value.old}
                          </div>
                          <div>
                            <strong>New:</strong> {value.new}
                          </div>
                        </>
                      )}
                    </li>
                  )
                )}
              </ul>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleReviewAction(review._id, "approved")}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReviewAction(review._id, "rejected")}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No pending reviews.</p>
        )}
      </ul>
      <ToastContainer /> 
    </div>
  );
}
