// external dependencies
import { useParams } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { adminDate, friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Search from '../Reusables/Search'
import CommentBox from '../Reusables/CommentBox'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single unit inside of a building. Examples include apartments and snugs.
// The items within the unit are displayed as well.
// Imported by: App

const ItemRecovery = () => {

    // get context information
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")

    const [ items, setItems ] = useState({})
    const [ filteredItems, setFilteredItems ] = useState([])
    // fetch unit data from the api
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
    }, [])

    if (err) { return <Error err={ err } /> }
    if (items) {

    // order the items by most recently deleted first
    items?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })
    filteredItems?.sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt)
    })

    // send an api call to restore the item
    const restoreItem = async(itemId) => {
        await apiService.restoreItem(itemId, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully restored item ${response.name}.`)
            }
        })
    } 

    // map the item objects into table rows
    const displayItems = filteredItems?.map(item => {
        return (
            <tr key={ item.id } >
                <td>{ item.name }</td>
                <td>{ capitalize(item.template) }</td>
                <td>{ item.unit }</td>
                <td>{ item.facility }</td>
                <td>{ adminDate(item.deletedAt) }</td>
                <td><Button text="Restore" linkTo={ () => restoreItem(item.id) } type="small" /></td>
            </tr>
        )
    })

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleted Items</h2>
                </div>
                <div className="col-1 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/admin` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
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
                        { displayItems ? displayItems : <td colSpan={ 4 }>No items yet.</td> }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
}

export default ItemRecovery