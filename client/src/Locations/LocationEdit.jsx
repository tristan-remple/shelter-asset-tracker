// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import capitalize from '../Services/capitalize'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Dropdown from '../Components/Dropdown'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

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
    const [ forceValidation, setForceValidation ] = useState(0)

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
        user: {
            name: "",
            userId: 0
        },
        created: "",
        types: [],
        errorFields: []
    })

    // destructure api response
    useEffect(() => {
        if (location) {
            const { name, facilityId, created, types, manager } = location
            setChanges({
                facilityId,
                name,
                created,
                types,
                user: {
                    name: manager?.name,
                    userId: manager?.id
                },
                errorFields: []
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
            setStatus({
                message: "",
                error: false
            })
        } else {
            const newChanges = { ...changes }
            if (newChanges.errorFields.indexOf("user.name") === -1) {
                newChanges.errorFields.push("user.name")
                setChanges(newChanges)
            }
            setStatus({
                message: "The user you selected cannot be found.",
                error: true
            })
        }
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // validate title
        if (changes.name == "" || changes.user.name === "" || changes.user.name === "Select:" || changes.errorFields.length > 0) {
            setStatus({
                message: "Please verify that all necessary fields have been filled out correctly.",
                error: true
            })
            setForceValidation(forceValidation + 1)
            return
        }

        // shape object for api
        changes.managerId = changes.user.userId

        // send api request and process api response
        await apiService.postLocationEdit(changes, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully updated ${ response.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/location/${ response.id }`)
            }
        })
    }

    const formControls = { 
        changes, setChanges, unsaved, setUnsaved, 
        force: forceValidation
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
                    <Button text={ deletedLabel } linkTo={ `/location/${ changes.facilityId }/delete` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Title *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="name"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Manager *
                        </div>
                        <div className="col-content">
                            <Dropdown 
                                list={ simpleUsers } 
                                current={ changes.user.name } 
                                setCurrent={ handleUserChange }
                                error={ changes.errorFields.indexOf("user.name") !== -1 }
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
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${ changes.facilityId }` } locationId={ changes.facilityId } /> }
        </main>
    )
}
}

export default LocationEdit