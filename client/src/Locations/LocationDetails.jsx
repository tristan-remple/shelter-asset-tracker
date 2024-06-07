// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext, userContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Flag, { flagOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Search from '../Reusables/Search'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single building.
// The units within the building are displayed as well.
// Imported by: App

const LocationDetails = () => {

    // get context information
    const { id } = useParams()
    const { status } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const { userDetails } = useContext(userContext)
    const { isAdmin } = userDetails
    
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

    // put the units that have items which need to be assessed or discarded at the top of the list
    units?.sort((a, b) => {
        return a.name.localeCompare(b.name)
    }).sort((a, b) => {
        return a.inspectCount < b.inspectCount ? 1 : 0
    }).sort((a, b) => {
        return a.discardCount < b.discardCount ? 1 : 0
    })

    // map the unit objects into table rows
    const displayItems = filteredUnits?.map(item => {

        // flag options are defined in the flag module
        let flag = flagOptions[0]
        if ( item.discardCount > 0 ) {
            flag = flagOptions[2]
        } else if ( item.inspectCount > 0 ) {
            flag = flagOptions [1]
        }

        return (
            <tr key={ item.unitId } >
                <td>{ item.name }</td>
                <td>{ capitalize(item.type) }</td>
                <td><Button text="Details" linkTo={ `/unit/${ item.unitId }` } type="small" /></td>
                <td><Flag color={ flag.color } /> { flag.text }</td>
            </tr>
        )
    })
    
    return err ? <Error err={ err } /> : (
        <main className="container mt-3">
            <div className="row title-row mt-3 mb-2">        
                <div className="col">
                    <h2>{ name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="See All" linkTo="/locations" type="nav" />
                </div>
                { adminButtons }
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
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
                            <td colSpan={ 4 }>No units yet</td>
                        </tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default LocationDetails