import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "react-feather";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="app-layout">
            <button 
                className="mobile-menu-button" 
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div 
                className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`} 
                onClick={closeSidebar}
            />
            
            <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar onNavigate={closeSidebar} />
            </div>
            
            <main className="main-content" onClick={closeSidebar}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
