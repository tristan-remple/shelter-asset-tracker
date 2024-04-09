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
    const [ err, setErr ] = useState(null)
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
    // const response = apiService.singleUnit(id)
    // if (!response || response.error) {
    //     console.log("api error")
    //     setErr("api")
    // }

    const [ response, setResponse ] = useState()
    // fetch unit data from the api
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (!data || data.error) {
                    console.log("api error")
                    setErr("api")
                }
                console.log(data)
                setResponse(data)
            })
        })()
    }, [])

    // set delete label
    const [ deletedLabel, setDeletedLabel ] = useState("Delete Location")
    // if (deleteDate) {
    //     setDeletedLabel("Restore Location")
    // }

    // set possible changes
    const [ changes, setChanges ] = useState({
        unitName: "",
        // type,
        // added,
        // inspected
        // comment: ""
    })

    useEffect(() => {
        if (response) {
            setChanges({
                unitName: response.unitName
            })
        }
    }, [ response ])

    if (response) {
    // destructure api response
    const { unitId, unitName } = response   

    // sends the item object to the apiService
    const saveChanges = async() => {

        // verify user identity
        if (authService.checkUser() && authService.checkAdmin()) {
            // send api request and process api response
            await apiService.postUnitEdit(changes, (response) => {
                if (response.success) {
                    setStatus(`You have successfully updated ${ response.unitName }.`)
                    setUnsaved(false)
                    navigate(`/unit/${ response.unitId }`)
                } else {
                    setStatus("We weren't able to process your add item request.")
                }
            })
        } else {
            setErr("permission")
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Unit { unitName } in (Location)</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/location/${2}` } type="nav" />
                </div>
                <div className="col-2">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2">
                    <Button text={ deletedLabel } linkTo={ `/unit/${ unitId }/delete` } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            {/* { locationName } */}
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            <input 
                                type="text" 
                                name="unitName" 
                                value={ changes.unitName } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Type
                        </div>
                        <div className="col-content">
                            {/* <input 
                                type="text" 
                                name="unitType" 
                                value={ changes.unitType } 
                                onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            /> */}
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
                    <div className="col col-info">
                        <div className="col-head">
                            Added
                        </div>
                        <div className="col-content">
                            {/* <input 
                                type="date" 
                                name="addedDate" 
                                value={ changes.added.addedDate.split(" ")[0] } 
                                onChange={ (event) => handleChanges.handleDateChange(event, changes, setChanges, setUnsaved) } 
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${ unitId }` } locationId={ 2 } /> }
        </main>
    )
}
}

export default UnitEdit