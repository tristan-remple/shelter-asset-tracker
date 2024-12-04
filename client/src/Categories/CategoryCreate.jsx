// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import IconSelector from './IconSelector'
import ChangePanel from '../Components/ChangePanel'
import Checkbox from '../Components/Checkbox'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

//------ MODULE INFO
// Allows the user add a new category
// Imported by: App
// Navigated from: CategoryList

const CategoryCreate = () => {

    // set up page functionality
    const navigate = useNavigate()
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState(null)
    const [ forceValidation, setForceValidation ] = useState(0)

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        name: "",
        defaultUsefulLife: 0,
        defaultValue: 0,
        depreciationRate: 0,
        icon: "",
        singleResident: false,
        errorFields: []
    })

    // open or close the icon selector menu
    const [ selector, setSelector ] = useState(false)
    const toggleSelector = () => {
        const newSelector = selector ? false : true
        setSelector(newSelector)
    }

    // handle single resident checkbox
    const checkHandler = () => {
        const newChanges = { ...changes }
        newChanges.singleResident = changes.singleResident ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // validation
        if (changes.name === "" || changes.defaultUsefulLife == "" || changes.defaultValue == "" || changes.icon === "" || changes.errorFields.length > 0) {
            setForceValidation(forceValidation + 1)
            setStatus({
                message: "Please check that all category fields are filled in correctly.",
                error: true
            })
            if (changes.icon === "" && changes.errorFields.indexOf("icon") === -1) {
                const newChanges = {...changes}
                newChanges.errorFields.push("icon")
            }
            return
        }

        // set the icon to the icon's id instead of the whole object
        const newChanges = {...changes}
        newChanges.icon = changes.icon.id

        // api call
        await apiService.postNewCategory(newChanges, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully created category ${ response.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/category/${ response.id }`)
            }
        })
    }

    const formControls = { 
        changes, setChanges, unsaved, setUnsaved, 
        force: forceValidation
    }

    // if there's an error, return the error screen instead of the page
    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Create New Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/categories" type="nav" tabIndex={ selector ? -1 : 0 } />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" tabIndex={ selector ? -1 : 0 } />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="name"
                                formControls={ formControls }
                                required={ true } 
                                tabIndex={ selector ? -1 : 0 } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Single Resident
                        </div>
                        <div className="col-content">
                            <Checkbox 
                                id="singleResident"
                                name="Single Resident"
                                checked={ changes.singleResident }
                                changeHandler={ checkHandler }
                                tabIndex={ selector ? -1 : 0 } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life *<br />
                            (In Months)
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="number"
                                name="defaultUsefulLife"
                                formControls={ formControls }
                                required={ true }
                                tabIndex={ selector ? -1 : 0 } 
                            />
                            <br />
                            { changes.errorFields.indexOf("defaultUsefulLife") === -1 && `Equivalent to ${ (changes.defaultUsefulLife / 12).toFixed(1) } years` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="number"
                                name="defaultValue"
                                step=".01"
                                formControls={ formControls }
                                required={ true }
                                tabIndex={ selector ? -1 : 0 } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Icon *
                        </div>
                        <div className="col-icon col-content d-flex justify-content-start">
                            { changes.icon && <img className="img-fluid small-icon" src={ `/img/${ changes.icon.src }` } alt={ changes.icon.alt } /> }
                            <Button text="Change Icon" linkTo={ toggleSelector } type={ changes.errorFields.indexOf("icon") === -1 ? "admin" : "error" } />
                            { changes.errorFields.indexOf("icon") > -1 && <div className="row row-info error error-message"><p className="my-2">A new category requires an icon.</p></div> }
                            { selector && <IconSelector changes={ changes } setChanges={ setChanges } toggle={ toggleSelector } tabIndex={ selector ? -1 : 0 } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/categories" locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryCreate