// external dependencies
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom';

// internal dependencies
import authService from '../Services/authService'
import { authContext } from '../Services/Context'


//------ MODULE INFO
// ** Available for SCSS **
// This module defines the header navigation that appears on every page.
// Imported by: App

const Header = () => {

    const { isAdmin } = useContext(authContext)
    const userInfo = authService.userInfo()
    const { userId: userId, username: username, location: { locationId, name } } = userInfo

    return (
        <header className="navbar navbar-expand-lg">
            <div className="container my-2">
                <Link className="navbar-brand" to="/">
                    <img src="../../public/img/logo.png" alt="Shelter Nova Scotia Logo" className="logo-image"/>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNav" className="collapse navbar-collapse show justify-content-end">
                    <ul className="navbar-nav my-2">
                        { isAdmin && (
                            <li className="nav-item">
                                 <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/dashboard">Dashboard</NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to={`/location/${locationId}`}>Inventory</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to={`/user/${userId}`}>Profile</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/logout">Log Out</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header