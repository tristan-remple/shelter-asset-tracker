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
// Allows the user to change the information about a single category.
// Imported by: App

const CategoryEdit = () => {

    // get the status from context
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        id: null,
        name: null,
        defaultValue: null,
        depreciationRate: null,
        defaultUsefulLife: null,
        icon: null,
        singleResident: null
    })

    // fetch data from the api
    const [ response, setResponse ] = useState()
    const [ icons, setIcons ] = useState([])
    useEffect(() => {
        (async() => {
            await apiService.singleCategory(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    console.log(data)
                    setResponse(data)
                    setErr(null)
                    setChanges({
                        id: id,
                        name: data.name,
                        defaultValue: parseFloat(data.defaultValue),
                        depreciationRate: parseFloat(data.depreciationRate) * 100,
                        defaultUsefulLife: parseInt(data.defaultUsefulLife),
                        icon: data.Icon,
                        singleResident: data.singleResident
                    })
                }
            })
            await apiService.listIcons((data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setIcons(data)
                }
            })
        })()
    }, [])

    // open or close the icon selector menu
    const [ selector, setSelector ] = useState(false)
    const toggleSelector = () => {
        const newSelector = selector ? false : true
        setSelector(newSelector)
    }

    // sends the item object to the apiService
    const saveChanges = async() => {
        const editedCategory = {...changes}
        editedCategory.icon = changes.icon.id
        editedCategory.depreciationRate = changes.depreciationRate / 100
        await apiService.postCategoryEdit(editedCategory, (res) => {
            if (res.success) {
                setStatus(`You have successfully saved your changes to category ${ res.name }.`)
                setUnsaved(false)
                navigate(`/category/${ id }`)
            } else {
                setStatus("We weren't able to process your edit category request.")
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Edit { capitalize(response.name) } Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/category/${ id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete" linkTo={ `/category/${ id }/delete` } type="danger" />
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
                    <div className="col col-info">
                        <div className="col-head">
                            # of Items
                        </div>
                        <div className="col-content">
                            { response.itemCount }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated
                        </div>
                        <div className="col-content">
                            { friendlyDate(response.updatedAt) }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            { friendlyDate(response.createdAt) }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life
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
                            Default Depreciation Rate<br />(Annual Percent)
                        </div>
                        <div className="col-content mt-2">
                            <input 
                                type="number" 
                                name="depreciationRate" 
                                value={ changes.depreciationRate } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ changes.icon.src }` } alt={ changes.icon.name + " icon" } />
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
                            { selector && <IconSelector iconList={ icons } changes={ changes } setChanges={ setChanges } toggle={ toggleSelector } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/category/${ id }` } locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryEdit