// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import { friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Components/Button"
import Flag, { flagOptions } from "../Components/Flag"
import Error from '../Components/Error'
import Dropdown from '../Components/Dropdown'
import ChangePanel from '../Components/ChangePanel'
import CommentBox from '../Components/CommentBox'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows a user to edit the details about a single item in the collection.
// This module does NOT currently record which user is editing.
// User information will need to be taken either here or in the apiService module.
// Handling for certain IDs also needs to be implemented.
//
// Possible edits are divided into "safe" and"dangerous" changes.
// Safe changes are expected in the regular use of the app.
// Dangerous changes would only need to be applied if there was an error when creating the item.
// Delete item also only appears during "danger mode" editing.
// When changes are saved or cancelled, this page will redirect to the item details page.
// When the item is deleted, it will redirect to the unit overview.
//
// Imported by: App

const ItemEdit = () => {

    // id from the url and status from the context
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")

    // redirect to the error page if no item is specified or if the item specified isn't found
    if (id === undefined) {
        setErr("undefined")
    }

    const [ item, setItem ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleItem(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setItem(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // set up some page functionality
    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // object (nested) that defines fields that are available to change
    const [ changes, setChanges ] = useState({
        name: "",
        status: "",
        flag: {},
        comment: "",
        invoice: "",
        vendor: "",
        eol: "",
        initialValue: 0,
        currentValue: 0
    })

    useEffect(() => {
        if (item) {

            // flag options are defined in the flag module
            let currentFlag = flagOptions.filter(option => {
                return option.text.toLowerCase() === item.status
            })[0]
            
            setChanges({
                name: item.name,
                status: item.status,
                flag: currentFlag,
                comment: "",
                invoice: item.invoice,
                vendor: item.vendor,
                eol: item.eol,
                initialValue: item.value.initialValue,
                currentValue: item.value.currentValue
            })
        }
    }, [ item ])

    if (err) { return <Error err={ err } /> }
    if (item) {

    // Note that the following fields are not available to edit:
    // Template, Location, Unit, Acquired Date

    // Most changes are handled by Services/handleChanges

    const flagTextOptions = flagOptions.map(option => option.text)

    // handles flag dropdown state
    const handleFlag = (input) => {
        const newChanges = {...changes}
        const index = flagOptions.findIndex(option => option.text === input)
        if (index > -1) {
            newChanges.status = flagOptions[index].text.toLowerCase()
            newChanges.flag = flagOptions[index]
        }
        setChanges(newChanges)
        setUnsaved(true)
    }

    // sends the item object to the apiService
    const saveChanges = async() => {
        const newItem = {...changes}
        newItem.id = item.id
        newItem.unitId = item.unit.id

        await apiService.postItemEdit(newItem, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully saved your changes to item ${response.name}.`)
                setUnsaved(false)
                navigate(`/item/${response.id}`)
            }
        })
    }

    // sends a delete request to the apiService
    const deleteItem = async() => {
        const deletedItem = {
            id: item.id,
            name: item.name
        }
        await apiService.deleteItem(deletedItem, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully deleted item ${ response.name }.`)
                setUnsaved(false)
                navigate(`/unit/${ item.unit.id }`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Editing { capitalize(item.template.name) } in { item.unit.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Cancel Edit" linkTo={ `/item/${id}` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="name" 
                                value={ changes.name } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Template
                        </div>
                        <div className="col-content">
                            { item.template.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { item.unit.facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { item.unit.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ changes.flag.color } />
                            <Dropdown
                                list={ flagTextOptions }
                                current={ changes.flag.text }
                                setCurrent={ handleFlag }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        { item.template.icon ? <img className="img-fluid icon" src={ `/img/${ item.template.icon.src }` } alt={ item.template.icon.name + " icon" } /> : "No Icon" }
                    </div>
                    <div className="col-8 col-content">
                        <strong>New Comment: </strong><br />
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                        <CommentBox comments={ item.comments } />
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { friendlyDate(item.createdAt) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Expected End of Life
                        </div>
                        <div className="col-content">
                            <input 
                                type="date"
                                name="eol" 
                                value={ changes.eol.split("T")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Invoice Number
                        </div>
                        <div className="col-content">
                            <input 
                                type="text"
                                name="invoice" 
                                value={ changes.invoice } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            <input 
                                type="text"
                                name="vendor" 
                                value={ changes.vendor } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                step=".01"
                                name="initialValue" 
                                value={ changes.initialValue } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <Button text="Delete Item" linkTo={ deleteItem } type="danger" />
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/item/${id}` } locationId={ item.unit.locationId } /> }
            </div>
        </main>
    )
}
}

export default ItemEdit