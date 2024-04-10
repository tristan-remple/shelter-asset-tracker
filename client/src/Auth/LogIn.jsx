// external dependencies
import { useContext, useState, useEffect } from "react"
import { statusContext } from "../Services/Context"
import { useNavigate, redirect } from "react-router-dom"

// internal dependencies
import handleChanges from "../Services/handleChanges"
import authService from "../Services/authService"

// components
import Button from '../Reusables/Button'

//------ MODULE INFO
// ** Available for SCSS **
// This page allows users to log in.
// It has the "/" route, so it will be the first thing users see.
// It automatically redirects to "/location" if the user is already logged in.
// Imported by: App

const LogIn = () => {

    // set up
    const navigate = useNavigate()
    const { status, setStatus } = useContext(statusContext)

    // check if user is already logged in
    useEffect(() => {
        if (authService.checkUser()) {
            navigate("/location")
        }
    }, [])
    
    // form handling
    const [ changes, setChanges ] = useState({
        userName: "",
        password: ""
    })
    const [ unsaved, setUnsaved ] = useState(false)

    // process form submit
    const submitLogin = () => {

        // validation
        if (changes.userName === "" || changes.password === "") {
            setStatus("Please enter your username and password.")
            return
        }

        // api call
        const response = authService.login(changes)
        if (response.success) {
            setStatus(`Welcome, ${ response.userName }.`)
            setUnsaved(false)
            navigate("/location")
        } else {
            setStatus("We weren't able to validate your credentials.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Log In</h2>
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Username
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="userName" 
                                value={ changes.userName } 
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
                                type="password" 
                                name="password" 
                                value={ changes.password } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <Button text="Log In" linkTo={ submitLogin } type="action" />
                </div>
            </div>
        </main>
    )
}

export default LogIn