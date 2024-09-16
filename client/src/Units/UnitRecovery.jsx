// external dependencies
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { adminDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Search from '../Components/Search'

//------ MODULE INFO
// This module displays a list of deleted units, and allows the user to restore them.
// Imported by: App

const UnitRecovery = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ units, setUnits ] = useState({})
    const [ filteredUnits, setFilteredUnits ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.deletedUnits(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUnits(data)
                    setFilteredUnits(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    if (err) { return <Error err={ err } /> }
    if (units) {

    // order the items by most recently deleted first
    units?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredUnits?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreUnit = async(unitId) => {
        await apiService.restoreItem(unitId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully restored unit ${response.name}.`)
            }
        })
    } 

    // map the item objects into table rows
    const displayItems = filteredUnits?.map(unit => {
        return (
            <tr key={ unit.id } >
                <td>{ unit.name }</td>
                <td>{ unit.facility }</td>
                <td>{ adminDate(unit.deletedAt) }</td>
                <td><Button text="Restore" linkTo={ () => restoreUnit(unit.id) } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleted Units</h2>
                </div>
                <div className="col-1 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <Search data={ units } setData={ setFilteredUnits } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            <th scope="col">Location</th>
                            <th scope="col">Deleted Date</th>
                            <th scope="col">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems ? displayItems : <td colSpan={ 4 }>No items yet.</td> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default UnitRecovery