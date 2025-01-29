// external dependencies
import { useContext, useEffect, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext, userContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module displays a list of all locations.
// Imported by: App

const LocationList = () => {

    // get the status from context, set it to a warning
    const { status, setStatus } = useContext(statusContext)
    const { userDetails } = useContext(userContext)
    const [ err, setErr ] = useState("loading")

    if (userDetails.facilityAuths.length === 0 && !userDetails.isAdmin) {
        setStatus({
            message: "You are not currently assigned to any locations. Please contact an admin.",
            error: true
        })
    }

    // fetch data from the api
    const [ locations, setResponse ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.listLocations(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    console.log(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (locations) {
    
    // if the user is admin, populate admin buttons
    let adminButtons = ""
    if (userDetails.isAdmin) {
        adminButtons = (
            <div className="col-2 d-flex justify-content-end">
                <Button text="Add Location" linkTo="/locations/add" type="admin"/>
            </div>
        )
    }

    // sort locations alphabetically
    locations.filter(loc => {
        return userDetails.facilityAuths.some(id => id === loc.id)
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

    // map the unit objects into table rows
    const displayItems = locations.map(item => {
        return (
            <tr key={ item.id } >
                <td>{ item.name }</td>
                <td>{ item.units.length }</td>
                <td><Button text="Details" linkTo={ `/location/${ item.id }` } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2 className='mt-2'>All Locations</h2>
                </div>
                { adminButtons }
            </div>
            <div className="page-content">
                <Statusbar />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Location</th>
                            <th scope="col">Unit Count</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default LocationList