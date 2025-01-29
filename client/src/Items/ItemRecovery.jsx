// external dependencies
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { adminDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import Search from '../Components/Search'
import Statusbar from '../Components/Statusbar'

//------ MODULE INFO
// This module displays a list of deleted items, and allows the user to restore them.
// Imported by: App

const ItemRecovery = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    // fetch data from the api
    const [ items, setItems ] = useState({})
    const [ filteredItems, setFilteredItems ] = useState([])
    useEffect(() => {
        (async()=>{
            await apiService.deletedItems(function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    console.log(data)
                    setItems(data)
                    setFilteredItems(data)
                    setErr(null)
                }
            })
        })()
    }, [ status ])

    // send an api call to restore the item
    const restoreItem = async(itemId) => {
        await apiService.restoreItem(itemId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully restored item ${response.item.name}.`,
                    error: false
                })
            }
        })
    }

    // map the item objects into table rows
    const [ displayItems, setDisplayItems ] = useState([])
    useEffect(() => {
        if (filteredItems && filteredItems.length > 0) {
            const display = filteredItems?.map(item => {
                return (
                    <tr key={ item.id } >
                        <td>{ item.name }</td>
                        <td>{ capitalize(item.template.name) }</td>
                        <td>{ item.unit?.name }</td>
                        <td>{ item.unit?.facility.name }</td>
                        <td>{ adminDate(item.deletedat) }</td>
                        <td><Button text="Restore" linkTo={ () => restoreItem(item.id) } type="small" /></td>
                    </tr>
                )
            })
            setDisplayItems(display)
        } else {
            setDisplayItems([])
        }
    }, [ items, filteredItems, status ])

    if (err) { return <Error err={ err } /> }

    if (items) {

    // order the items by most recently deleted first
    items?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredItems?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Deleted Items</h2>
                </div>
                <div className="col-1 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <Search data={ items } setData={ setFilteredItems } />
                <table className="c-table-info align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Label</th>
                            <th scope="col">Category</th>
                            <th scope="col">Unit</th>
                            <th scope="col">Location</th>
                            <th scope="col">Deleted Date</th>
                            <th scope="col">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayItems.length > 0 ? displayItems : <tr><td colSpan={ 6 }>No items yet.</td></tr> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default ItemRecovery