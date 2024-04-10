// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import authService from '../Services/authService'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module checks that the user wants to delete a location.
// Imported by: App

const LocationDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const location = apiService.locationEdit(id)
    if (!location || location.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure the unit
    const { locationId, locationName } = location

    // send delete api call
    const confirmDelete = () => {
        if (authService.checkUser() && authService.checkAdmin()) {
            const response = apiService.deleteUnit(location)
            if (response.success) {
                setStatus(`You have successfully deleted unit ${ response.locationName }.`)
                navigate(`/locations`)
            } else {
                setStatus("We weren't able to process your delete location request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleting { locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ locationId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/location/${ locationId }` } locationId={ locationId } />
            </div>
        </main>
    )
}

export default LocationDelete