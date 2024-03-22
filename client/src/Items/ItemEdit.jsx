// external dependencies
import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'
import CommentBox from '../Reusables/CommentBox'

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

    // redirect to the error page if no item is specified or if the item specified isn't found
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }
    const item = apiService.singleItem(id)
    if (!item || item.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // grab the list of categories for dangerous editing
    const categoryList = apiService.listCategories()
    let simpleCategories = []
    if (!categoryList || categoryList[0].error) {
        // since this is unlikely to be a needed field, print a warning if the fetch fails but don't redirect to Error
        setStatus("The list of categories could not be found. This may prevent advanced editing.")
    } else {

        // the Dropdown component later is expecting a list of strings
        simpleCategories = categoryList.map(cat => cat.categoryName)
    }

    // destructure the item
    const { unit, itemLabel, category, toAssess, toDiscard, vendor, donated, initialValue, currentValue, added, inspected, comments } = item

    // flag options are defined in the flag module
    let flagColor = flagColorOptions[0]
    let flagText = flagTextOptions[0]
    if ( toDiscard ) {
        flagColor = flagColorOptions[2]
        flagText = flagTextOptions[2]
    } else if ( toAssess ) {
        flagColor  = flagColorOptions[1]
        flagText = flagTextOptions[1]
    }

    // set up some page functionality
    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // dangerMode toggles the editability of dangrous fields
    const [ dangerMode, setDangerMode ] = useState(false)

    // dangerLabel changes the text of the dangerMode toggle button
    const [ dangerLabel, setDangerLabel ] = useState("Advanced Edit")

    // object that defines fields that are safe to change
    const [ safeChanges, setSafeChanges ] = useState({
        label: itemLabel,
        statusColor: flagColor,
        statusText: flagText,
        comment: ""
    })

    // object (nested) that defines fields that are dangerous to change
    const [ dangerChanges, setDangerChanges ] = useState({
        category,
        added,
        initialValue,
        currentValue,
        vendor,
        donated,
        unit
    })

    // Note that the following fields are not available to edit:
    // unitId, locationId, inspected (unhandled)
    // categoryId, categoryIcon, itemId, discardDate (handled)
    // added.userId, added.userName (shouldn't be changed) 
    // These should all be handled programmatically and do not need to be available for users.

    // Most changes are handled by Services/handleChanges

    // handles flag dropdown state
    const handleFlag = (input) => {
        const newChanges = {...safeChanges}
        const index = flagTextOptions.indexOf(input)
        if (index > -1) {
            newChanges.statusColor = flagColorOptions[index]
            newChanges.statusText = flagTextOptions[index]
        }
        setSafeChanges(newChanges)
        setUnsaved(true)
    }

    // handles the danger edit toggle
    const toggleDanger = () => {
        const newDanger = dangerMode ? false : true
        setDangerMode(newDanger)
        if (newDanger === true) {
            setStatus("Altering advanced item details may not be necessary.")
            setDangerLabel("Basic Edit")
        } else {
            setStatus("")
            setDangerLabel("Advanced Edit")
        }
    }

    // handles category change
    // passed into Dropdown
    const handleCategoryChange = (newCatName) => {
        const newCatIndex = categoryList.map(cat => cat.categoryName).indexOf(newCatName)
        if (newCatIndex !== -1) {
            const newChanges = {...dangerChanges}
            newChanges.category = categoryList[newCatIndex]
            console.log(newChanges)
            setDangerChanges(newChanges)
            setUnsaved(true)
        } else {
            setStatus("The category you have selected cannot be found.")
        }
    }

    // sends the item object to the apiService
    const saveChanges = () => {
        const newItem = {...dangerChanges}
        newItem.itemId = id
        newItem.itemLabel = safeChanges.label
        newItem.toAssess = safeChanges.statusText === flagTextOptions[1]
        newItem.toDiscard = safeChanges.statusText === flagTextOptions[2]
        newItem.comment = safeChanges.comment
        newItem.discardDate = null
        newItem.inspected = inspected

        if (authService.checkUser()) {
            const response = apiService.postItemEdit(newItem)
            if (response.success) {
                setStatus(`You have successfully saved your changes to item ${response.itemLabel}.`)
                setUnsaved(false)
                navigate(`/item/${id}`)
            } else {
                setStatus("We weren't able to process your edit item request.")
            }
        } else {
            setStatus("Your log in credentials could not be validated.")
        }
    }

    // sends a delete request to the apiService
    // date handling is commented out, but can be implemented again if needed
    const deleteItem = () => {
        // const newItem = item
        // const today = new Date()
        // const stringToday = today.toLocaleDateString()
        // const stringNow = today.toTimeString().split(" ")[0]
        // const formattedDate = `${stringToday} ${stringNow}`

        // newItem.itemId = id
        // newItem.discardDate = formattedDate

        // const response = apiService.deleteItem(newItem)

        const deletedItem = {
            unitId: item.unit.unitId,
            locationId: item.unit.locationId,
            itemLabel,
            itemId: id
        }

        const response = apiService.deleteItem(deletedItem)
        if (response.success) {
            setStatus(`You have successfully deleted item ${response.itemLabel}.`)
            setUnsaved(false)
            navigate(`/unit/${response.unitId}`)
        } else {
            setStatus("We weren't able to process your delete item request.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Editing { capitalize(category.categoryName) } in { unit.unitName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
                <div className="col-2">
                    <Button text="Cancel Edit" linkTo={ `/item/${id}` } type="nav" />
                </div>
                <div className="col-3">
                    <Button text={ dangerLabel } linkTo={ toggleDanger } type="danger" />
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
                                name="label" 
                                value={ safeChanges.label } 
                                onChange={ (event) => handleChanges.handleTextChange(event, safeChanges, setSafeChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            { dangerMode ? <Dropdown 
                                list={ simpleCategories } 
                                current={ dangerChanges.category.categoryName } 
                                setCurrent={ handleCategoryChange }
                            /> : category.categoryName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated By
                        </div>
                        <div className="col-content">
                            { inspected.userName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated At
                        </div>
                        <div className="col-content">
                            { inspected.inspectedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ safeChanges.statusColor } />
                            <Dropdown
                                list={ flagTextOptions }
                                current={ safeChanges.statusText }
                                setCurrent={ handleFlag }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ category.icon }.png` } alt={ category.categoryName + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <strong>New Comment: </strong><br />
                        <textarea 
                            name="comment" 
                            value={ safeChanges.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, safeChanges, setSafeChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                        <CommentBox comments={ comments } />
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="date" 
                                name="addedDate" 
                                value={ dangerChanges.added.addedDate.split(" ")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : added.addedDate }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="number" 
                                step=".01"
                                name="initialValue" 
                                value={ dangerChanges.initialValue } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : `$${ initialValue.toFixed(2) }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Current Value
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="number" 
                                step=".01"
                                name="currentValue" 
                                value={ dangerChanges.currentValue } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : `$${ currentValue.toFixed(2) }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="text"
                                name="vendor" 
                                value={ dangerChanges.vendor } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : vendor }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Donated
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                    type="checkbox"
                                    name="donated" 
                                    checked={ dangerChanges.donated }
                                    onChange={ (event) => handleChanges.handleCheckChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                                /> : donated ? "Yes" : "No" }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="text" 
                                name="addedDate" 
                                value={ dangerChanges.unit.locationName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : unit.locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="text" 
                                name="addedDate" 
                                value={ dangerChanges.unit.unitName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : unit.unitName }
                        </div>
                    </div>
                </div>
                { dangerMode && <Button text="Delete Item" linkTo={ deleteItem } type="danger" /> }
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/item/${id}` } locationId={ unit.locationId } /> }
            </div>
        </main>
    )
}

export default ItemEdit