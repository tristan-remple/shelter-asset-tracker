// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import { formattedDate } from '../Services/dateHelper'
import { statusContext, userContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Autofill from '../Components/Autofill'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

//------ MODULE INFO
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
    const { setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")
    const { userDetails } = useContext(userContext)
    const [ forceValidation, setForceValidation ] = useState(0)

    // the unit and the category list both have to load before the page can render
    // this is used to set err to null when the fetches both succeed
    const [ unitLoaded, setUnitLoaded ] = useState(false)
    const [ categoriesLoaded, setCategoriesLoaded ] = useState(false)

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
                    setUnitLoaded(true)
                }
            })
        })()
    }, [])

    // new item state
    const [ newItem, setNewItem ] = useState({
        name: "",
        unitId: 0,
        template: {
            id: 0,
            name: "",
            defaultValue: 0,
            iconAssociation: {},
            singleUse: false
        },
        added: {
            id: 0,
            name: "Someguy",
            date: formattedDate()
        },
        donated: false,
        initialValue: 0,
        vendor: "",
        invoice: "",
        errorFields: []
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
                    setCategoriesLoaded(true)

                    // the Dropdown component later is expecting a list of strings
                    const simpleList = data.map(cat => cat.name)
                    setSimpleCategories(simpleList)
                }
            })
        })()
    }, [])

    // if both loading flags are true, clear the loading err state
    useEffect(() => {
        if (unitLoaded && categoriesLoaded && err === "loading") {
            setErr(null)
        }
    }, [ unitLoaded, categoriesLoaded ])

    // Most changes are handled by Services/handleChanges

    // handles category change
    // passed into Dropdown
    const [ categoryError, setCategoryError ] = useState("")
    const handleCategoryChange = (newCatName) => {
        const newCatIndex = categoryList.map(cat => cat.name).indexOf(newCatName)
        if (newCatIndex !== -1) {
            console.log(categoryList[newCatIndex])
            const newItemAdditions = {...newItem}
            newItemAdditions.template = categoryList[newCatIndex]
            newItemAdditions.initialValue = parseFloat(categoryList[newCatIndex].defaultvalue)
            const errorIndex = newItemAdditions.errorFields.indexOf("category")
            if (errorIndex !== -1) { newItemAdditions.errorFields.splice(errorIndex, 1) }
            setNewItem(newItemAdditions)
            setUnsaved(true)
            setCategoryError("")
        } else {
            setCategoryError("The category you selected cannot be found.")
            const itemChanges = { ...newItem }
            if (itemChanges.errorFields.indexOf("category") === -1) {
                itemChanges.errorFields.push("category")
            }
        }
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // check that fields have been filled in
        if (newItem.name === "" || newItem.initialValue === 0 || newItem.category === "") {
            setForceValidation(forceValidation + 1)
            setCategoryError("An item must have a category.")
            setStatus({
                message: "A new item must have a label, a category, and an initial value.",
                error: true
            })
            return
        }

        const changes = {...newItem}

        changes.templateId = changes.template.id
        changes.addedBy = userDetails.userId
        changes.donated = newItem.donated ? 1 : 0
        changes.usefulLifeOffset = 12

        // send api request and process api response
        await apiService.postNewItem(changes, (response => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully added item ${ response.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/item/${ response.itemId }`)
            }
        }))
    }

    const formControls = { 
        changes: newItem, 
        setChanges: setNewItem, 
        unsaved, 
        setUnsaved, 
        force: forceValidation 
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
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Label *
                        </div>
                        <div className="col-content">
                            <RegularField
                                type="text"
                                name="name"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Item Category *
                        </div>
                        <div className="col-content">
                            <Autofill
                                list={ simpleCategories } 
                                current={ newItem.template.name } 
                                setCurrent={ handleCategoryChange }
                                error={ categoryError }
                            />
                        </div>
                    </div>
                    <div className="col-2 col-content col-icon">
                        { newItem.template.iconAssociation.src ? <img className="img-fluid icon" src={ `/img/${ newItem.template.iconAssociation.src }` } alt={ newItem.template.iconAssociation.name + " icon" } /> : "Select category to view icon." }
                    </div>
                </div>
                <div className="row row-info">
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
                    <div className="col col-info">
                        <div className="col-head">
                            Vendor
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="vendor"
                                formControls={ formControls }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Invoice Number
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="invoice"
                                formControls={ formControls }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Initial Value *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="number"
                                name="initialValue"
                                formControls={ formControls }
                                step=".01"
                                required={ true }
                            />
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${ unit.id }` } /> }
            </div>
        </main>
    )
}

export default ItemCreate