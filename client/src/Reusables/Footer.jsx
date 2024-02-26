// external dependencies
import { Link } from 'react-router-dom'

//------ MODULE INFO
// This module defines the footer navigation that appears on every page.
// Imported by: App.jsx

const Footer = () => {
    return (
        <footer className="navbar navbar-expand-lg">
            <div className="container">
                <p>Shelter Asset Tracker © <a href="https://www.nscc.ca/about/research-and-innovation/index.asp">Applied Research NSCC</a></p>
                <Link id="faq" className="navbar-brand" href="/faq">?</Link>
            </div>
        </footer>
    )
}

export default Footer