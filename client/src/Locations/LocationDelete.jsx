// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

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
    // const location = apiService.locationEdit(id)
    // if (!location || location.error) {
    //     console.log("api error")
    //     return <Error err="api" />
    // }

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
    
    if (location) {
    // send delete api call
    const confirmDelete = async() => {
        if (authService.checkUser() && authService.checkAdmin()) {
            console.log(location)
            await apiService.deleteUnit(location, (response) => {
                if (response.success) {
                    setStatus(`You have successfully deleted unit ${ response.name }.`)
                    navigate(`/locations`)
                } else {
                    setStatus("We weren't able to process your delete location request.")
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
                    <h2>Deleting { location.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ location.facilityId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/location/${ location.facilityId }` } locationId={ location.facilityId } />
            </div>
        </main>
    )
}
}

export default LocationDelete