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
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module displays a list of deleted units, and allows the user to restore them.
// Imported by: App

const UnitRecovery = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ units, setUnits ] = useState([])
    const [ filteredUnits, setFilteredUnits ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.deletedUnits(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUnits(data)
                    setFilteredUnits(data)
                    console.log(data)
                    setErr(null)
                }
            })
        })()
    }, [ status ])    

    // order the items by most recently deleted first
    units?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredUnits?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreUnit = async(unitId) => {
        await apiService.restoreUnit(unitId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                console.log(response)
                setStatus({
                    message: `You have successfully restored unit ${response.unit.name}.`,
                    error: false
                })
            }
        })
    } 

    const [ displayItems, setDisplayItems ] = useState([])
    // map the item objects into table rows
    useEffect(() => {
        const newDisplayItems = filteredUnits?.map(unit => {
            return (
                <tr key={ unit.id } >
                    <td>{ unit.name }</td>
                    {/* <td>{ unit.facility?.name }</td> */}
                    <td>{ adminDate(unit.deletedat) }</td>
                    <td><Button text="Restore" linkTo={ () => restoreUnit(unit.id) } type="small" /></td>
                </tr>
            )
        })
        setDisplayItems(newDisplayItems)
    }, [ status, units, filteredUnits ])

    const hardDelete = async() => {
        if (confirm("Once you empty deleted units, you will not be able to recover them. Are you sure?")) {
            await apiService.emptyDeletedUnits((data) => {
                if (data.error) {
                    setStatus({
                        message: "We were not able to empty the deleted units.",
                        error: false
                    })
                } else {
                    setStatus({
                        message: "All deleted units have been purged from the system.",
                        error: false
                    })
                }
            })
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleted Units</h2>
                </div>
                <div className="col d-flex justify-content-end">
                    {/* <Button text="Empty Deleted Units" linkTo={ hardDelete } type="admin" /> */}
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <Search data={ units } setData={ setFilteredUnits } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            {/* <th scope="col">Location</th> */}
                            <th scope="col">Deleted Date</th>
                            <th scope="col">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems.length > 0 ? displayItems : <tr><td colSpan={ 4 }>No units yet.</td></tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default UnitRecovery