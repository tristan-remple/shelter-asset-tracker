// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import ChangePanel from '../Reusables/ChangePanel'
import CommentBox from '../Reusables/CommentBox'

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

    // fetch unit data from the api
    const location = apiService.locationEdit(id)
    if (!location || location.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure api response
    const { locationName, locationId, locationType, added, deleteDate, comments } = location

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // set delete label
    const [ deletedLabel, setDeletedLabel ] = useState("Delete Location")
    if (deleteDate) {
        setDeletedLabel("Restore Location")
    }

    // set possible changes
    const [ changes, setChanges ] = useState({
        locationName,
        locationType,
        added,
        comment: ""
    })

    // Most changes are handled by Services/handleChanges

    // sends the item object to the apiService
    const saveChanges = () => {

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {
            // send api request and process api response
            const response = apiService.postLocationEdit(changes)
            if (response.success) {
                setStatus(`You have successfully updated ${ response.locationName }.`)
                setUnsaved(false)
                navigate(`/location/${ response.locationId }`)
            } else {
                setStatus("We weren't able to process your add item request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>{ locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ locationId }` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Add Unit" linkTo={ `/location/${ locationId }/add` } type="admin" />
                </div>
                <div className="col-2">
                    <Button text={ deletedLabel } linkTo={ `/location/${ locationId }/delete` } type="admin" />
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
                                name="locationName" 
                                value={ changes.locationName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Type
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="locationType" 
                                value={ changes.locationType } 
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
                        <CommentBox comments={ comments } />
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${id}` } locationId={ locationId } /> }
        </main>
    )
}

export default LocationEdit