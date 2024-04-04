import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { statusContext } from '../Services/Context'
import authService from '../Services/authService'
import apiService from '../Services/apiService'
import { adminDate } from '../Services/dateHelper'
import handleChanges from '../Services/handleChanges'

import Error from '../Reusables/Error'
import Button from '../Reusables/Button'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows the admin to edit a specific user.
// Imported by: App

const UserEdit = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // check that active user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // validate id
    if (id === undefined || id === "undefined") {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch user data from the api
    const response = apiService.singleUser(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    const { userId, userName, userType, created, deleted, location } = response

    // set up the change panel state
    const [ unsaved, setUnsaved ] = useState(false)

    // form handling state
    const [ changes, setChanges ] = useState({
        userId,
        userName,
        admin: userType == "admin" ? true: false,
        added: {
            addedDate: created
        },
        location
    })

    // list of locations for dropdown
    const locations = apiService.listLocations()
    const locationTitles = locations.map(loc => loc.locationName)
    if (!locations || locations.error || locations.length === 0) {
        return <Error err="api" />
    }

    // handles location change
    // passed into Dropdown
    const handleLocationChange = (newLocName) => {
        const newLocIndex = locations.map(loc => loc.locationName).indexOf(newLocName)
        if (newLocIndex !== -1) {
            const newChanges = {...changes}
            newChanges.location = locations[newLocIndex]
            setChanges(newChanges)
            setUnsaved(true)
            setStatus("")
        } else {
            setStatus("The location you have selected cannot be found.")
        }
    }

    // send data to the api
    const saveChanges = () => {

        // validation
        if (changes.userName === "") {
            setStatus("Please enter a username.")
            return
        }

        // convert the changes object into a valid user object
        const newUser = {...changes}
        if (newUser.admin === true) {
            newUser.userType = "admin"
        } else {
            newUser.userType = "general"
        }
        delete newUser.admin
        newUser.created = newUser.added.addedDate
        delete newUser.added

        const response = apiService.postUserEdit(newUser)
        if (response.success) {
            setStatus(`You have successfully updated user ${response.userName}.`)
            setUnsaved(false)
            navigate(`/user/${response.userId}`)
        } else {
            setStatus("We weren't able to process your edit user request.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Editing User { userName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/user/${ userId }` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Delete" linkTo={ `/users/${id}/delete` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            User Name
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
                    <div className="col col-info">
                        <div className="col-head">
                            Admin?
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="admin" 
                                checked={ changes.admin }
                                onChange={ (event) => handleChanges.handleCheckChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Date Added
                        </div>
                        <div className="col-content">
                            <input 
                                type="date" 
                                name="addedDate" 
                                value={ adminDate(changes.added.addedDate) } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            <Dropdown 
                                list={ locationTitles } 
                                current={ changes.location.locationName } 
                                setCurrent={ handleLocationChange }
                            />
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/user/${ userId }` } /> }
            </div>
        </main>
    )
}

export default UserEdit