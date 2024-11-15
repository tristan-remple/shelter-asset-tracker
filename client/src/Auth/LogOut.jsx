// external dependencies
import { useContext, useEffect } from "react"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import authService from "../Services/authService"

// components
import Statusbar from "../Components/Statusbar"

//------ MODULE INFO
// This page allows users to log out.
// Imported by: App
// Navigated from: Header

const LogOut = () => {

    // get status context
    const { status, setStatus } = useContext(statusContext)
    const { setUserDetails } = useContext(userContext)

    // perform the logout api call
    useEffect(() => {
        (async() => {
            await authService.logout((response) => {
                if (response.error) {
                    setStatus({
                        message: "We weren't able to process your request.",
                        error: true
                    })
                } else {
                    setUserDetails({
                        userId: null,
                        isAdmin: false,
                        facilityAuths: []
                    })

                    // remove login information from session storage as well as the context
                    sessionStorage.removeItem("userId")
                    sessionStorage.removeItem("isAdmin")
                    sessionStorage.removeItem("facilityAuths")
                    setStatus({
                        message: "You have been successfully logged out.",
                        error: false
                    })
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
                <Statusbar />
            </div>
        </main>
    )
}

export default LogOut