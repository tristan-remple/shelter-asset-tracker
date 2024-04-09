// external dependencies
import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { statusContext, authContext } from '../Services/Context'
import capitalize from '../Services/capitalize'
import handleChanges from '../Services/handleChanges'
import { formattedDate, friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import IconSelector from './IconSelector'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// Allows the user add a new category
// Imported by: App

const CategoryCreate = () => {

    // get the status from context
    const navigate = useNavigate()
    const { status, setStatus } = useContext(statusContext)

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        categoryName: "",
        defaultValue: 0,
        defaultUsefulLife: 0,
        icon: "",
        singleUse: false
    })

    // open or close the icon selector menu
    const [ selector, setSelector ] = useState(false)
    const toggleSelector = () => {
        const newSelector = selector ? false : true
        setSelector(newSelector)
    }

    // sends the item object to the apiService
    const saveChanges = () => {

        // validation
        if (changes.categoryName === "" || changes.defaultValue < 1 || changes.defaultUsefulLife < 1 || changes.icon === "") {
            setStatus("Please fill in all category fields.")
            return
        }

        // object normalization
        const newCategory = {...changes}
        newCategory.created = formattedDate()
        newCategory.updated = formattedDate()

        // api call
        if (authService.checkAdmin()) {
            const response = apiService.postNewCategory(newCategory)
            if (response.success) {
                setStatus(`You have successfully created category ${ response.categoryName }.`)
                setUnsaved(false)
                navigate(`/category/${response.categoryId}`)
            } else {
                setStatus("We weren't able to process your create category request.")
            }
        } else {
            setStatus("Your log in credentials could not be validated.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Create New Category</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo="/categories" type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="categoryName" 
                                value={ changes.categoryName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    
                    <div className="col col-info">
                        <div className="col-head">
                            Single Use
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="singleUse" 
                                checked={ changes.singleUse }
                                onChange={ (event) => handleChanges.handleCheckChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                name="defaultValue" 
                                step=".01"
                                value={ changes.defaultValue } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life (in Quarters)
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                name="defaultUsefulLife" 
                                value={ changes.defaultUsefulLife } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            { changes.icon && <img className="img-fluid small-icon" src={ `/img/${ changes.icon }.png` } /> }
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
                            { selector && <IconSelector changes={ changes } setChanges={ setChanges } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/categories" locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryCreate