// external dependencies
import { useParams, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import authService from "../Services/authService"

// components
import Button from "../Components/Button"
import ChangePanel from "../Components/ChangePanel"
import Statusbar from "../Components/Statusbar"
import RegularField from "../Components/RegularField"

//------ MODULE INFO
// This module allows a user to reset their own password by typing the new password twice.
// The hash is in the url, and the user must also type their email address.
// Imported by: App
// Navigated from: Email link
// Navigates to: LogIn

const ResetPassword = () => {

    // the url for this page is /reset/:hash
    // the hash is set by the server and emailed to the user when they request a reset password
    const { hash } = useParams()

    // other setup
    const { setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // set up form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        email: "",
        password: "",
        retypePassword: "",
        errorFields: []
    })
    const [ forceValidation, setForceValidation ] = useState(0)

    // check password features and set error messages
    const checkLength = (pw) => { return pw.length >= 8 ? null : "Password must be at least 8 characters long." }
    const checkNumber = (pw) => { return pw.match(/[0-9]/) ? null : "Password must contain at least one number." }
    const checkCase = (pw) => { return pw.match(/[a-z]/) && pw.match(/[A-Z]/) ? null : "Password must contain a mix of upper and lower case letters." }
    const checkSymbol = (pw) => { return pw.match(/[!@#\$%\^&\*\(\)\-_\+=:;"'<>,\.\/\?\\\|`~\[\]\{\}]/) ? null : "Password must contain at least one symbol." }

    const passwordChecks = [ checkLength, checkNumber, checkCase, checkSymbol ]

    const retypeCheck = (pw) => {
        return pw === changes.password ? null : "The same password must be entered twice."
    } 

    // send the new password to the api
    const saveChanges = () => {

        // validation
        if (changes.email === "" || changes.password === "" || changes.retypePassword === "" || changes.errorFields.length > 0) {
            setForceValidation(forceValidation + 1)
            setStatus({
                message: "Please verify that you have entered a valid email, that your password is strong, and that you have entered the same password twice.",
                error: true
            })
            return
        }

        const resetObject = { ...changes }
        resetObject.hash = hash
        authService.resetPassword(resetObject, (response) => {
            if (response?.success) {

                // on success, log out the current user, set the status and unsaved, and send them to the login screen
                authService.logout()
                setStatus({
                    message: "Your password has been reset. Please log in.",
                    error: false
                })
                setUnsaved(false)
                navigate("/")
            } else {
                setStatus({
                    message: "We weren't able to reset your password.",
                    error: true
                })
            }
        })
    }

    const formControls = { changes, setChanges, unsaved, setUnsaved, force: forceValidation }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Resetting Your Password</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/" type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Email
                        </div>
                        <div className="col-content">
                            <RegularField
                                type="email"
                                name="email"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                        <div className="col-head">
                            New Password
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="password"
                                name="password"
                                formControls={ formControls }
                                checks={ passwordChecks }
                                required={ true }
                            />
                        </div>
                        <div className="col-head">
                            Retype New Password
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="password"
                                name="retypePassword"
                                formControls={ formControls }
                                checks={[ retypeCheck ]}
                                required={ true }
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