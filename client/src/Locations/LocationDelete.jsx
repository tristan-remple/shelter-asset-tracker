// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// ** Available for SCSS **
// This module checks that the user wants to delete a location.
// Imported by: App

const LocationDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
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
                    if (data.units.length > 0) {
                        setStatus({
                            message: "You cannot delete a location that contains units.",
                            error: true
                        })
                        navigate(`/location/${ id }`)
                    } else {
                        setStatus({
                            message: `Click Save to delete location ${ data.name }.`,
                            error: false
                        })
                        setErr(null)
                    }
                }
            })
        })()
    }, [])
    
    if (err) { return <Error err={ err } /> }
    if (location) {
    // send delete api call
    const confirmDelete = async() => {
        await apiService.deleteLocation(location, (response) => {
            console.log(response)
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully deleted location ${ response.name }.`,
                    error: false
                })
                navigate(`/locations`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleting { location.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${ location.facilityId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <ChangePanel save={ confirmDelete } linkOut={ `/location/${ location.facilityId }` } locationId={ location.facilityId } />
            </div>
        </main>
    )
}
}

export default LocationDelete