// external dependencies
import { useParams } from "react-router-dom"
import { useContext } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import authService from "../Services/authService"
import apiService from "../Services/apiService"

// components
import Button from "../Reusables/Button"
import Error from "../Reusables/Error"
import { adminDate } from "../Services/dateHelper"

//------ MODULE INFO
// ** Available for SCSS **
// This module shows the details about a specific user to the admin or to themself.
// Imported by: App

const UserDetails = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)

    // validate id
    const currentUser = authService.userInfo()
    const currentUserId = currentUser.userId
    if (id === undefined && currentUserId === null) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // check permissions: only the user whose profile this is and admins should have access
    let permission = false
    if (currentUser?.userId === id || authService.checkAdmin()) {
        permission = true
    }

    if (!permission) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // fetch user data from the api
    let response
    if (id !== undefined || id !== "undefined") {
        response = apiService.singleUser(id)
    } else {
        response = apiService.singleUser(currentUserId)
    }

    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure response
    const { userId, userName, userType, created, deleted, location } = response

    // send reset password request to the api
    const resetPassword = () => {
        const resetResponse = authService.requestResetPassword(userId)
        if (resetResponse?.success) {
            let newStatus = `The password has been reset for ${ userName }. `
            if (currentUser.userId === userId) {
                newStatus += "Please check your email."
            } else {
                newStatus += "Please have them check their email."
            }
            setStatus(newStatus)
        } else {
            console.log(resetResponse)
            setStatus("We weren't able to reset the password.")
        }
    }

    // if the user viewing the profile is the current user, allow them to reset their password
    let passwordLink
    if (currentUser.userId === userId) {
        passwordLink = <div className="col-2">
            <Button text="Reset Password" linkTo={ resetPassword } type="action" />
        </div>
    }

    // if the user viewing the profile is an admin, allow them to edit the user and reset the password
    let editLink
    if (authService.checkAdmin()) {
        editLink = <div className="col-2">
            <Button text="Edit" linkTo={ `/user/${ userId }/edit` } type="admin" />
        </div>
        passwordLink = <div className="col-2">
            <Button text="Reset Password" linkTo={ resetPassword } type="action" />
        </div>
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>User { userName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/users" type="nav" />
                </div>
                { passwordLink }
                { editLink }
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