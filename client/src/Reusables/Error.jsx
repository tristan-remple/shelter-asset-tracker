// external dependencies
import { Link } from "react-router-dom"
import Button from "./Button"
import { userContext } from "../Services/Context"
import { useContext } from "react"

//------ MODULE INFO
// ** Available for SCSS **
// This module is displayed instead of the page when something goes wrong.
// Refer to the switch case to view and add error messages.
// Imported by: ItemDetails, ItemEdit, ItemCreate, UnitDetails

const Error = ({ err }) => {

    const { userDetails, setUserDetails } = useContext(userContext)

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
            errorText = "The thing you are trying to create already exists."
            break
        case "dependency": 
            errorText = "The thing you're trying to delete cannot be deleted while it is being used."
            break
        default:
            errorText = "Something went wrong."
    }
    
    return (
        <main className="container">
            <h1>Error</h1>
            <div className="page-content">
                <p className="mx-2">If you're seeing this page, something has gone wrong.</p>
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