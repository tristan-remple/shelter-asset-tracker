// external dependencies
import { Link } from 'react-router-dom'

//------ MODULE INFO
// ** Available for SCSS **
// This module defines the footer navigation that appears on every page.
// Imported by: App

const Footer = () => {
    return (
        <footer className="navbar navbar-expand-lg fixed-bottom">
            <div className="container p-3">
                <p className='mt-3'>Shelter Asset Tracker © <a href="https://www.nscc.ca/about/research-and-innovation/index.asp">Applied Research NSCC</a></p>
                    <div className="nav-link">
                        <Link id="faq" className="navbar-brand m-lg-2" href="/faq">?</Link>
                    </div>
            </div>
        </footer>
    )
}

export default Footer