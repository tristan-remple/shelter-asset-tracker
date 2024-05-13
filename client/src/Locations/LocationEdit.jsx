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
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ location, setResponse ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.singleLocation(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    setErr(null)
                }
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
            name: "",
            userId: 0
        },
        created: "",
        types: []
        // comment: ""
    })

    // destructure api response
    useEffect(() => {
        if (location) {
            const { name, facilityId, created, types, phone, manager } = location
            setChanges({
                facilityId,
                name,
                created,
                types,
                user: {
                    name: manager.name,
                    userId: manager.id
                }
            })
        }
    }, [ location ])

    // get the list of users
    const [ users, setUsers ] = useState([])
    const [ simpleUsers, setSimpleUsers ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.listUsers(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUsers(data)
                    const simple = data.map(usr => usr.name)
                    setSimpleUsers(simple)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (location && users.length > 0) {

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

        // shape object for api
        changes.phone = validPhone.number
        changes.managerId = changes.user.userId

        // send api request and process api response
        await apiService.postLocationEdit(changes, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully updated ${ response.name }.`)
                setUnsaved(false)
                navigate(`/location/${ response.id }`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>{ changes.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/location/${ changes.facilityId }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Add Unit" linkTo={ `/location/${ changes.facilityId }/add` } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
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
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Types
                        </div>
                        <div className="col-content">
                            { changes.types.length > 0 ? capitalize( changes.types.join(", ") ) : "No units yet" }
                        </div>
                    </div>
                    {/* <div className="col col-info">
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
                    </div> */}
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${ changes.facilityId }` } locationId={ changes.facilityId } /> }
        </main>
    )
}
}

export default LocationEdit