"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faUsers } from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-6 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-8">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold text-[#4cae9e] flex items-center "
            >
              <img src="./logo.png" alt="Logo" width={40} /> PlyVault
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full flex-1 mt-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">
                  Choose Your Role
                </h2>
              </div>

              <div className="flex justify-center space-x-4">
                <div
                  className={`cursor-pointer w-1/2 p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ${
                    selectedRole === "Admin" ? "border-4 border-[#4cae9e]" : ""
                  }`}
                  onClick={() => handleRoleSelect("Admin")}
                >
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-[#4cae9e] text-3xl mb-4 h-8"
                  />
                  <h3 className="text-xl font-semibold">Admin</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Manage teams, users, and settings.
                  </p>
                </div>

                <div
                  className={`cursor-pointer w-1/2 p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ${
                    selectedRole === "Team Member"
                      ? "border-4 border-[#4cae9e]"
                      : ""
                  }`}
                  onClick={() => handleRoleSelect("Team Member")}
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-[#4cae9e] text-3xl mb-4 h-8"
                  />
                  <h3 className="text-xl font-semibold">Team Member</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Collaborate with your team on projects.
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-8">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                <button
                  className="mt-5 tracking-wide font-semibold bg-[#4cae9e] text-white w-full py-4 rounded-lg hover:bg-[#256359] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleSignup}
                >
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 -ml-2" />
                  <span className="ml-2">Sign Up</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by PlyVault&lsquo;s{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#4cae9e] hover:text-[#256359] font-semibold"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/background.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
