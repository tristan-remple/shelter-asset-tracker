import { useParams } from "react-router-dom"
import { useContext } from "react"

import { statusContext } from "../Services/Context"
import authService from "../Services/authService"
import apiService from "../Services/apiService"

import Button from "../Reusables/Button"
import Error from "../Reusables/Error"
import { adminDate } from "../Services/dateHelper"

//------ MODULE INFO
// ** Available for SCSS **
// This module shows the details about a specific user to the admin.
// Imported by: App

const UserDetails = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)

    // check that user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch user data from the api
    const response = apiService.singleUser(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    const { userId, userName, userType, created, deleted, location } = response

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>User { userName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/users" type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Edit" linkTo={ `/user/${id}/edit` } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            User Name
                        </div>
                        <div className="col-content">
                            { userName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Admin?
                        </div>
                        <div className="col-content">
                            { userType === "admin" ? "Yes" : "No" }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Date Added
                        </div>
                        <div className="col-content">
                            { adminDate(created) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { location.locationName }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default UserDetails