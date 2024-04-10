// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'

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

    // fetch unit data from the api
    const response = apiService.singleLocation(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure api response
    const { location } = response
    const { locationId, locationName } = location

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // set possible changes
    const [ changes, setChanges ] = useState({
        unitName: "",
        unitType: "",
        added: {
            addedDate: formattedDate()
        },
        comment: ""
    })

    // sends the item object to the apiService
    const saveChanges = () => {

        // light validation
        if (changes.unitName == "" || changes.unitType == "") {
            setStatus("A new unit must have a name and a type.")
            return
        }

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {
            // send api request and process api response
            const response = apiService.postNewUnit(changes)
            if (response.success) {
                setStatus(`You have successfully created ${ response.unitName }.`)
                setUnsaved(false)
                navigate(`/unit/${ response.unitId }`)
            } else {
                setStatus("We weren't able to process your add item request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>New Unit in { locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ locationId }` } type="nav" />
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
                            Location
                        </div>
                        <div className="col-content">
                            { locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="unitName" 
                                value={ changes.unitName } 
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
                                name="unitType" 
                                value={ changes.unitType } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
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
                <div className="row row-info">
                    <div className="col-8 col-content">
                        <strong>New Comment: </strong><br />
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${id}` } locationId={ locationId } /> }
        </main>
    )
}

export default UnitCreate