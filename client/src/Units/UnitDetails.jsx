// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext, userContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Flag, { flagOptions } from "../Components/Flag"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module displays the details about a single unit inside of a building. Examples include apartments and snugs.
// The items within the unit are displayed as well.
// Imported by: App

const UnitDetails = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const { userDetails } = useContext(userContext)

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    const [ unit, setUnit ] = useState({})
    const [ filteredItems, setFilteredItems ] = useState([])
    const [ flip, setFlip ] = useState(0)
    // fetch unit data from the api
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUnit(data)
                    setFilteredItems(data.items)
                    setErr(null)
                }
            })
        })()
    }, [ flip ])

    if (err) { return <Error err={ err } /> }
    if (unit) {
    // destructure api response
    const { id, name, type, facility, createdAt, updatedAt, items } = unit
    // const { unitId, unitName, locationId, locationName, unitType, added, inspected, deleteDate } = unit

    // if it has been deleted, throw an error
    // if (deleteDate) {
    //     setErr("deleted")
    // }

    // if the user is admin, populate admin buttons
    let adminButtons = ""
    if (userDetails.isAdmin) {
        adminButtons = (
            <>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Edit Unit" linkTo={ `/unit/${ id }/edit` } type="admin" />
                </div>
            </>
        )
    }

    // order the items by most recently updated first
    // put the items that need to be assessed or discarded at the top of the list
    items?.sort((a, b) => {
        return new Date(b.inspectedDate) - new Date(a.inspectedDate)
    }).sort((a, b) => {
        return a.toAssess < b.toAssess ? 1 : 0
    }).sort((a, b) => {
        return a.toDiscard < b.toDiscard ? 1 : 0
    })

    filteredItems?.sort((a, b) => {
        return new Date(b.inspectedDate) - new Date(a.inspectedDate)
    }).sort((a, b) => {
        return a.status === "inspect"
    }).sort((a, b) => {
        return a.status === "discard" ? 0 : 1
    })

    // sends a delete request to the apiService
    const deleteItem = async(item) => {
        console.log(item)
        const deletedItem = {
            id: item.itemId,
            name: item.name
        }
        await apiService.deleteItem(deletedItem, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully marked ${ response.name } in ${ unit.name } as having been discarded.`,
                    error: false
                })
                setTimeout(() => { setFlip(flip + 1) }, 500)
            }
        })
    }

    // map the item objects into table rows
    const displayItems = filteredItems?.map(item => {

        // flag options are defined in the flag module
        const currentFlag = flagOptions.filter(option => {
            return option.text.toLowerCase() === item.status
        })[0]

        const actionButton = item.status.toLowerCase() === "discard"
            ? <Button text="Mark Discarded" linkTo={ () => deleteItem(item) } type="small" />
            : <Button text="Record Inspection" linkTo={ `/item/${ item.itemId }/inspect` } type="small" />

        return (
            <tr key={ item.itemId } >
                <td>{ item.itemName }</td>
                <td>{ capitalize(item.template.name) }</td>
                <td><Button text="Details" linkTo={ `/item/${ item.itemId }` } type="small" /></td>
                <td>{ actionButton }</td>
                <td><Flag color={ currentFlag.color } /> { currentFlag.text }</td>
            </tr>
        )
    })

    const flipUnit = async() => {
        if (!confirm("Flipping a unit will flag all of its items as needing inspection. Are you sure?")) {
            return
        }
        await apiService.flipUnit(id, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `Unit ${ name } has been flipped. Its items are now marked for inspection.`,
                    error: false
                })
                setTimeout(() => { setFlip(flip + 1) }, 500)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Unit { name } in { facility.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/location/${ facility.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Add Item" linkTo={ `/unit/${ id }/add` } type="action" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Flip Unit" linkTo={ flipUnit } type="action" />
                </div>
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
                            { facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            { name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Type
                        </div>
                        <div className="col-content">
                            { capitalize(type) }
                        </div>
                    </div>
                    {/* <div className="col col-info">
                        <div className="col-head">
                            Updated By
                        </div>
                        <div className="col-content">
                            { inspected.userName }
                        </div>
                    </div> */}
                    <div className="col col-info">
                        <div className="col-head">
                            Updated At
                        </div>
                        <div className="col-content">
                            { friendlyDate(updatedAt) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(createdAt) }
                        </div>
                    </div>
                </div>
                <Search data={ items } setData={ setFilteredItems } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            <th scope="col">Category</th>
                            <th scope="col">Details</th>
                            <th scope="col">Action</th>
                            <th scope="col">Status</th>
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

export default UnitDetails