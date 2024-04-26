// external dependencies
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { adminDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'

//------ MODULE INFO
// This module displays a list of deleted locations, and allows the user to restore them.
// Imported by: App

const LocationRecovery = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ locations, setLocations ] = useState({})
    useEffect(() => {
        (async()=>{
            await apiService.deletedUnits(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setLocations(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (locations) {

    // order the items by most recently deleted first
    locations?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreLocation = async(locationId) => {
        await apiService.restoreLocation(locationId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully restored location ${response.name}.`)
            }
        })
    } 

    // map the item objects into table rows
    const displayItems = locations?.map(loc => {
        return (
            <tr key={ loc.id } >
                <td>{ loc.name }</td>
                <td>{ adminDate(loc.deletedAt) }</td>
                <td><Button text="Restore" linkTo={ () => restoreLocation(loc.id) } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleted Locations</h2>
                </div>
                <div className="col-1 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Deleted Date</th>
                            <th scope="col">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems ? displayItems : <td colSpan={ 3 }>No items yet.</td> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default LocationRecovery