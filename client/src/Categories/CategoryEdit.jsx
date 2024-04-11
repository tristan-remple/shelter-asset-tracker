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
// Allows the user to change the information about a single category.
// Imported by: App

const CategoryEdit = () => {

    // get the status from context
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const response = apiService.singleCategory(id)
    if (!response || response.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure response
    const { categoryId, categoryName, defaultValue, defaultUsefulLife, icon, singleUse, items, created, updated } = response

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        categoryName,
        defaultValue,
        defaultUsefulLife,
        icon,
        singleUse
    })

    // open or close the icon selector menu
    const [ selector, setSelector ] = useState(false)
    const toggleSelector = () => {
        const newSelector = selector ? false : true
        setSelector(newSelector)
    }

    // sends the item object to the apiService
    const saveChanges = () => {
        const editedCategory = {...changes}
        editedCategory.categoryId = categoryId
        editedCategory.created = created
        editedCategory.updated = formattedDate()

        if (authService.checkUser()) {
            const response = apiService.postCategoryEdit(editedCategory)
            if (response.success) {
                setStatus(`You have successfully saved your changes to category ${ response.categoryName }.`)
                setUnsaved(false)
                navigate(`/category/${id}`)
            } else {
                setStatus("We weren't able to process your edit category request.")
            }
        } else {
            setStatus("Your log in credentials could not be validated.")
        }
    }

    return (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Edit { capitalize(categoryName) } Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/category/${ categoryId }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete" linkTo={ `/category/${ categoryId }/delete` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name
                        </div>
                        <div className="col-content my-2">
                            <input className='my-2'
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
                    <div className="col col-info">
                        <div className="col-head">
                            Updated
                        </div>
                        <div className="col-content">
                            { friendlyDate(updated) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(created) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value
                        </div>
                        <div className="col-content mt-2">
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
                        <div className="col-content mt-2">
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
                            # of Items
                        </div>
                        <div className="col-content">
                            { items }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ changes.icon }.png` } alt={ categoryName + " icon" } />
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
                            { selector && <IconSelector changes={ changes } setChanges={ setChanges } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/category/${id}` } locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryEdit