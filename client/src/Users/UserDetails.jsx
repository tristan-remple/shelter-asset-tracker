// external dependencies
import { useParams } from "react-router-dom"
import { useContext, useState, useEffect } from "react"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import authService from "../Services/authService"
import apiService from "../Services/apiService"
import { adminDate } from "../Services/dateHelper"

// components
import Button from "../Components/Button"
import Error from "../Components/Error"

//------ MODULE INFO
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
    const [ user, setUser ] = useState()
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
        authService.requestResetPassword(profileId, (res) => {
            if (!res.success) {
                setErr(res.error)
            } else {
                let newStatus = `The password has been reset for ${ user.name }. `
                if (userId === profileId) {
                    newStatus += "Please check your email."
                } else {
                    newStatus += "Please have them check their email."
                }
                setStatus(newStatus)
            }
        })
    }

    // if the user viewing the profile is the current user or an admin, allow them to reset their password and edit their details
    let passwordLink
    let editLink
    if (userId === profileId || isAdmin) {
        passwordLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Reset Password" linkTo={ resetPassword } type="action" />
        </div>
        editLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Edit" linkTo={ `/user/${ profileId }/edit` } type="admin" />
        </div>
    }

    const cancelReset = () => {
        authService.cancelResetPassword(profileId, (res) => {
            if (!res.success) {
                setErr(res.error)
            } else {
                setStatus(`The password reset for ${ user.name } has been cancelled.`)
            }
        })
    }

    if (userDetails.activeReset) {
        passwordLink = <div className="col-2 d-flex justify-content-end">
            <Button text="Cancel Reset" linkTo={ cancelReset } type="action" />
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
                            Email
                        </div>
                        <div className="col-content">
                            { user?.email }
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