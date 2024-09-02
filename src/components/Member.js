import React from 'react'
import DashboardProducts from './DashboardProducts'
import Link from "next/link";
function Member() {
  return (
    <div className='bg-gray-100'>
      <div className="bg-[#368376] flex justify-center items-center text-white w-full text-center h-8">
      Member Account
      </div>
      <header className="flex flex-col lg:flex-row justify-between items-center mt-8 px-10 bg-white py-4">
        <h1 className="text-4xl font-extrabold text-[#439c8d] mb-4 lg:mb-0">
          Product List
        </h1>
      </header>
      <DashboardProducts/>
    </div>
  )
}

export default Member;
