// external dependencies
import { useContext, useEffect } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import authService from "../Services/authService"

//------ MODULE INFO
// ** Available for SCSS **
// This page allows users to log out.
// Imported by: App

const LogOut = () => {

    // get status context
    const { status, setStatus } = useContext(statusContext)

    // perform the logout api call
    useEffect(() => {
        (async() => {
            await authService.logout((response) => {
                if (response && response.status === 200) {
                    setStatus("You have been successfully logged out.")
                } else {
                    setStatus("We weren't able to process your request.")
                }
            })
        })()
    }, [])

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Log Out</h2>
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
            </div>
        </main>
    )
}

export default LogOut