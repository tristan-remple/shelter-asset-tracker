import { useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// internal dependencies
import authService from '../Services/authService';
import { authContext } from '../Services/Context';

const Header = () => {
    const { isAdmin } = useContext(authContext);
    const userInfo = authService.userInfo();
    const { userId } = userInfo;
    const location = useLocation();

    return (
        <header className="navbar navbar-expand-lg">
            <div className="container my-2">
                <Link className="navbar-brand" to="/">
                    <img src="/img/logo.png" alt="Shelter Nova Scotia Logo" className='logo-image' />
                </Link>
                <div className="col-2">
                    <h1 id="app-title" className='mt-4'>Shelter Asset Tracker</h1>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNav" className="collapse navbar-collapse show justify-content-end">
                    <ul className="navbar-nav my-2">
                        {userId && isAdmin && (
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/admin">Dashboard</NavLink>
                            </li>
                        )}
                        {userId ? (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/location"
                                        className={['/location', '/unit', '/item', '/users', '/categories'].some(path => location.pathname.startsWith(path)) ? "nav-link active" : "nav-link"}
                                    >
                                        Inventory
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/user">Profile</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/logout">Log Out</NavLink>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Log In</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Header;
