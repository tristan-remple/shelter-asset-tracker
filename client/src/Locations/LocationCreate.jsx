// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

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
    const [ err, setErr ] = useState(null)

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

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
            name: "Select:"
        }
    })

    const [ users, setUsers ] = useState([])
    const [ simpleUsers, setSimpleUsers ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.listUsers(function(data){
                if (data?.error.error === "Unauthorized.") {
                    setErr("permission")
                } else if (!data || data.error) {
                    setErr("api")
                } else {
                    setUsers(data)
                    const simple = data.map(usr => usr.name)
                    setSimpleUsers(simple)
                }
            })
        })()
    }, [])

    // Most changes are handled by Services/handleChanges

    // user dropdown expects an array of strings

    // user dropdown functionality
    // take the string and assign the corresponding user object to the location object
    const handleUserChange = (newUser) => {
        const newUserIndex = users.map(usr => usr.name).indexOf(newUser)
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

        changes.managerId = changes.user.userId

        // send api request and process api response
        await apiService.postLocation(changes, (response) => {
            if (response.success) {
                setStatus(`You have successfully created ${ response.name }.`)
                setUnsaved(false)
                navigate(`/location/${ response.facilityId }`)
            } else {
                setStatus("We weren't able to process your add location request.")
            }
        })
    }

    if (err) { return <Error err={ err } /> }
    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Add a New Location</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="All Locations" linkTo="/locations" type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2 '>{ status }</p></div> }
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
                                current={ changes.user.name } 
                                setCurrent={ handleUserChange }
                            />
                        </div>
                    </div>
                    {/* <div className="col col-info">
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
                    </div> */}
                </div>
                {/* <div className="row row-info">
                    <div className="col-8 col-content">
                        <p className="mb-2">
                            <strong>Comments:</strong><br />
                        </p>
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area mb-5" 
                        />
                    </div>
                </div> */}
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/locations` } locationId={ null } /> }
        </main>
    )
}

export default LocationCreate