import React from 'react'
import DashboardProducts from './DashboardProducts'
import Link from "next/link";
function Admin() {
  return (
    <div className='bg-gray-100'>
      <div className="bg-[#368376] flex justify-center items-center text-white w-full text-center h-8">
      Admin Account
      </div>
      <header className="flex flex-col lg:flex-row justify-between items-center mt-8 px-10 bg-white py-4">
        <h1 className="text-4xl font-extrabold text-[#439c8d] mb-4 lg:mb-0">
          Product List
        </h1>

        <Link href="/createproduct">
          <button className="px-6 py-3 bg-[#4cae9e] text-white rounded-lg shadow-lg hover:bg-[#2f776b] transition duration-300 flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span className="font-medium">Create Product</span>
          </button>
        </Link>
      </header>
      <DashboardProducts/>
    </div>
  )
}

export default Admin;