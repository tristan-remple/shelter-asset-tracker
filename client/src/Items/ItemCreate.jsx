// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { formattedDate } from '../Services/dateHelper'
import { statusContext, userContext } from '../Services/Context'
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

    // page setup
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")
    const { userDetails } = useContext(userContext)

    // redirect to the error page if no unit is specified or if the unit specified isn't found
    if (id === undefined) {
        setErr("undefined")
    }

    const [ unit, setUnit ] = useState()
    // fetch unit data from the api
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUnit(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // new item state
    const [ newItem, setNewItem ] = useState({
        name: "",
        unitId: 0,
        template: {
            categoryId: 0,
            categoryName: "Select:",
            defaultValue: 0,
            Icon: {},
            singleUse: false
        },
        added: {
            id: 0,
            name: "Someguy",
            date: formattedDate()
        },
        // comment: "",
        donated: false,
        initialValue: 0,
        depreciationRate: 0.03,
        vendor: "",
        invoice: ""
    })

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    useEffect(() => {
        if (unit) {
            const changes = {...newItem}
            changes.unitId = unit.id
            setNewItem(changes)
        }
    }, [ unit ])

    const [ categoryList, setCategoryList ] = useState([])
    const [ simpleCategories, setSimpleCategories ] = useState([])
    useEffect(() => {
        (async() => {
            await apiService.listCategories((data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setCategoryList(data)
                    setErr(null)

                    // the Dropdown component later is expecting a list of strings
                    const simpleList = data.map(cat => cat.name)
                    simpleList.unshift("Select:")
                    setSimpleCategories(simpleList)
                }
            })
        })()
    }, [])

    // Most changes are handled by Services/handleChanges

    // handles category change
    // passed into Dropdown
    const handleCategoryChange = (newCatName) => {
        const newCatIndex = categoryList.map(cat => cat.name).indexOf(newCatName)
        if (newCatIndex !== -1) {
            const newItemAdditions = {...newItem}
            newItemAdditions.template = categoryList[newCatIndex]
            newItemAdditions.initialValue = parseFloat(categoryList[newCatIndex].defaultValue)
            setNewItem(newItemAdditions)
            setUnsaved(true)
            setStatus("")
        } else {
            setStatus("The category you selected cannot be found.")
        }
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // check that fields have been filled in
        if (newItem.name === "" || newItem.template.categoryName === "Select:" || newItem.initialValue === 0) {
            setStatus("A new item must have a label, a category, and an initial value.")
            return
        }

        const changes = {...newItem}

        changes.templateId = changes.template.id
        changes.addedBy = userDetails.userId
        changes.donated = newItem.donated ? 1 : 0
        changes.usefulLifeOffset = 12

        console.log(changes)

        // send api request and process api response
        await apiService.postNewItem(changes, (response => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully added item ${response.name}.`)
                setUnsaved(false)
                navigate(`/item/${response.itemId}`)
            }
        }))
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Adding a New Item to { unit.name } in { unit.facility.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Cancel New Item" linkTo={ `/unit/${ unit.id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className="my-2">{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="name" 
                                value={ newItem.name } 
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
                                current={ newItem.template.name } 
                                setCurrent={ handleCategoryChange }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { unit.facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { unit.name }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ newItem.template.Icon.src }` } alt={ newItem.template.Icon.name + " icon" } />
                    </div>
                    <div className="col-8 col-content">
                        <strong>Comments:</strong>
                        <textarea 
                            name="comment" 
                            value={ newItem.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
                            className="comment-area" 
                        />
                    </div>
                </div>
                <div className="row row-info">
                    {/* <div className="col col-info">
                        <div className="col-head">
                            Acquired Date
                        </div>
                        <div className="col-content">
                            { <input 
                                type="date" 
                                name="createdAt" 
                                value={ newItem.createdAt.split("T")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, newItem, setNewItem, setUnsaved) } 
                            /> }
                        </div>
                    </div> */}
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
                            Invoice Number
                        </div>
                        <div className="col-content">
                            { <input 
                                type="text" 
                                name="invoice" 
                                value={ newItem.invoice } 
                                onChange={ (event) => handleChanges.handleTextChange(event, newItem, setNewItem, setUnsaved) } 
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
                </div>
                <div className="row row-info">
                    
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${ unit.id }` } /> }
            </div>
        </main>
    )
}

export default ItemCreate