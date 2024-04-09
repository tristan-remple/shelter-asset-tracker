// external dependencies
import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { formattedDate } from '../Services/dateHelper'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows a user to add an item to a specific unit.
// This module does NOT currently record which user is editing.
// User information will need to be taken either here or in the apiService module.
// Handling for certain IDs also needs to be implemented.
//
// Redirects to the page of the new item when an item is successfully created.
// Goes back to the unit page if the item creation is cancelled.
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
    const response = apiService.singleUnit(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure the unit
    const { unit } = response
    const { unitId, unitName, locationId, locationName } = unit

    // grab the list of categories
    const categoryList = apiService.listCategories()
    if (!categoryList || categoryList.error) {
        return <Error err="api" />
    }

    // the Dropdown component later is expecting a list of strings
    const simpleCategories = categoryList.map(cat => cat.categoryName)
    simpleCategories.unshift("Select:")

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
            addedDate: formattedDate()
        },
        vendor: "",
        donated: false,
        initialValue: 0
        // comment: ""
    })

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // Most changes are handled by Services/handleChanges

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
            setStatus("The category you selected cannot be found.")
        }
    }

    // sends the item object to the apiService
    const saveChanges = () => {

        // check that fields have been filled in
        if (newItem.label === "" || newItem.category.categoryName === "Select:" || newItem.initialValue === 0) {
            setStatus("A new item must have a label, a category, and an initial value.")
            return
        }

        // verify user identity
        if (authService.checkUser()) {
            // send api request and process api response
            const response = apiService.postNewItem(newItem)
            if (response.success) {
                setStatus(`You have successfully added item ${response.itemLabel}.`)
                setUnsaved(false)
                navigate(`/item/${response.itemId}`)
            } else {
                setStatus("We weren't able to process your add item request.")
            }
        } else {
            setStatus("Your log in credentials could not be validated.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
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
                            <input 
                                type="text" 
                                name="itemLabel" 
                                value={ newItem.itemLabel } 
                                onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category
                        </div>
                        <div className="col-content">
                            <Dropdown 
                                list={ simpleCategories } 
                                current={ newItem.category.categoryName } 
                                setCurrent={ handleCategoryChange }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ newItem.category.icon }.png` } alt={ newItem.category.categoryName + " icon" } />
                    </div>
                    {/* <div className="col-8 col-content">
                        <strong>Comments:</strong>
                        <textarea 
                            name="comment" 
                            value={ newItem.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
                            className="comment-area" 
                        />
                    </div> */}
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { <input 
                                type="date" 
                                name="addedDate" 
                                value={ newItem.added.addedDate } 
                                onChange={ (event) => handleChanges.handleDateChange(event, newItem, setNewItem, setUnsaved) } 
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
                                onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
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
                                onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
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
                                    onChange={ (event) => handleChanges.handleCheckChange(event, newItem, setNewItem, setUnsaved) } 
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