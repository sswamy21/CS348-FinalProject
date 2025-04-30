import React from "react";
import { Link } from "react-router-dom";
import './Header.css'

export function Header() {
    return (
        <div>
            <nav>
                <Link to="/">
                    <h2>Home</h2>
                </Link>
                <Link to="/application"> 
                    <h2>Add item</h2>
                </Link>
                <Link to="/report">
                    <h2> View Report </h2>
                </Link>
            </nav>
        </div>
    )
}