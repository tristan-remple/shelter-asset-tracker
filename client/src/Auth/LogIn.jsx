// external dependencies
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// internal dependencies
import { statusContext, userContext } from "../Services/Context"
import handleChanges from "../Services/handleChanges"
import authService from "../Services/authService"

// components
import Button from '../Components/Button'
import Statusbar from "../Components/Statusbar"

//------ MODULE INFO
// This page allows users to log in.
// It has the "/" route, so it will be the first thing users see.
// It automatically redirects to "/location" if the user is already logged in.
// Imported by: App
// Navigates to: ForgotPassword, LocationList, LocationDetails
// Navigated from: Header, ForgotPassword

const LogIn = () => {

    // set up
    const navigate = useNavigate()
    const { status, setStatus } = useContext(statusContext)
    const { userDetails, setUserDetails } = useContext(userContext)

    // if the user has a session but has somehow erased their context, reset context
    useEffect(() => {
        if (!userDetails.userId && sessionStorage.getItem("userId")) {
            const userId = parseInt(sessionStorage.getItem("userId"))
            const isAdmin = sessionStorage.getItem("isAdmin") === "true"
            const facilityAuths = sessionStorage.getItem("facilityAuths").split(",").map(auth => parseInt(auth))
            setUserDetails({
                userId,
                isAdmin,
                facilityAuths
            })
        }
    }, [])

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
        password: ""
    })
    const [ unsaved, setUnsaved ] = useState(false)

    // process form submit
    const submitLogin = () => {

        // validation
        if (changes.email === "" || changes.password === "") {
            setStatus({
                message: "Please enter your email and password.",
                error: true
            })
            return
        }

        // api call
        authService.login(changes, (response) => {
            if (response.error) {
                setStatus({
                    message: "We weren't able to validate your credentials.",
                    error: true
                })
            } else {

                // set user info to context and session storage
                setUserDetails(response)
                sessionStorage.setItem("userId", response.userId)
                sessionStorage.setItem("isAdmin", response.isAdmin)
                sessionStorage.setItem("facilityAuths", response.facilityAuths)
                setStatus({
                    message: "Welcome.",
                    error: false
                })
                setUnsaved(false)

                // if the user has an active reset request, send them to their profile
                // if (response.activeReset) {
                //     setStatus({
                //         message: "You have made a request to change your password. If you do not need to reset your password, please cancel the request.",
                //         error: false
                //     })
                //     navigate("/user")
                // }

                // navigate to the user's location(s)
                if (response.facilityAuths.length === 1 && !userDetails.isAdmin) {
                    navigate(`/location/${ response.facilityAuths[0] }`)
                } else {
                    navigate("/locations")
                }
            }
        })   
    }

    return (
        <main className="container">
            <div className="row title-row mt-5 mb-2">
                <div className="col text-center">
                    <h2>Log In</h2>
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
                    <div className="col col-info">
                        <div className="col-head">
                            Password
                        </div>
                        <div className="col-content">
                            <input 
                                className="loginInput"
                                type="password" 
                                name="password" 
                                value={ changes.password } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info title-row">
                    <div className="col-info">
                        <Button text="Log In" linkTo={ submitLogin } type="action" id="loginBtn" />
                        <Button text="Forgot Password?" linkTo="/reset" type="nav" id="resetPass" />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LogIn