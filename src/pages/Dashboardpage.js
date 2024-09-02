"use client";
import { useEffect, useState } from "react";
import Admin from "../components/Admin";
import Member from "../components/Member";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/check-token", {
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            console.error("Access denied. Redirecting to Login.");
            window.location.href = "/login";
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
        const data = await response.json();

        if (response.status === 403) {
          console.error("Access denied. Unknown role.");
          window.location.href = "/";
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <p className="min-h-screen text-center ">Loading...</p>;

  return (
    <div>
      {user.role === "Admin" ? (
        <>
          <Admin />
        </>
      ) : (
        <>
          <Member />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
