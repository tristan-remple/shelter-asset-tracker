// external dependencies
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import apiService from '../Services/apiService'

//------ MODULE INFO
// ** Available for SCSS **
// This module defines the footer navigation that appears on every page.
// Imported by: App

const Footer = () => {

    const [ branding, setBranding ] = useState({
        name: "Shelter Asset Tracker",
        url: "icons8-room-100.png"
    })

    useEffect(() => {
        (async()=> {
            await apiService.getSettings(data => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    const newBranding = {
                        name: data.settings.filter(sett => sett.name === "name")[0].value,
                        url: data.settings.filter(sett => sett.name === "url")[0].value
                    }
                    setBranding(newBranding)
                }
            })
        })()
    }, [])
    
    return (
        <footer className="navbar navbar-expand-lg">
            <div className="container p-3">
                <p className='mt-3'>
                    Shelter Asset Tracker © <a href="https://www.nscc.ca/about/research-and-innovation/index.asp">Applied Research NSCC</a><br />
                    All information on this site belongs exclusively and confidentially to <a href={ branding.url }>{ branding.name }</a>.
                    </p>
                    <Link id="faq" className="nav-link navbar-brand m-lg-2" to="/faq">?</Link>
            </div>
        </footer>
    )
}

export default Footer