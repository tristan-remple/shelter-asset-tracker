// external dependencies
import { useContext, useEffect } from "react"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import authService from "../Services/authService"

//------ MODULE INFO
// ** Available for SCSS **
// This page allows users to log out.
// Imported by: App

const LogOut = () => {

    // get status context
    const { status, setStatus } = useContext(statusContext)
    const { userDetails, setUserDetails } = useContext(userContext)

    // perform the logout api call
    useEffect(() => {
        (async() => {
            await authService.logout((response) => {
                if (response.error) {
                    setStatus("We weren't able to process your request.")
                } else {
                    setUserDetails({
                        userId: null,
                        isAdmin: false,
                        facilityAuths: []
                    })
                    sessionStorage.removeItem("userId")
                    sessionStorage.removeItem("isAdmin")
                    sessionStorage.removeItem("facilityAuths")
                    setStatus("You have been successfully logged out.")
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