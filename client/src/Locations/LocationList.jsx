// external dependencies
import { useContext, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays a list of all locations.
// Imported by: App

const LocationList = () => {

    // get the status from context, set it to a warning
    const { status, setStatus } = useContext(statusContext)
    useEffect(() => {
        if (!authService.checkAdmin()) {
            setStatus('You may not need to view or edit locations other than your assigned location.')
        }
    }, [])
    
    // get the locations from the api
    const locations = apiService.listLocations()
    if (!locations || locations.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // if the user is admin, populate admin buttons
    const { isAdmin } = useContext(authContext)
    let adminButtons = ""
    if (isAdmin) {
        adminButtons = (
            <div className="col-2">
                <Button text="Add Location" linkTo="/locations/add" type="admin" />
            </div>
        )
    }

    // sort locations alphabetically
    locations.sort((a, b) => {
        return a.locationName.localeCompare(b.locationName)
    })

    // map the unit objects into table rows
    const displayItems = locations.map(item => {

        return (
            <tr key={ item.locationId } >
                <td>{ item.locationName }</td>
                <td>{ item.units }</td>
                <td><Button text="Details" linkTo={ `/location/${ item.locationId }` } type="small" /></td>
            </tr>
        )
    })

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>All Shelter NS Locations</h2>
                </div>
                { adminButtons }
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
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

export default LocationList