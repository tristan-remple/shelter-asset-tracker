// external dependencies
import { useParams } from "react-router-dom"
import { useContext, useState, useEffect } from "react"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
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
    const { userDetails } = useContext(userContext)
    const [ err, setErr ] = useState("loading")

    // validate id
    const { userId, isAdmin, facilityAuths } = userDetails
    let profileId = null
    if (id === undefined && userId === null) {
        setErr("undefined")
    } else if (id) {
        profileId = id
    } else if ( id === undefined ) {
        profileId = userId
    } 

    // check permissions: only the user whose profile this is and admins should have access
    let permission = false
    if (userId === profileId || isAdmin) {
        permission = true
    }

    if (!permission) {
        setErr("permission")
    }

    // fetch user data from the api
    const [ user, setUser ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.singleUser(profileId, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUser(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // send reset password request to the api
    const resetPassword = () => {
        const resetResponse = authService.requestResetPassword(profileId)
        if (resetResponse.error) {
            setErr(resetResponse.error)
        } else {
            let newStatus = `The password has been reset for ${ user.name }. `
            if (currentUser.userId === profileId) {
                newStatus += "Please check your email."
            } else {
                newStatus += "Please have them check their email."
            }
            setStatus(newStatus)
        }
    }

    // if the user viewing the profile is the current user, allow them to reset their password
    let passwordLink
    if (userId === profileId) {
        passwordLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Reset Password" linkTo={ resetPassword } type="action" />
        </div>
    }

    // if the user viewing the profile is an admin, allow them to edit the user and reset the password
    let editLink
    if (authService.checkAdmin()) {
        editLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Edit" linkTo={ `/user/${ profileId }/edit` } type="admin" />
        </div>
        passwordLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Reset Password" linkTo={ resetPassword } type="action" />
        </div>
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>User { user?.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/users" type="nav" />
                </div>
                { passwordLink }
                { editLink }
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            User Name
                        </div>
                        <div className="col-content">
                            { user?.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Admin?
                        </div>
                        <div className="col-content">
                            { user?.isAdmin ? "Yes" : "No" }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Date Added
                        </div>
                        <div className="col-content">
                            { adminDate(user?.created) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Locations
                        </div>
                        <div className="col-content">
                            { user?.facilities?.map(loc => loc.name).join(", ") }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default UserDetails