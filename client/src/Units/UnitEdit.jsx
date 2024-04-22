// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import CommentBox from '../Reusables/CommentBox'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module displays the details about a single unit inside of a building. Examples include apartments and snugs.
// The items within the unit are displayed as well.
// Imported by: App

const UnitEdit = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const [ unsaved, setUnsaved ] = useState(false)
    const navigate = useNavigate()

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        setErr("undefined")
    }

    // check that user is an admin
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        setErr("permission")
    }

    // fetch unit data from the api
    const [ response, setResponse ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data?.error?.error === "Unauthorized.") {
                    setErr("permission")
                } else if (!data || data.error) {
                    setErr("api")
                } else {
                    setResponse(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // set delete label
    const [ deletedLabel, setDeletedLabel ] = useState("Delete Unit")
    // if (deleteDate) {
    //     setDeletedLabel("Restore Unit")
    // }

    // set possible changes
    const [ changes, setChanges ] = useState({
        name: "",
        type: "",
        createdAt: ""
    })

    useEffect(() => {
        if (response) {
            setChanges({
                name: response.name,
                type: response.type,
                createdAt: response.createdAt
            })
        }
    }, [ response ])

    if (err) { return <Error err={ err } /> }
    if (response) {
    // destructure api response
    const { id, name } = response   

    // sends the item object to the apiService
    const saveChanges = async() => {

        changes.id = id
        changes.facilityId = response.facility.id

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {
            // send api request and process api response
            await apiService.postUnitEdit(changes, (response) => {
                if (response.success) {
                    setStatus(`You have successfully updated ${ response.name }.`)
                    setUnsaved(false)
                    navigate(`/unit/${ id }`)
                } else {
                    setStatus("We weren't able to process your update item request.")
                }
            })
        } else {
            setErr("permission")
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Unit { name } in (Location)</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/location/${ response.facility.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text={ deletedLabel } linkTo={ `/unit/${ id }/delete` } type="danger" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='mb-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { response.facility.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
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
                            Unit Type
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="type" 
                                value={ changes.type } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    {/* <div className="col col-info">
                        <div className="col-head">
                            Updated By
                        </div>
                        <div className="col-content">
                            { inspected.userName }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Updated At
                        </div>
                        <div className="col-content">
                            { friendlyDate(inspected.inspectedDate) }
                        </div>
                    </div> */}
                    {/* <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            <input 
                                type="date" 
                                name="createdAt" 
                                value={ changes.createdAt.split("T")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div> */}
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${ id }` } locationId={ response.facility.id } /> }
        </main>
    )
}
}

export default UnitEdit