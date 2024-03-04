// external dependencies
import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
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

const ItemCreate = () => {

    // id from the url and status from the context
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // redirect to the error page if no unit is specified or if the unit specified isn't found
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }
    const unit = apiService.singleUnit(id)
    if (unit.error) {
        console.log("api error")
        return <Error err="api" />
    }

    const { unitId, unitName, locationId, locationName } = unit

    // grab the list of categories
    const categoryList = apiService.listCategories()
    let simpleCategories = []
    if (categoryList[0].error || !categoryList) {
        return <Error err="api" />
    } else {
        // the Dropdown component later is expecting a list of strings
        simpleCategories = categoryList.map(cat => cat.categoryName)
        simpleCategories.unshift("Select:")
    }

    const today = new Date()
    const stringToday = today.toLocaleDateString()
    const stringNow = today.toTimeString().split(" ")[0]
    const formattedDate = `${stringToday} ${stringNow}`

    // new item state
    const [ newItem, setNewItem ] = useState({
        unitId,
        itemLabel: "",
        locationId,
        category: {
            categoryId: 0,
            categoryName: "Select:",
            defaultValue: 0,
            icon: "icons8-room-100",
            singleUse: false
        },
        added: {
            addedDate: formattedDate
        },
        vendor: "",
        donated: false,
        initialValue: 0,
        comment: ""
    })

    // set up some page functionality
    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // handles text and number changes
    const handleTextChange = (event) => {
        const fieldName = event.target.name
        const newItemAdditions = {...newItem}
        newItemAdditions[fieldName] = event.target.type === "number" ? parseFloat(event.target.value) : event.target.value
        setNewItem(newItemAdditions)
        setUnsaved(true)
    }

    // handles category change
    // passed into Dropdown
    const handleCategoryChange = (newCatName) => {
        const newCatIndex = categoryList.map(cat => cat.categoryName).indexOf(newCatName)
        if (newCatIndex !== -1) {
            const newItemAdditions = {...newItem}
            newItemAdditions.category = categoryList[newCatIndex]
            newItemAdditions.initialValue = categoryList[newCatIndex].defaultValue
            setNewItem(newItemAdditions)
            setUnsaved(true)
            setStatus("")
        } else {
            setStatus("The category you have selected cannot be found.")
        }
    }

    // handles donation checkbox
    const handleDonatedChange = () => {
        const newItemAdditions = {...newItem}
        newItemAdditions.donated = newItemAdditions.donated ? false : true
        setNewItem(newItemAdditions)
        setUnsaved(true)
    }

    const handleDateChange = (event) => {
        const newItemAdditions = {...newItem}
        const newDate = event.target.value.replace("T", " ")
        newItemAdditions.added.addedDate = newDate
        setNewItem(newItemAdditions)
        setUnsaved(true)
    }

    // sends the item object to the apiService
    const saveChanges = () => {
        if (newItem.label === "" || newItem.category.categoryName === "Select:" || newItem.initialValue === 0) {
            setStatus("The new item's label, category, and initial value must be filled in.")
            return
        }
        const response = apiService.postItem(newItem)
        if (response.success) {
            setStatus(`You have successfully added item ${response.itemLabel}.`)
            setUnsaved(false)
            navigate(`/item/${response.itemId}`)
        } else {
            setStatus("We weren't able to process your add item request.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col-6">
                    <h2>Adding a New Item to { unitName } in { locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
                <div className="col-3">
                    <Button text="Cancel New Item" linkTo={ `/unit/${unitId}` } type="nav" />
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
                            <input type="text" name="itemLabel" value={ newItem.itemLabel } onChange={ handleTextChange } />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            { <Dropdown 
                                list={ simpleCategories } 
                                current={ newItem.category.categoryName } 
                                setCurrent={ handleCategoryChange }
                            /> }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ newItem.category.icon }.png` } alt={ newItem.category.categoryName + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <strong>Comments:</strong>
                        <textarea name="comment" value={ newItem.comment } onChange={ handleTextChange } className="comment-area" />
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { <input 
                                type="datetime-local" 
                                name="addedDate" 
                                value={ newItem.added.addedDate } 
                                onChange={ handleDateChange } 
                            /> }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value
                        </div>
                        <div className="col-content">
                            { <input 
                                type="number" 
                                step=".01"
                                name="initialValue" 
                                value={ newItem.initialValue } 
                                onChange={ handleTextChange } 
                            /> }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Current Value
                        </div>
                        <div className="col-content">
                            { newItem.initialValue }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            { <input 
                                type="text"
                                name="vendor" 
                                value={ newItem.vendor } 
                                onChange={ handleTextChange } 
                            /> }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Donated
                        </div>
                        <div className="col-content">
                            { <input 
                                    type="checkbox"
                                    name="donated" 
                                    checked={ newItem.donated }
                                    onChange={ handleDonatedChange } 
                                /> }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { locationName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { unitName }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${id}` } /> }
            </div>
        </main>
    )
}

export default ItemCreate