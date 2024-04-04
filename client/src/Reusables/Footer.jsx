// external dependencies
import { Link } from 'react-router-dom'

//------ MODULE INFO
// ** Available for SCSS **
// This module defines the footer navigation that appears on every page.
// Imported by: App

const Footer = () => {
    return (
        <footer className="navbar navbar-expand-lg">
            <div className="container">
                <p>
                    Shelter Asset Tracker © <a href="https://www.nscc.ca/about/research-and-innovation/index.asp">Applied Research NSCC</a><br />
                    All information on this site belongs exclusively and confidentially to <a href={ import.meta.env.VITE_ORG_URL }>{ import.meta.env.VITE_ORGANIZATION }</a>.
                    </p>
                <Link id="faq" className="navbar-brand" to="/faq">?</Link>
            </div>
        </footer>
    )
}

export default Footer