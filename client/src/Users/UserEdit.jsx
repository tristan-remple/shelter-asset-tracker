import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { statusContext, userContext } from '../Services/Context'
import authService from '../Services/authService'
import apiService from '../Services/apiService'
import { adminDate } from '../Services/dateHelper'
import handleChanges from '../Services/handleChanges'

import Error from '../Reusables/Error'
import Button from '../Reusables/Button'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'
import Checkbox from '../Reusables/Checkbox'

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
    const { userDetails } = useContext(userContext)
    const { userId, isAdmin, facilityAuths } = userDetails

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

    // state that holds original data to check if an api call needs to be made
    const [ originalData, setOriginalData ] = useState({
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
        if (isAdmin) {
            await apiService.listLocations(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    const newChanges = {...userData}
                    // add true or false to the location based on the user's permissions
                    const toggledLocations = data.map(loc => {
                        loc.active = newChanges.facilities.some(fac => fac.facilityId === loc.id)
                        loc.original = newChanges.facilities.some(fac => fac.facilityId === loc.id)
                        return loc
                    })
                    newChanges.facilities = toggledLocations
                    setChanges(newChanges)
                    setOriginalData(newChanges)
                }
            })
        } else {
            setChanges(userData)
        }
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

    // handle toggles to the location auth checkboxes
    const handleLocations = (event) => {
        const fieldName = event.target.id ? parseInt(event.target.id) : parseInt(event.target.parentNode.id)
        const newChanges = {...changes}
        const currentIndex = newChanges.facilities.findIndex(loc => loc.id === fieldName)
        newChanges.facilities[currentIndex].active = newChanges.facilities[currentIndex].active ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    // create list of checkboxes for location auths
    const locationSelector = changes.facilities?.map(loc => {
        return (
            <li key={ loc.id }>
                <Checkbox 
                    id={ loc.id }
                    name={ loc.name }
                    checked={ loc.active }
                    changeHandler={ (event) => handleLocations(event, changes, setChanges, setUnsaved) }
                />
            </li>
        )
    })

    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    // send data to the api
    const saveChanges = async() => {

        // validation
        if (changes.name === "") {
            setStatus("Please enter a name.")
            return
        } else if (changes.email === "" || !validateEmail(changes.email)) {
            setStatus("Please provide a valid email.")
            return
        }

        // convert the changes locations array into a facility auths array of ids only and only for active locations
        const newUser = {...changes}
        newUser.facilityAuths = newUser.facilities.filter(loc => loc.active).map(loc => loc.id)

        // if the users name or email have changed, send changes to the api
        if (newUser.name !== originalData.name || newUser.email !== originalData.email) {
            await apiService.postUserEdit(newUser, (response) => {
                if (response.error) {
                    setStatus("We weren't able to process your edit user request.")
                    return
                } else {
                    setStatus(`You have successfully updated user ${newUser.name}.`)
                    setUnsaved(false)
                }
            })
        }

        // if the user's facility auths have changed, send new list to the api
        if (!newUser.facilities.every(fac => fac.active === fac.original)) {
            await apiService.postUserAuths(newUser, (response => {
                if (response.error) {
                    setStatus("We weren't able to process your request to update user location assignments.")
                    return
                } else {
                    setStatus(`You have successfully updated user ${newUser.name}'s location assignments.`)
                    setUnsaved(false)
                    navigate(`/user/${ changes.id }`)
                }
            }))
        }

        // return to the user details page
        navigate(`/user/${ changes.id }`)
        
    }

    const changeAdmin = async() => {
        if (!confirm("Changing the admin status of a user is a serious action. Are you sure?")) {
            return
        }
        if (originalData.id === 1) {
            setStatus("You cannot change the admin status of user 1.")
            return
        }
        const newUser = {...changes}
        newUser.isAdmin = originalData.isAdmin ? false : true
        await apiService.postAdminEdit(newUser, (response) => {
            if (response.error) {
                setStatus("We weren't able to process your edit admin request.")
                return
            } else {
                const newStatus = newUser.isAdmin ? `User ${ newUser.name } has been promoted to admin.` : `User ${ newUser.name } is no longer an admin.`
                setStatus(newStatus)
                navigate(`/user/${ changes.id }`)
            }
        })
    }

    if (err) { return <Error err={ err } /> }
    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Editing User { originalData.name }</h2>
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
                    </div>
                </div>
                { isAdmin && (
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Admin?
                        </div>
                        <div className="col-content">
                            <div className="col">
                                <Button text={ originalData.isAdmin ? "Remove Admin" : "Grant Admin" } linkTo={ changeAdmin } type="admin" />
                                <p>
                                    Setting a user to admin allows them full access to everything. This includes the ability to edit other users and change the admin status of other users. It also includes the ability to view the dashboard and create, edit, and delete templates, locations, and units.
                                    <br /><br />
                                    Be careful who you grant this role to, and make sure at least one person is an admin.
                                </p>
                            </div>
                        </div>
                    </div>
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
                )}
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/user/${ changes.id }` } /> }
            </div>
        </main>
    )
}

export default UserEdit