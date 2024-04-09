// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import capitalize from '../Services/capitalize'
import validatePhone from '../Services/validatePhone'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import ChangePanel from '../Reusables/ChangePanel'
import CommentBox from '../Reusables/CommentBox'
import Dropdown from '../Reusables/Dropdown'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows an admin to edit a location.
// Imported by: App

const LocationEdit = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // check that user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // fetch data from the api
    const [ location, setResponse ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.singleLocation(id, function(data){
                if (!data || data.error) {
                    console.log("api error")
                    return <Error err="api" />
                }
                setResponse(data)
            })
        })()
    }, [])

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // set delete label
    const [ deletedLabel, setDeletedLabel ] = useState("Delete Location")

    // set possible changes
    const [ changes, setChanges ] = useState({
        name: "",
        // phone: "",
        user: {
            userName: "",
            userId: 0
        },
        created: "",
        types: []
        // comment: ""
    })

    // destructure api response
    useEffect(() => {
        if (location) {
            const { name, facilityId, created, types, phone, user } = location
            setChanges({
                facilityId,
                name,
                created,
                types,
                user: {
                    userName: "",
                    userId: 0
                }
            })
        }
    }, [ location ])

    if (location) {

    // get the list of users
    const users = apiService.listUsers()
    if (!users || users.error) {
        return <Error err="api" />
    }

    // if (deleteDate) {
    //     setDeletedLabel("Restore Location")
    // }

    // Most changes are handled by Services/handleChanges

    // user dropdown expects an array of strings
    const simpleUsers = users.map(usr => usr.userName)

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

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {

            // validate title
            if (changes.name == "") {
                setStatus("Locations must have a title.")
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
            await apiService.postLocationEdit(changes, (response) => {
                if (response.status === 200) {
                    setStatus(`You have successfully updated ${ response.name }.`)
                    setUnsaved(false)
                    navigate(`/location/${ response.facilityId }`)
                } else {
                    setStatus("We weren't able to process your add item request.")
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
                    <h2>{ changes.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ changes.facilityId }` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Add Unit" linkTo={ `/location/${ changes.facilityId }/add` } type="admin" />
                </div>
                <div className="col-2">
                    <Button text={ deletedLabel } linkTo={ `/location/${ changes.facilityId }/delete` } type="admin" />
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
                                name="name" 
                                value={ changes.name } 
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
                            Unit Types
                        </div>
                        <div className="col-content">
                            { capitalize( changes.types.join(", ") ) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            <input 
                                type="date" 
                                name="created" 
                                value={ changes.created.split("T")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="row row-info">
                    <div className="col-8 col-content">
                        <strong>New Comment: </strong><br />
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                        <CommentBox comments={ comments } />
                    </div>
                </div> */}
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${ changes.facilityId }` } locationId={ changes.facilityId } /> }
        </main>
    )
}
}

export default LocationEdit