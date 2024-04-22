// external dependencies
import { useContext, useState, useEffect } from 'react'
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
    const [ err, setErr ] = useState(null)

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        name: "",
        defaultValue: 0,
        defaultDepreciation: 0,
        icon: "",
        singleResident: false
    })

    // open or close the icon selector menu
    const [ selector, setSelector ] = useState(false)
    const toggleSelector = () => {
        const newSelector = selector ? false : true
        setSelector(newSelector)
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        // validation
        if (changes.name === "" || changes.defaultValue < 1 || changes.defaultDepreciation <= 0 || changes.icon === "") {
            setStatus("Please fill in all category fields.")
            return
        }

        // api call
        await apiService.postNewCategory(changes, (response) => {
            if (response?.status === 200) {
                setStatus(`You have successfully created category ${ response.name }.`)
                setUnsaved(false)
                navigate(`/category/${ response.id }`)
            } else if (response?.status === 400) {
                setStatus(`Category ${ changes.name } already exists.`)
            } else if (response?.status === 403) {
                setErr("permission")
            } else {
                setStatus("We weren't able to process your create category request.")
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Create New Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo="/categories" type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name
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
                            Single Resident
                        </div>
                        <div className="col-content">
                            <input 
                                type="checkbox"
                                name="singleResident" 
                                checked={ changes.singleResident }
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
                            Default Depreciation Rate
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                name="defaultDepreciation" 
                                value={ changes.defaultDepreciation } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content d-flex justify-content-start">
                            { changes.icon && <img className="img-fluid small-icon" src={ `/img/${ changes.icon }.png` } /> }
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
                            { selector && <IconSelector changes={ changes } setChanges={ setChanges } toggle={ toggleSelector } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut="/categories" locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryCreate