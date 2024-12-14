import React, { useEffect, useState } from 'react';
import './style/Navbar.css';

const Navbar = () => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/links')
            .then((response) => response.json())
            .then((data) => setLinks(data))
            .catch((error) => console.error('Error fetching links:', error));
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-brand">My Admin Coffee Shoppe App</div>
            <ul className="navbar-links">
                {links.map((link) => (
                    <li key={link.id}><a href={link.path}>{link.name}</a></li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
