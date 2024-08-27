import React from 'react';
import { useLocation, Outlet } from 'react-router-dom'; // Import Outlet to render child routes
import Sidebar from './Sidebar';
import Header from './Header';

function Layout() {
  const location = useLocation();
  const showSidebarAndHeader = location.pathname !== '/';

  return (
    <div className="flex flex-col md:flex-row  ml-60 h-screen">
      {showSidebarAndHeader && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {showSidebarAndHeader && <Header />}
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          <Outlet /> {/* This will render the matched child route */}
        </main>
      </div>
    </div>
  );
}

export default Layout;
