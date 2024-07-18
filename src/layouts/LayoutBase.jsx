import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/NavBar'

const LayoutBase = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mt-16 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutBase