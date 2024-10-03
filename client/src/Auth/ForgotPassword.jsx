// external dependencies
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import handleChanges from "../Services/handleChanges"
import authService from "../Services/authService"

// components
import Button from '../Components/Button'

//------ MODULE INFO
// This module takes in an email address and resends a password reset email if there is an active request.
// It shows an error if the email is not in the system or if the email does not have an active reset request.
// Imported by: App
// Navigated from: LogIn
// Navigates to: LogIn

const ForgotPassword = () => {

    // set up
    const navigate = useNavigate()
    const { status, setStatus } = useContext(statusContext)
    const { userDetails, setUserDetails } = useContext(userContext)

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
        email: ""
    })
    const [ unsaved, setUnsaved ] = useState(false)

    const submitForm = () => {
        authService.requestPasswordEmail(changes.email, (response) => {
            if (response.success) {
                setStatus("An email has been sent to you with a link to reset your password. You may need to wait a moment, or check your junk mail.")
            } else {
                setStatus("No active password reset request was found for that email. Please contact the admin to request a password reset.")
            }
        })
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
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Email
                        </div>
                        <div className="col-content">
                            <input 
                                className="loginInput"
                                type="text" 
                                name="email" 
                                value={ changes.email } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div class="col-info">
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