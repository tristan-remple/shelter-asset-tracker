// external dependencies
import { useParams, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import authService from "../Services/authService"
import apiService from "../Services/apiService"
import handleChanges from "../Services/handleChanges"

// components
import Error from "../Reusables/Error"
import Button from "../Reusables/Button"
import ChangePanel from "../Reusables/ChangePanel"

//------ MODULE INFO
// ** Available for SCSS **
// This module allows a user to reset their own password by typing the new password twice.
// Imported by: App

const ResetPassword = () => {

    // the url for this page is /reset/:hash
    // the hash is set by the server and should be emailed to the user when they request a reset password
    const { hash } = useParams()

    // other setup
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // check the database for a password reset request
    const resetRequest = authService.getResetRequest(hash)
    if (!resetRequest || !resetRequest.userId) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // get the userId from the database
    const { userId } = resetRequest

    // use it to find the user
    const user = apiService.singleUser(userId)
    if (!user || user.error) {
        console.log("api error")
        return <Error err="api" />
    }
    const { userName } = user

    // set up form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        password: "",
        retypePassword: ""
    })

    // check password strength
    const checkPassword = (pw) => {
        return (
            pw.length > 8 &&
            pw.match(/[0-9]/) &&
            pw.match(/[a-z]/) &&
            pw.match(/[A-Z]/) &&
            pw.match(/[!@#\$%\^&\*\(\)\-_\+=:;"'<>,\.\/\?\\\|`~\[\]\{\}]/)
        )
    }

    // send the new password to the api
    const saveChanges = () => {

        // validation
        if ( changes.password !== changes.retypePassword) {
            setStatus("Please double check that you have typed the same password twice.")
        } else if (!checkPassword(changes.password)) {
            setStatus("Your password must be at least 8 characters and include a mix of letters, numbers, and symbols.")
        } else {
            const resetResponse = authService.resetPassword({
                userId,
                password: changes.password
            })
            if (resetResponse?.success) {

                // on success, log out the current user, set the status and unsaved, and send them to the login screen
                authService.logout()
                setStatus("Your password has been reset. Please log in.")
                setUnsaved(false)
                navigate("/")
            } else {
                setStatus("We weren't able to reset your password.")
            }
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Resetting Password for User { userName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/" type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            New Password
                        </div>
                        <div className="col-content">
                            <input 
                                type="password" 
                                name="password" 
                                value={ changes.password } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Retype New Password
                        </div>
                        <div className="col-content">
                            <input 
                                type="password" 
                                name="retypePassword" 
                                value={ changes.retypePassword } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/users" /> }
            </div>
        </main>
    )
}

export default ResetPassword