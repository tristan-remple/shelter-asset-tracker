// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'
import capitalize from '../Services/capitalize'
import handleChanges from '../Services/handleChanges'
import { friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import IconSelector from './IconSelector'
import ChangePanel from '../Components/ChangePanel'
import Checkbox from '../Components/Checkbox'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

//------ MODULE INFO
// Allows the user to change the information about a single category.
// Imported by: App
// Navigated from: CategoryDetails
// Navigates to: CategoryDelete

const CategoryEdit = () => {

    // get the status from context
    const { id } = useParams()
    const { setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")
    const [ forceValidation, setForceValidation ] = useState(0)

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // form controls
    const [ unsaved, setUnsaved ] = useState(false)
    const [ changes, setChanges ] = useState({
        id: null,
        name: null,
        defaultvalue: null,
        depreciationRate: null,
        defaultusefullife: null,
        icon: null,
        singleResident: null,
        errorFields: []
    })

    // fetch data from the api
    const [ response, setResponse ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleCategory(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setResponse(data)
                    setErr(null)

                    data.icon = data.iconAssociation
                    data.errorFields = []
                    console.log(data)
                    setChanges(data)
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

    // handles single resident checkbox
    const checkHandler = () => {
        const newChanges = { ...changes }
        newChanges.singleResident = changes.singleResident ? false : true
        setChanges(newChanges)
        setUnsaved(true)
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        if (changes.name === "" || changes.defaultusefullife == "" || changes.defaultvalue == "" || changes.icon === "" || changes.errorFields.length > 0) {
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

        const editedCategory = {...changes}
        editedCategory.icon = changes.icon.id
        editedCategory.depreciationRate = changes.depreciationRate / 100
        await apiService.postCategoryEdit(editedCategory, (res) => {
            if (res.success) {
                setStatus({
                    message: `You have successfully saved your changes to category ${ res.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/category/${ id }`)
            } else {
                setStatus({
                    message: "We weren't able to process your edit category request.",
                    error: true
                })
            }
        })
    }

    const formControls = { 
        changes, setChanges, unsaved, setUnsaved, 
        force: forceValidation
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Edit { capitalize(response.name) } Category</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/category/${ id }` } type="nav" tabIndex={ selector ? -1 : 0 } />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save" linkTo={ saveChanges } type="admin" tabIndex={ selector ? -1 : 0 } />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete" linkTo={ `/category/${ id }/delete` } type="danger" tabIndex={ selector ? -1 : 0 } />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Name *
                        </div>
                        <div className="col-content my-2">
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
                                checked={ changes.singleresident }
                                changeHandler={ checkHandler }
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
                    {/* <div className="col col-info">
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
                    </div> */}
                </div>
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Default Useful Life *<br />(In Months)
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="number"
                                name="defaultusefullife"
                                formControls={ formControls }
                                required={ true }
                                tabIndex={ selector ? -1 : 0 }
                            />
                            <br />
                            { changes.errorFields.indexOf("defaultusefullife") === -1 && `Equivalent to ${ (changes.defaultusefullife / 12).toFixed(1) } years` }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Default Value *
                        </div>
                        <div className="col-content mt-2">
                            <RegularField 
                                type="number"
                                name="defaultvalue"
                                step=".01"
                                formControls={ formControls }
                                required={ true }
                                tabIndex={ selector ? -1 : 0 }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Icon *
                        </div>
                        <div className="col-icon col-content">
                            <img className="img-fluid small-icon" src={ `/img/${ changes.icon.src }` } alt={ changes.icon.name + " icon" } />
                            <Button text="Change Icon" linkTo={ toggleSelector } type="admin" />
                            { changes.errorFields.indexOf("icon") > -1 && <div className="row row-info error error-message"><p className="my-2">A category requires an icon.</p></div> }
                            { selector && <IconSelector changes={ changes } setChanges={ setChanges } toggle={ toggleSelector } tabIndex={ selector ? -1 : 0 } /> }
                        </div>
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/category/${ id }` } locationId="0" /> }
            </div>
        </main>
    )
}

export default CategoryEdit