// external dependencies
import { Link } from "react-router-dom"
import Button from "./Button"

//------ MODULE INFO
// ** Available for SCSS **
// This module is displayed instead of the page when something goes wrong.
// Refer to the switch case to view and add error messages.
// Imported by: ItemDetails, ItemEdit, ItemCreate, UnitDetails

const Error = ({ err }) => {

    let errorText = ""
    switch(err) {
        case "undefined":
            errorText = "You are trying to reach a page that describes a single thing, but we don't know which thing."
            break
        case "api":
            errorText = "We tried to find something in the database for you, but we couldn't find it. This could mean that the thing you're looking for does not exist, or it may mean that the database is offline."
            break
        case "deleted":
            errorText = "The thing you're looking for has been deleted."
            break
        case "permission":
            errorText = "You do not have permission to do the requested task."
            break
        default:
            errorText = "Something went wrong"
    }

    return (
        <main className="container">
            <h1>Error</h1>
            <p>If you're seeing this page, something has gone wrong.</p>
            <p>{ errorText }</p>
            <div className="row">
                <div className="col">
                    <Button text="Return Home" linkTo="/" type="nav" />
                </div>
                <div className="col">
                    <Button text="Read Help Document" linkTo="/help" type="nav" />
                </div>
            </div>
        </main>
    )
}

export default Error