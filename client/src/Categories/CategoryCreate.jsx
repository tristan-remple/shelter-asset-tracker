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

//------ MODULE INFO
// Allows the user add a new category
// Imported by: App
// Navigated from: CategoryList

const CategoryCreate = () => {

    // set up page functionality
    const navigate = useNavigate()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState(null)

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        name: "",
        defaultUsefulLife: 0,
        defaultValue: 0,
        depreciationRate: 0,
        icon: "",
        singleResident: false
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
        if (changes.name === "" || changes.defaultValue <= 0 || changes.defaultUsefulLife <= 0 || changes.icon === "") {
            setStatus("Please fill in all category fields.")
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
                setStatus(`You have successfully created category ${ response.name }.`)
                setUnsaved(false)
                navigate(`/category/${ response.id }`)
            }
        })
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
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life<br />
                            (In Months)
                        </div>
                        <div className="col-content">
                            <input 
                                type="number" 
                                name="defaultUsefulLife"
                                value={ changes.defaultUsefulLife } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                                tabIndex={ selector ? -1 : 0 }
                            /><br />
                            Equivalent to { (changes.defaultUsefulLife / 12).toFixed(1) } years
                        </div>
                    </div>
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
                                tabIndex={ selector ? -1 : 0 }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content d-flex justify-content-start">
                            { changes.icon && <img className="img-fluid small-icon" src={ `/img/${ changes.icon.src }` } alt={ changes.icon.alt } /> }
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
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