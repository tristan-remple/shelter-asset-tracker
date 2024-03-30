// external dependencies
import { useContext } from 'react'
import { Link } from 'react-router-dom'

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
    const { userId } = userInfo

    return (
        <header className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={ `/img/${ import.meta.env.VITE_LOGO_FILENAME }` } alt={ import.meta.env.VITE_LOGO_ALTTEXT } />
                </Link>
                <div className="col">
                    <h1>Shelter Asset Tracker</h1>
                    <h2>For { import.meta.env.VITE_ORGANIZATION }</h2>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNav" className="collapse navbar-collapse show justify-content-end">
                    <ul className="navbar-nav">
                        { userId && isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">Dashboard</Link>
                            </li>
                        )}
                        { userId ? ( <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/location">Inventory</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/user">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/logout">Log Out</Link>
                            </li>
                        </> ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Log In</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header