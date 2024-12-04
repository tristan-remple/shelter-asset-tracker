// external dependencies
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import handleChanges from "../Services/handleChanges"
import authService from "../Services/authService"
import validateEmail from "../Services/validateEmail"

// components
import Button from '../Components/Button'
import Statusbar from "../Components/Statusbar"
import RegularField from "../Components/RegularField"

//------ MODULE INFO
// This module takes in an email address and resends a password reset email if there is an active request.
// It shows an error if the email is not in the system or if the email does not have an active reset request.
// Imported by: App
// Navigated from: LogIn
// Navigates to: LogIn

const ForgotPassword = () => {

    // set up
    const navigate = useNavigate()
    const { setStatus } = useContext(statusContext)
    const { userDetails } = useContext(userContext)
    const [ forceValidation, setForceValidation ] = useState(0)

    // if the user is logged in, redirect them to their location(s)
    useEffect(() => {
        if (userDetails.userId && !userDetails.isAdmin && userDetails.facilityAuths.length === 1) {
            navigate(`/location/${ userDetails.facilityAuths[0] }`)
        } else if (userDetails.userId) {
            navigate("/locations")
        }
    }, [ userDetails ])
    
    // form handling
    const [ changes, setChanges ] = useState({
        email: "",
        errorFields: []
    })
    const [ unsaved, setUnsaved ] = useState(false)

    const submitForm = () => {
        if (changes.email === "" || changes.errorFields.length > 0) {
            setStatus({
                message: "Please check that your email address has been entered correctly.",
                error: true
            })
            setForceValidation(forceValidation + 1)
            return
        }
        authService.requestPasswordEmail(changes.email, (response) => {
            if (response.success) {
                setStatus({
                    message: "An email has been sent to you with a link to reset your password. You may need to wait a moment, or check your junk mail.",
                    error: false
                })
            } else {
                setStatus({
                    message: "We were unable to send a password reset to that email. Please check that it is entered correctly.",
                    error: true
                })
            }
        })
    }

    const formControls = {
        changes,
        setChanges,
        unsaved,
        setUnsaved,
        force: forceValidation
    }

    return (
        <main className="container">
            <div className="row title-row mt-5 mb-2">
                <div className="col text-center">
                    <h2>Request Password Reset</h2>
                </div>
            </div>
            <div className="login-form-container"> 
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
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-info">
                        <Button text="Request Reset" linkTo={ submitForm } type="action" id="resetPass" />
                        <Button text="Log In" linkTo="/" type="nav" id="loginBtn" />
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}

export default ForgotPassword