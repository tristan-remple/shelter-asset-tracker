// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { formattedDate, friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows an admin to add a new unit to a location.
// Imported by: App

const UnitCreate = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState(null)

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // check that user is an admin
    if (!authService.checkAdmin()) {
        setErr("permission")
    }

    // fetch data from the api
    const [ response, setResponse ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleLocation(id, (data) => {
                if (!data || data.error) {
                    setErr("api")
                }
                setResponse(data)
            })
        })()
    }, [])

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // set possible changes
    const [ changes, setChanges ] = useState({
        name: "",
        type: "",
        facilityId: undefined
    })

    useEffect(() => {
        if (response) {
            setChanges({
                facilityId: response.facilityId
            })
        }
    }, [ response ])

    if (response) {
    // destructure api response
    const { facilityId, name: facilityName } = response

    // sends the item object to the apiService
    const saveChanges = () => {

        // light validation
        if (changes.name == "" || changes.type == "") {
            setStatus("A new unit must have a name and a type.")
            return
        }

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {
            // send api request and process api response
            const response = apiService.postNewUnit(changes, (response) => {
                if (response.success) {
                    setStatus(`You have successfully created unit ${ changes.name }.`)
                    setUnsaved(false)
                    navigate(`/unit/${ response.unitId }`)
                } else {
                    setStatus("We weren't able to process your add unit request.")
                }
            })
        } else {
            setErr("permission")
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row my-3">
                <div className="col">
                    <h2>New Unit in { facilityName }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/location/${ facilityId }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { facilityName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            <input 
                               className='my-2'
                                type="text" 
                                name="name" 
                                value={ changes.name } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Type
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="type" 
                                value={ changes.type } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${ facilityId }` } locationId={ facilityId } /> }
        </main>
    )
}
}

export default UnitCreate