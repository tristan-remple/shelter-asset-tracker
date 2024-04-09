// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Search from '../Reusables/Search'
import CommentBox from '../Reusables/CommentBox'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single building.
// The units within the building are displayed as well.
// Imported by: App

const LocationDetails = () => {

    // get context information
    const { id } = useParams()
    const { status } = useContext(statusContext)

    let urlId = id

    // validate id
    if (urlId === undefined) {
        urlId = authService.userInfo().location.locationId
        if (urlId === 0 || urlId === undefined) {
            console.log("undefined id")
            return <Error err="undefined" />
        }
    }

    // fetch unit data from the api
    const response = apiService.singleLocation(urlId)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure api response
    const { location, units } = response
    const { locationName, locationId, locationType, added, deleteDate, comments } = location

    // if it has been deleted, throw an error
    if (deleteDate) {
        return <Error err="deleted" />
    }

    // if the user is admin, populate admin buttons
    const { isAdmin } = useContext(authContext)
    let adminButtons = ""
    if (isAdmin) {
        adminButtons = (
            <>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Add Unit" linkTo={ `/location/${ locationId }/add` } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Edit Location" linkTo={ `/location/${ locationId }/edit` } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete Location" linkTo={ `/location/${ locationId }/delete` } type="admin" />
                </div>
            </>
        )
    }

    // put the units that have items which need to be assessed or discarded at the top of the list
    units.sort((a, b) => {
        return a.unitName.localeCompare(b.unitName)
    }).sort((a, b) => {
        return a.toInspectItems < b.toInspectItems ? 1 : 0
    }).sort((a, b) => {
        return a.toDiscardItems < b.toDiscardItems ? 1 : 0
    })

    const [ filteredUnits, setFilteredUnits ] = useState(units)

    // map the unit objects into table rows
    const displayItems = filteredUnits.map(item => {

        // flag options are defined in the flag module
        let flagColor = flagColorOptions[0]
        let flagText = flagTextOptions[0]
        if ( item.toDiscardItems > 0 ) {
            flagColor = flagColorOptions[2]
            flagText = flagTextOptions[2]
        } else if ( item.toInspectItems > 0 ) {
            flagColor  = flagColorOptions[1]
            flagText = flagTextOptions[1]
        }

        return (
            <tr key={ item.unitId } >
                <td>{ item.unitName }</td>
                <td>{ capitalize(item.unitType) }</td>
                <td><Button text="Details" linkTo={ `/unit/${ item.unitId }` } type="small" /></td>
                <td><Flag color={ flagColor } /> { flagText }</td>
            </tr>
        )
    })

    return (
        <main className="container mt-3">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>{ locationName }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="See All" linkTo="/locations" type="nav" />
                </div>
                { adminButtons }
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
                            Type
                        </div>
                        <div className="col-content">
                            { capitalize(locationType) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(added.addedDate) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-8 col-content">
                        <CommentBox comments={ comments } />
                    </div>
                </div>
                <Search data={ units } setData={ setFilteredUnits } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Unit</th>
                            <th scope="col">Type</th>
                            <th scope="col">Details</th>
                            <th scope="col">Status</th>
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

export default LocationDetails