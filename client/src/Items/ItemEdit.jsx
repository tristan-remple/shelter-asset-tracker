// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import { friendlyDate } from '../Services/dateHelper'

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
    const [ err, setErr ] = useState("loading")

    // redirect to the error page if no item is specified or if the item specified isn't found
    if (id === undefined) {
        setErr("undefined")
    }

    const [ item, setItem ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleItem(id, (data) => {
                if (data?.error?.error === "Unauthorized.") {
                    setErr("permission")
                } else if (!data || data.error) {
                    setErr("api")
                } else {
                    setItem(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    const [ categoryList, setCategoryList ] = useState([])
    const [ simpleCategories, setSimpleCategories ] = useState([])
    useEffect(() => {
        (async() => {
            await apiService.listCategories((data) => {
                if (!data || data.error) {
                    setErr("api")
                }
                setCategoryList(data)

                // the Dropdown component later is expecting a list of strings
                const simpleList = data.map(cat => cat.name)
                simpleList.unshift("Select:")
                setSimpleCategories(simpleList)
            })
        })()
    }, [])

    // set up some page functionality
    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // dangerMode toggles the editability of dangrous fields
    const [ dangerMode, setDangerMode ] = useState(false)

    // dangerLabel changes the text of the dangerMode toggle button
    const [ dangerLabel, setDangerLabel ] = useState("Advanced Edit")

    // object that defines fields that are safe to change
    const [ safeChanges, setSafeChanges ] = useState({
        name: "",
        statusColor: flagColorOptions[0],
        statusText: flagTextOptions[0],
        comment: ""
    })

    // object (nested) that defines fields that are dangerous to change
    const [ dangerChanges, setDangerChanges ] = useState({
        template: "",
        unit: "",
        depreciationRate: 0,
        initialValue: 0
    })

    useEffect(() => {
        if (item) {

            // flag options are defined in the flag module
            let flagColor = flagColorOptions[0]
            let flagText = flagTextOptions[0]
            if ( item.toDiscard ) {
                flagColor = flagColorOptions[2]
                flagText = flagTextOptions[2]
            } else if ( item.toInspect ) {
                flagColor  = flagColorOptions[1]
                flagText = flagTextOptions[1]
            }
            
            setSafeChanges({
                name: item.name,
                statusColor: flagColor,
                statusText: flagText,
                comment: ""
            })

            setDangerChanges({
                template: item.template,
                unit: item.unit,
                depreciationRate: item.value.depreciationRate,
                initialValue: item.value.initialValue
            })
        }
    }, [ item ])

    if (err) { return <Error err={ err } /> }
    if (item) {

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
        const newCatIndex = categoryList.map(cat => cat.name).indexOf(newCatName)
        if (newCatIndex !== -1) {
            const newChanges = {...dangerChanges}
            newChanges.template = categoryList[newCatIndex]
            setDangerChanges(newChanges)
            setUnsaved(true)
        } else {
            setStatus("The category you have selected cannot be found.")
        }
    }

    // sends the item object to the apiService
    const saveChanges = async() => {
        const newItem = {}
        newItem.id = id
        newItem.unitId = dangerChanges.unit.id
        newItem.name = safeChanges.name
        newItem.initialValue = dangerChanges.initialValue
        newItem.depreciationRate = dangerChanges.depreciationRate
        newItem.toInspect = safeChanges.statusText === flagTextOptions[1]
        newItem.toDiscard = safeChanges.statusText === flagTextOptions[2]

        if (authService.checkUser()) {
            await apiService.postItemEdit(newItem, (response) => {
                if (response.success) {
                    setStatus(`You have successfully saved your changes to item ${response.name}.`)
                    setUnsaved(false)
                    navigate(`/item/${response.id}`)
                } else {
                    setStatus("We weren't able to process your edit item request.")
                }
            })
        } else {
            setStatus("Your log in credentials could not be validated.")
        }
    }

    // sends a delete request to the apiService
    const deleteItem = async() => {
        const deletedItem = {
            id: item.id,
            name: item.name
        }
        await apiService.deleteItem(deletedItem, (response) => {
            if (response.success) {
                setStatus(`You have successfully deleted item ${ response.name }.`)
                setUnsaved(false)
                navigate(`/unit/${ item.unit.id }`)
            } else {
                setStatus("We weren't able to process your delete item request.")
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
                <div className="col-2 d-flex justify-content-end p-0">
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
                                name="name" 
                                value={ safeChanges.name } 
                                onChange={ (event) => handleChanges.handleTextChange(event, safeChanges, setSafeChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Template
                        </div>
                        <div className="col-content">
                            { 
                            // dangerMode ? <Dropdown 
                            //     list={ simpleCategories } 
                            //     current={ dangerChanges.template.name } 
                            //     setCurrent={ handleCategoryChange }
                            // /> :
                             item.template.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Inspected By
                        </div>
                        <div className="col-content">
                            { item.inspected ? item.inspected.name : "No inspection recorded." }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Inspected At
                        </div>
                        <div className="col-content">
                            { item.inspected ? friendlyDate(item.inspected.date) : "No inspection recorded." }
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
                {/* <div className="row row-info">
                    <div className="col-2 col-content col-icon">
                        <img className="img-fluid icon" src={ `/img/${ item.template.icon }.png` } alt={ item.template.name + " icon" } />
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
                </div> */}
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
                            Initial Value
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="number" 
                                step=".01"
                                name="initialValue" 
                                value={ dangerChanges.initialValue } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : `$${ parseFloat(item.value.initialValue).toFixed(2) }` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Depreciation Rate
                        </div>
                        <div className="col-content">
                            { dangerMode ? <input 
                                type="number" 
                                name="depreciationRate" 
                                value={ dangerChanges.depreciationRate } 
                                onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            /> : item.value.depreciationRate }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            {
                            // dangerMode ? <input 
                            //     type="text" 
                            //     name="unit.facility.name" 
                            //     value={ dangerChanges.unit.facility.name } 
                            //     onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            // /> :
                            item.unit.facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit
                        </div>
                        <div className="col-content">
                            { 
                            // dangerMode ? <input 
                            //     type="text" 
                            //     name="unit.name" 
                            //     value={ dangerChanges.unit.name } 
                            //     onChange={ (event) => handleChanges.handleTextChange(event, dangerChanges, setDangerChanges, setUnsaved) } 
                            // /> : 
                            item.unit.name }
                        </div>
                    </div>
                </div>
                { dangerMode && <Button text="Delete Item" linkTo={ deleteItem } type="danger" /> }
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/item/${id}` } locationId={ item.unit.locationId } /> }
            </div>
        </main>
    )
}
}

export default ItemEdit