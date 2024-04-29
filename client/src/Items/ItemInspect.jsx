// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import { friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Reusables/Button"
import Flag, { flagTextOptions, flagColorOptions } from "../Reusables/Flag"
import Error from '../Reusables/Error'
import Dropdown from '../Reusables/Dropdown'
import ChangePanel from '../Reusables/ChangePanel'
import CommentBox from '../Reusables/CommentBox'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows a user to edit the details about a single item in the collection.
// This module does NOT currently record which user is editing.
// User information will need to be taken either here or in the apiService module.
// Handling for certain IDs also needs to be implemented.
//
// Possible edits are divided into "safe" and"dangerous" changes.
// Safe changes are expected in the regular use of the app.
// Dangerous changes would only need to be applied if there was an error when creating the item.
// Delete item also only appears during "danger mode" editing.
// When changes are saved or cancelled, this page will redirect to the item details page.
// When the item is deleted, it will redirect to the unit overview.
//
// Imported by: App

const ItemInspect = () => {

    // id from the url and status from the context
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)

    // navigation and error handling
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")

    // redirect to the error page if no item is specified or if the item specified isn't found
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch the item data
    const [ item, setItem ] = useState()
    useEffect(() => {
        (async() => {
            await apiService.singleItem(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setItem(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // object that defines fields that are safe to change
    const [ changes, setChanges ] = useState({
        statusColor: flagColorOptions[0],
        statusText: flagTextOptions[0],
        comment: ""
    })

    useEffect(() => {
        if (item) {

            // flag options are defined in the flag module
            let flagColor = flagColorOptions[0]
            let flagText = flagTextOptions[0]
            if ( item.toDiscard ) {
                flagColor = flagColorOptions[2]
                flagText = flagTextOptions[2]
            } else if ( item.toInspect ) {
                flagColor  = flagColorOptions[1]
                flagText = flagTextOptions[1]
            }
            
            setChanges({
                statusColor: flagColor,
                statusText: flagText,
                comment: ""
            })
        }
    }, [ item ])

    // Text changes are handled by Services/handleChanges

    // handles flag dropdown state
    const handleFlag = (input) => {
        const newChanges = {...changes}
        const index = flagTextOptions.indexOf(input)
        if (index > -1) {
            newChanges.statusColor = flagColorOptions[index]
            newChanges.statusText = flagTextOptions[index]
        }
        setChanges(newChanges)
        setUnsaved(true)
    }

    const [ confirm, setConfirm ] = useState(false)

    // sends the item object to the apiService
    const saveChanges = async() => {

        const newItem = {...item}
        newItem.unitId = item.unit.id
        newItem.toInspect = changes.statusText === flagTextOptions[1]
        newItem.toDiscard = changes.statusText === flagTextOptions[2]
        newItem.comment = changes.comment

        if (newItem.toInspect === item.toInspect && newItem.toDiscard === item.toDiscard && !confirm) {
            if (newItem.comment === "") {
                setStatus("You have not entered or changed anything.")
                return
            }
            setStatus("You have not changed the status flag of this item. To confirm that you'd like to submit anyway, click save again.")
            setConfirm(true)
            return
        }

        await apiService.postItemEdit(newItem, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully changed the status flag on ${ response.name }.`)
                setUnsaved(false)
                navigate(`/item/${response.id}`)
            }
        })

    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Inspecting { capitalize(item?.template.name) } { item?.label } in { item?.unit.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Cancel Inspection" linkTo={ `/item/${ item?.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Status
                        </div>
                        <div className="col-content">
                            <Flag color={ changes.statusColor } />
                            <Dropdown
                                list={ flagTextOptions }
                                current={ changes.statusText }
                                setCurrent={ handleFlag }
                            />
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col-8 col-content">
                        <strong>New Comment: </strong><br />
                        <textarea 
                            name="comment" 
                            value={ changes.comment } 
                            onChange={ (event) => handleChanges.handleTextChange(event, changes, setChanges, setUnsaved) } 
                            className="comment-area" 
                        />
                    </div>
                </div>
                { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/item/${ item?.id }` } /> }
            </div>
        </main>
    )
}

export default ItemInspect