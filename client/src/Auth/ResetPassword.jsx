// external dependencies
import { useParams, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

// internal dependencies
import { statusContext } from "../Services/Context"
import authService from "../Services/authService"
import handleChanges from "../Services/handleChanges"

// components
import Button from "../Components/Button"
import ChangePanel from "../Components/ChangePanel"

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
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // set up form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        email: "",
        password: "",
        retypePassword: ""
    })

    // check password strength
    const checkPassword = (pw) => {

        // check password features and set error messages
        const checkLength = pw.length >= 8 ? "Pass" : "Password must be at least 8 characters long."
        const checkNumber = pw.match(/[0-9]/) ? "Pass" : "Password must contain at least one number."
        const checkCase = pw.match(/[a-z]/) && pw.match(/[A-Z]/) ? "Pass" : "Password must contain a mix of upper and lower case letters."
        const checkSymbol = pw.match(/[!@#\$%\^&\*\(\)\-_\+=:;"'<>,\.\/\?\\\|`~\[\]\{\}]/) ? "Pass" : "Password must contain at least one symbol."

        // check overall password validitity
        const validPassword = (
            pw.length >= 8 &&
            pw.match(/[0-9]/) &&
            pw.match(/[a-z]/) &&
            pw.match(/[A-Z]/) &&
            pw.match(/[!@#\$%\^&\*\(\)\-_\+=:;"'<>,\.\/\?\\\|`~\[\]\{\}]/)
        )

        // create and return a response
        const validationResponse = {
            validPassword,
            errors: [
                checkLength,
                checkNumber,
                checkCase,
                checkSymbol
            ]
        }

        return validationResponse
    }

    // send the new password to the api
    const saveChanges = () => {

        // validation
        const valid = checkPassword(changes.password)
        if ( changes.password !== changes.retypePassword) {
            setStatus({
                message: "Please double check that you have typed the same password twice.",
                error: true
            })
            return
        } else if (!valid.validPassword) {
            let validationStatus = <p>Your password must be at least 8 characters and include a mix of letters, numbers, and symbols.</p>
            let validationPoints = valid.errors
                .filter(err => err !== "Pass")
                .map(err => <li key={ err }>{ err }</li>)
            setStatus({
                message: <>
                    { validationStatus }
                    <ul>
                        { validationPoints }
                    </ul>
                </>,
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
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Email
                        </div>
                        <div className="col-content">
                            <input 
                                type="email" 
                                name="email" 
                                value={ changes.email } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
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