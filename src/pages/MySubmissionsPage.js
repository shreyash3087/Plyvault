"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/my-submissions");
        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data = await response.json();
        setSubmissions(data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        router.push("/login");
      }
    };

    fetchSubmissions();
  }, [router]);

  return (
    <div className="container mx-auto px-16 max-sm:px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-center text-lg">You have no submissions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {submission.title}
                </h2>
                <p
                  className={`mb-4 text-lg font-bold ${
                    submission.status === "approved"
                      ? "text-green-500"
                      : submission.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  Status: {submission.status}
                </p>
                <p className="text-gray-700">{submission.description}</p>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p
                  className={`text-center text-lg font-bold ${
                    submission.status === "approved"
                      ? "text-green-500"
                      : submission.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                ></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
