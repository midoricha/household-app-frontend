import React from "react";
import { Link } from "react-router-dom";
import { Home, CheckSquare, Book, ShoppingBag, Calendar } from "react-feather";

interface SidebarProps {
    onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
    const handleClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <nav className="sidebar">
            <div className="logo">
                <h2>HomeOS</h2>
            </div>
            <div className="nav-links">
                <Link to="/tasks" className="nav-item" onClick={handleClick}>
                    <CheckSquare size={20} />
                    <span>Tasks</span>
                </Link>
                <Link to="/recipes" className="nav-item" onClick={handleClick}>
                    <Book size={20} />
                    <span>Recipes</span>
                </Link>
                <Link to="/pantry" className="nav-item" onClick={handleClick}>
                    <ShoppingBag size={20} />
                    <span>Pantry</span>
                </Link>
                <Link
                    to="/meal-planner"
                    className="nav-item"
                    onClick={handleClick}
                >
                    <Calendar size={20} />
                    <span>Meal Planning</span>
                </Link>
            </div>
        </nav>
    );
};

export default Sidebar;
