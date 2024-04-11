import { useContext, useState, useEffect } from 'react'
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
    const [ err, setErr ] = useState(null)

    // check that active user is an admin
    if (!authService.checkAdmin()) {
        setErr("permission")
    }

    // validate id
    if (id === undefined || id === "undefined") {
        setErr("undefined")
    }

    // set up the change panel state
    const [ unsaved, setUnsaved ] = useState(false)

    // form handling state
    const [ changes, setChanges ] = useState({
        id: 0,
        name: "",
        email: "",
        isAdmin: false,
        createdAt: "",
        updatedAt: "",
        facilities: [],
        locations: []
    })

    // fetch user data from the api
    const [ user, setUser ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.singleUser(userId, function(data){
                if (!data || data.error) {
                    setErr("api")
                    return
                }
                data.locations = []
                setUser(data),
                setChanges(data)
            })
        })()
    }, [])

    // list of locations for dropdown
    useEffect(() => {
        (async()=>{
            await apiService.listLocations(function(data){
                if (!data || data.error) {
                    setErr("api")
                    return
                }
                const newChanges = {...changes}
                newChanges.locations = data
            })
        })()
    }, [])

    const locationSelector = locations.map(loc => {
        return <input 
            type="checkbox"
            name={ loc.name } 
            checked={ true }
            onChange={ (event) => handleChanges.handleCheckChange(event, changes, setChanges, setUnsaved) } 
        />
    })

    // send data to the api
    const saveChanges = () => {

        // validation
        if (changes.name === "") {
            setStatus("Please enter a username.")
            return
        }

        // convert the changes object into a valid user object
        const newUser = {...changes}
        delete newUser.isAdmin
        newUser.createdAt = newUser.added.addedDate
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
                    <h2>Editing User { user.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/user/${ user.id }` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Delete" linkTo={ `/users/${ user.id }/delete` } type="danger" />
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
                                name="name" 
                                value={ changes.name } 
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
                                name="isAdmin" 
                                checked={ changes.isAdmin }
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
                                name="createdAt" 
                                value={ adminDate(changes.createdAt) } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Locations
                        </div>
                        {/* <div className="col-content">
                            <Dropdown 
                                list={ locationTitles } 
                                current={ changes.location.locationName } 
                                setCurrent={ handleLocationChange }
                            />
                        </div> */}
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/user/${ userId }` } /> }
            </div>
        </main>
    )
}

export default UserEdit