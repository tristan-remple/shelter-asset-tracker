// external dependencies
import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

// internal dependencies
import apiService from "../Services/apiService"
import capitalize from '../Services/capitalize'
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import { friendlyDate } from '../Services/dateHelper'

// components
import Button from "../Components/Button"
import Flag, { flagOptions } from "../Components/Flag"
import Error from '../Components/Error'
import Dropdown from '../Components/Dropdown'
import ChangePanel from '../Components/ChangePanel'
import Statusbar from '../Components/Statusbar'

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
    const { setStatus } = useContext(statusContext)

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
        status: "ok",
        flag: flagOptions[0],
        eol: "",
        usefulLifeOffset: 0,
        comment: ""
    })

    useEffect(() => {
        if (item) {

            // flag options are defined in the flag module
            let currentFlag = flagOptions.filter(option => {
                return option.text.toLowerCase() === item.status
            })[0]
            
            setChanges({
                status: item.status,
                flag: currentFlag,
                eol: item.eol,
                usefulLifeOffset: 0,
                comment: ""
            })
        }
    }, [ item ])

    // Text changes are handled by Services/handleChanges

    // handles flag dropdown state
    const flagTextOptions = flagOptions.map(option => option.text)
    const handleFlag = (input) => {
        const newChanges = {...changes}
        const index = flagOptions.findIndex(option => option.text === input)
        if (index > -1) {
            newChanges.status = flagOptions[index].text.toLowerCase()
            newChanges.flag = flagOptions[index]
        }
        setChanges(newChanges)
        setUnsaved(true)
    }

    const [ snoozeYears, setSnoozeYears ] = useState(0)
    const snooze = () => {
        const newChanges = {...changes}
        
        const date = new Date(newChanges.eol)
        date.setFullYear(date.getFullYear() + 1)
        newChanges.eol = date.toISOString()
        newChanges.usefulLifeOffset += 12

        setChanges(newChanges)
        setSnoozeYears(snoozeYears + 1)
    }

    const unsnooze = () => {
        const newChanges = {...changes}
        
        const date = new Date(newChanges.eol)
        date.setFullYear(date.getFullYear() - 1)
        newChanges.eol = date.toISOString()
        newChanges.usefulLifeOffset += -12

        setChanges(newChanges)
        setSnoozeYears(snoozeYears - 1)
    }

    const now = new Date().getTime()
    const [ eolError, setEolError ] = useState(false)
    useEffect(() => {
        const eolTime = new Date(changes.eol).getTime()
        if (eolTime <= now && changes.flag !== "discard") {
            setEolError(true)
        } else {
            setEolError(false)
        }
    }, [ changes ])

    const [ confirm, setConfirm ] = useState(false)
    
    // https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
    function monthDiff(d1, d2) {
        d1 = new Date(d1)
        d2 = new Date(d2)
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12
        months -= d1.getMonth()
        months += d2.getMonth()
        return months
    }

    // sends the item object to the apiService
    const saveChanges = async() => {

        const newItem = {...item}
        newItem.unitId = item.unit.id
        newItem.status = changes.status
        newItem.comment = changes.comment
        newItem.eol = changes.eol
        newItem.usefulLifeOffset = monthDiff(item.eol, changes.eol)

        if (newItem.status === item.status && !confirm) {
            if (newItem.comment === "" && newItem.eol === item.eol) {
                setStatus({
                    message: "You have not entered or changed anything.",
                    error: true
                })
                return
            }
            setStatus({
                message: "You have not changed the status flag of this item. To confirm that you'd like to submit anyway, click save again.",
                error: true
            })
            setConfirm(true)
            return
        }

        const eolTime = new Date(changes.eol).getTime()
        if (eolTime <= now && changes.flag.text !== "Discard") {
            setStatus({
                message: "The End of Life date you have set is in the past. Please set an End of Life date in the future or set the flag to discard.",
                error: true
            })
            return
        }

        await apiService.postItemEdit(newItem, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have submitted an inspection on ${ response.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/item/${response.id}`)
            }
        })

    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row mt-3 mb-2">
                <div className="col">
                    <h2>Recording Inspection on { capitalize(item?.template.name) } { item?.label } in { item?.unit.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Cancel Inspection" linkTo={ `/item/${ item?.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    <Button text="Save Changes" linkTo={ saveChanges } type="action" />
                </div>
            </div>
            <div className="page-content">
                <Statusbar />
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Status *
                        </div>
                        <div className="col-content">
                            <div className="flag-wrapper">
                                <Flag color={ changes.flag.color } />
                                <Dropdown
                                    list={ flagTextOptions }
                                    current={ changes.flag.text }
                                    setCurrent={ handleFlag }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Adjust End of Life
                        </div>
                        <div className="col-content">
                            <p className="my-2" style={{ textAlign: "center", width: "100%" }}>{ friendlyDate(changes.eol) }</p>
                            <div className="btn-group" role="group">
                                <Button text="-" type="action" linkTo={ unsnooze } />
                                <div className="btn btn-outline-primary">{ snoozeYears } year(s)</div>
                                <Button text="+" type="action" linkTo={ snooze } />
                            </div>
                            { eolError ? <div className="row row-info error error-message" style={{ width: "100%" }}><p className="my-2">If the item is still usable, please set an End of Life date in the future.</p></div> :
                            <div className="row row-info" style={{ width: "100%" }}><p className='my-2'>To set a more specific end of life, you can go to the <Link to={ `/items/${ item.id }/edit` }>Item Edit page</Link>.</p></div> }
                        </div>
                    </div>
                </div>
                <div className="row row-info">
                    <div className="col col-content">
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