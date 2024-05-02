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
    const [ err, setErr ] = useState("loading")

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
        facilities: []
    })

    // get the full array of locations
    const getLocations = async(userData) => {
        await apiService.listLocations(function(data){
            if (data.error) {
                setErr(data.error)
            } else {
                const newChanges = {...userData}
                // add true or false to the location based on the user's permissions
                const toggledLocations = data.map(loc => {
                    loc.active = newChanges.facilities.some(fac => fac.facilityId === loc.id)
                    return loc
                })
                newChanges.facilities = toggledLocations
                setChanges(newChanges)
            }
        })
    }

    // fetch user data from the api
    useEffect(() => {
        (async()=>{

            // get the user
            await apiService.singleUser(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setErr(null)
                    getLocations(data)
                }
            })
        })()
    }, [])

    const handleLocations = (event, changes, setChanges, setUnsaved) => {
        const fieldName = parseInt(event.target.name)
        const newChanges = {...changes}
        const currentIndex = newChanges.facilities.findIndex(loc => loc.id === fieldName)
        newChanges.facilities[currentIndex].active = newChanges.facilities[currentIndex].active ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    const locationSelector = changes.facilities?.map(loc => {
        return (
            <li key={ loc.id }>
                <label htmlFor={ loc.id }>{ loc.name }</label>
                <input 
                    type="checkbox"
                    name={ loc.id } 
                    checked={ loc.active }
                    onChange={ (event) => handleLocations(event, changes, setChanges, setUnsaved) } 
                />
            </li>
        )
    })

    // send data to the api
    const saveChanges = async() => {

        // validation
        if (changes.name === "") {
            setStatus("Please enter a username.")
            return
        }

        // convert the changes object into a valid user object
        const newUser = {...changes}
        newUser.auths = newUser.facilities.filter(loc => loc.active).map(loc => loc.id)

        await apiService.postUserEdit(newUser, (response) => {
            if (response.error) {
                setStatus("We weren't able to process your edit user request.")
            } else {
                setStatus(`You have successfully updated user ${response.name}.`)
                setUnsaved(false)
                navigate(`/user/${ changes.id }`)
            }
        })
        
    }

    if (err) { return <Error err={ err } /> }
    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Editing User { changes.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/user/${ changes.id }` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Delete" linkTo={ `/users/${ changes.id }/delete` } type="danger" />
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
                    {/* <div className="col col-info">
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
                    </div> */}
                    <div className="col col-info">
                        <div className="col-head">
                            Locations
                        </div>
                        <div className="col-content">
                            <ul>
                                { locationSelector }
                            </ul>
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/user/${ changes.id }` } /> }
            </div>
        </main>
    )
}

export default UserEdit