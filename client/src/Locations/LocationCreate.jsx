// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import { formattedDate } from '../Services/dateHelper'
import validatePhone from '../Services/validatePhone'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import ChangePanel from '../Reusables/ChangePanel'
import Dropdown from '../Reusables/Dropdown'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows an admin to edit a location.
// Imported by: App

const LocationCreate = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // check that user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // get the list of users
    const users = apiService.listUsers()
    if (!users || users.error) {
        return <Error err="api" />
    }

    // set possible changes
    const [ changes, setChanges ] = useState({
        locationName: "",
        phone: "",
        added: {
            addedDate: formattedDate()
        },
        // comment: "",
        user: {
            userId: 0,
            userName: "Select:"
        }
    })

    // Most changes are handled by Services/handleChanges

    // user dropdown expects an array of strings
    const simpleUsers = users.map(usr => usr.userName)
    simpleUsers.unshift("Select:")

    // user dropdown functionality
    // take the string and assign the corresponding user object to the location object
    const handleUserChange = (newUser) => {
        const newUserIndex = users.map(usr => usr.userName).indexOf(newUser)
        if (newUserIndex !== -1) {
            const newChanges = {...changes}
            newChanges.user = users[newUserIndex]
            setChanges(newChanges)
            setUnsaved(true),
            setStatus("")
        } else {
            setStatus("The user you selected cannot be found.")
        }
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // validate title
        if (changes.locationName === "") {
            setStatus("A new location must have a title.")
            return
        }

        // validate phone number
        const validPhone = validatePhone(changes.phone)
        if (validPhone.error) {
            setStatus(validPhone.error)
            return
        }
        changes.phone = validPhone.number

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {

            changes.managerId = changes.user.userId

            // send api request and process api response
            await apiService.postLocation(changes, (response) => {
                if (response.status === 201) {
                    setStatus(`You have successfully created ${ response.name }.`)
                    setUnsaved(false)
                    navigate(`/location/${ response.id }`)
                } else {
                    setStatus("We weren't able to process your add location request.")
                }
            })
            
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Add a New Location</h2>
                </div>
                <div className="col-2">
                    <Button text="All Locations" linkTo="/locations" type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Title
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="locationName" 
                                value={ changes.locationName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Phone Number
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="phone" 
                                value={ changes.phone } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Primary User
                        </div>
                        <div className="col-content">
                            <Dropdown 
                                list={ simpleUsers } 
                                current={ changes.user.userName } 
                                setCurrent={ handleUserChange }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            <input 
                                type="date" 
                                name="addedDate" 
                                value={ changes.added.addedDate.split(" ")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="row row-info">
                    <div className="col-8 col-content">
                        <p>
                            <strong>Comments:</strong><br />
                        </p>
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                    </div>
                </div> */}
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/locations` } locationId={ null } /> }
        </main>
    )
}

export default LocationCreate