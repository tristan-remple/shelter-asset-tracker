// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { userContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Flag, { flagOptions } from "../Components/Flag"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single building.
// The units within the building are displayed as well.
// Imported by: App

const LocationDetails = () => {

    // get context information
    const { id } = useParams()
    const [ err, setErr ] = useState("loading")
    const { userDetails } = useContext(userContext)
    const { isAdmin, facilityAuths } = userDetails
    
    // fetch unit data from the api
    const [ response, setResponse ] = useState()
    const [ filteredUnits, setFilteredUnits ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.singleLocation(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    setFilteredUnits(data.units)
                    setErr(null)
                }
            })
        })()
    }, [])


    if (err) { return <Error err={ err } /> }
    // destructure api response
    if (response) {

    const { facilityId, name, created, updated, units, types, phone } = response

    // if the user is admin, populate admin buttons
    let adminButtons = ""
    if (isAdmin) {
        adminButtons = (
            <>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Add Unit" linkTo={ `/location/${ facilityId }/add` } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Edit Location" linkTo={ `/location/${ facilityId }/edit` } type="admin" />
                </div>
            </>
        )
    }

    // show the list of locations button if the user is an admin or if they're assigned to multiple locations
    let listButton = ""
    if (isAdmin || facilityAuths.length > 1) {
        listButton = <div className="col-2 d-flex justify-content-end">
            <Button text="See All" linkTo="/locations" type="nav" />
        </div>
    }

    // put the units that have items which need to be assessed or discarded at the top of the list
    units?.sort((a, b) => {
        return a.name.localeCompare(b.name)
    }).sort((a, b) => {
        return a.inspectCount < b.inspectCount ? 1 : 0
    }).sort((a, b) => {
        return a.discardCount < b.discardCount ? 1 : 0
    })

    // map the unit objects into table rows
    const displayItems = filteredUnits?.map(unit => {

        // flag options are defined in the flag module
        let flag = flagOptions[0]
        if ( unit.discardCount > 0 ) {
            flag = flagOptions[2]
        } else if ( unit.inspectCount > 0 ) {
            flag = flagOptions [1]
        }

        return (
            <tr key={ unit.unitId } >
                <td>{ unit.name }</td>
                <td>{ capitalize(unit.type) }</td>
                <td>{ unit.itemCount }</td>
                <td><Button text="Details" linkTo={ `/unit/${ unit.unitId }` } type="small" /></td>
                <td><Flag color={ flag.color } /> { flag.text }</td>
            </tr>
        )
    })

    const mobileDisplay = filteredUnits?.map(unit => {
        return (
            <tr key={ unit.unitId }>
                <td><Button text={ `${ unit.name } (${ unit.type })` } linkTo={ `/unit/${ unit.unitId }` } type="small" /></td>
            </tr>
        )
    })
    
    return err ? <Error err={ err } /> : (
        <main className="container mt-3">
            <div className="row title-row mt-3 mb-2">        
                <div className="col">
                    <h2>{ name }</h2>
                </div>
                { listButton }
                { adminButtons }
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Types
                        </div>
                        <div className="col-content">
                            { types.length > 0 ? capitalize( types.join(", ") ) : "No units yet" }
                        </div>
                    </div>
                    <div className="col col-info mobile-no">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(created) }
                        </div>
                    </div>
                </div>
                <Search data={ units } setData={ setFilteredUnits } />
                <table className="c-table-info align-middle mobile-no">
                    <thead>
                        <tr>
                            <th scope="col">Unit</th>
                            <th scope="col">Type</th>
                            <th scope="col">Item Count</th>
                            <th scope="col">Details</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems.length > 0 ? displayItems : <tr>
                            <td colSpan={ 5 }>No units yet</td>
                        </tr> }
                    </tbody>
                </table>
                <table className="c-table-info align-middle mobile-yes">
                    <thead>
                        <tr>
                            <th scope="col">Units: Tap to View</th>
                        </tr>
                    </thead>
                    <tbody>
                        { mobileDisplay.length > 0 ? mobileDisplay : <tr>No units yet.</tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default LocationDetails