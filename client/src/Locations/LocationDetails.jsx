// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

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
    
    const [ err, setErr ] = useState(null)

    let urlId = id

    // validate id
    if (urlId === undefined) {
        urlId = authService.userInfo().location.locationId
        if (urlId === 0 || urlId === undefined) {
            setErr("undefined")
        }
    }

    const [ response, setResponse ] = useState()
    const [ filteredUnits, setFilteredUnits ] = useState([])
    // fetch unit data from the api
    useEffect(() => {
        (async()=>{
            await apiService.singleLocation(urlId, function(data){
                if (!data || data.error) {
                    setErr("api")
                }
                setResponse(data)
                setFilteredUnits(data.units)
            })
        })()
    }, [])

    // destructure api response
    if (response) {

    const { facilityId, name, created, updated, units, types, phone } = response

    // if the user is admin, populate admin buttons
    let adminButtons = ""
    if (authService.checkAdmin()) {
        adminButtons = (
            <>
                <div className="col-2">
                    <Button text="Add Unit" linkTo={ `/location/${ facilityId }/add` } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Edit Location" linkTo={ `/location/${ facilityId }/edit` } type="admin" />
                </div>
                <div className="col-2">
                    <Button text="Delete Location" linkTo={ `/location/${ facilityId }/delete` } type="admin" />
                </div>
            </>
        )
    }

    // put the units that have items which need to be assessed or discarded at the top of the list
    units?.sort((a, b) => {
        return a.name.localeCompare(b.name)
    }).sort((a, b) => {
        return a.inspectCount < b.inspectCount ? 1 : 0
    }).sort((a, b) => {
        return a.deleteCount < b.deleteCount ? 1 : 0
    })

    // map the unit objects into table rows
    const displayItems = filteredUnits?.map(item => {

        // flag options are defined in the flag module
        let flagColor = flagColorOptions[0]
        let flagText = flagTextOptions[0]
        if ( item.deleteCount > 0 ) {
            flagColor = flagColorOptions[2]
            flagText = flagTextOptions[2]
        } else if ( item.inspectCount > 0 ) {
            flagColor  = flagColorOptions[1]
            flagText = flagTextOptions[1]
        }

        return (
            <tr key={ item.unitId } >
                <td>{ item.name }</td>
                <td>{ capitalize(item.type) }</td>
                <td><Button text="Details" linkTo={ `/unit/${ item.unitId }` } type="small" /></td>
                <td><Flag color={ flagColor } /> { flagText }</td>
            </tr>
        )
    })
    
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>{ name }</h2>
                </div>
                <div className="col-2">
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
                            { name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Phone Number
                        </div>
                        <div className="col-content">
                            { phone }
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
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(created) }
                        </div>
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
                        { displayItems.length > 0 ? displayItems : <tr>
                            <td colspan="4">No units yet</td>
                        </tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default LocationDetails