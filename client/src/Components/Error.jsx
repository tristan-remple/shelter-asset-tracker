// external dependencies
import { useContext } from "react"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"

// components
import Button from "./Button"
import Statusbar from "./Statusbar"

//------ MODULE INFO
// This module is displayed instead of the page when something goes wrong.
// Refer to the switch case to view and add error messages.
// Imported by: ItemDetails, ItemEdit, ItemCreate, UnitDetails

const Error = ({ err }) => {

    const { userDetails, setUserDetails } = useContext(userContext)
    const { status } = useContext(statusContext)

    let errorText = ""
    switch(err) {
        case "undefined":
            errorText = "You are trying to reach a page that describes a single thing, but we don't know which thing."
            break
        case "api":
            errorText = "We tried to find something in the database for you, but we couldn't find it. This could mean that the thing you're looking for does not exist."
            break
        case "deleted":
            errorText = "The thing you're looking for has been deleted."
            break
        case "permission":
            errorText = "You do not have permission to do the requested task."
            break
        case "unknown":
            errorText = "The page you are looking for either does not exist, or has been entered incorrectly."
            break
        case "loading":
            errorText = "We are still trying to find the data you're looking for. Please be patient."
            break
        case "anonymous":
            errorText = "You are not logged in. Please log in to use this app."
            sessionStorage.removeItem("userId")
            sessionStorage.removeItem("isAdmin")
            sessionStorage.removeItem("facilityAuths")
            setUserDetails({
                userId: null,
                isAdmin: false,
                facilityAuths: []
            })
            break
        case "duplicate":
            errorText = "The thing you are trying to create may already exist, or your input may not be valid."
            break
        case "dependency": 
            errorText = "The thing you're trying to delete cannot be deleted while it is being used."
            break
        case "password":
            errorText = "A password reset has been requested for your account, and you can't log in until it has been completed."
            break
        default:
            errorText = "Something went wrong."
    }

    if (err === "loading") {
        return (
            <main className="container">
                <h1>Loading...</h1>
                <div className="page-content">
                    <p className="mx-2">Please be patient while we find the data you're looking for.</p>
                    <div className="row d-flex-col">
                        <div className="co-1l">
                            <Button text="Return Home" linkTo="/" type="nav" />
                        </div>
                        <div className="col">
                            <Button text="Read Help Document" linkTo="/help" type="admin" />
                        </div>
                    </div>
                </div>
            </main>
        )
    }
    
    return (
        <main className="container">
            <h1>Error</h1>
            <div className="page-content">
                <p className="mx-2">If you're seeing this page, something has gone wrong.</p>
                <Statusbar />
                <p className="mx-2">{ errorText }</p>
                <div className="row d-flex-col">
                    <div className="co-1l">
                        <Button text="Return Home" linkTo="/" type="nav" />
                    </div>
                    <div className="col">
                        <Button text="Read Help Document" linkTo="/help" type="admin" />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Error