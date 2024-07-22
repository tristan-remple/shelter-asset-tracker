// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import authService from '../Services/authService'
import { formattedDate, friendlyDate } from '../Services/dateHelper'
import { statusContext, authContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import ChangePanel from '../Reusables/ChangePanel'
import Dropdown from '../Reusables/Dropdown'
import capitalize from '../Services/capitalize'
import Autofill from '../Reusables/Autofill'

//------ MODULE INFO
// ** Available for SCSS **
// This module allows an admin to add a new unit to a location.
// Imported by: App

const UnitCreate = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ unitTypes, setUnitTypes ] = useState([])
    const [ simpleTypes, setSimpleTypes ] = useState([])
    const fetchTypes = async() => {
        await apiService.getSettings((data) => {
            if (data.error) {
                setErr(data.error)
            } else {
                setUnitTypes(data.unitTypes)
                const simple = data.unitTypes.map(type => capitalize(type.name))
                simple.unshift("Select:")
                setSimpleTypes(simple)
                setErr(null)
            }
        })
    }

    const [ location, setLocation ] = useState({})
    useEffect(() => {
        (async() => {
            await apiService.singleLocation(id, (data) => {
                if (data.error) {
                    setErr(data.error)
                } else {
                    setLocation(data)
                    fetchTypes()
                }
            })
        })()
    }, [])

    // unsaved toggles the ChangePanel
    const [ unsaved, setUnsaved ] = useState(false)

    // set possible changes
    const [ changes, setChanges ] = useState({
        name: "",
        type: "",
        facilityId: undefined
    })

    // assign fetched location to new unit
    useEffect(() => {
        if (location) {
            setChanges({
                name: "",
                type: "Select:",
                facilityId: location.facilityId
            })
        }
    }, [ location ])

    // handles type change
    // passed into Dropdown
    const handleTypeChange = (newTypeName) => {
        const newTypeIndex = unitTypes.map(type => capitalize(type.name)).indexOf(newTypeName)
        if (newTypeIndex !== -1) {
            const newChanges = {...changes}
            newChanges.type = unitTypes[newTypeIndex]
            setChanges(newChanges)
            setUnsaved(true)
            setStatus("")
        } else {
            setStatus("The type you selected cannot be found.")
        }
    }

    // send the unit object to apiService
    const saveChanges = () => {

        // light validation
        if (changes.name == "" || changes.type == "" || changes.type == "Select:") {
            setStatus("A new unit must have a name and a type.")
            return
        }

        const newChanges = {...changes}
        newChanges.type = changes.type.id

        // send api request and process api response
        apiService.postNewUnit(newChanges, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus(`You have successfully created unit ${ changes.name }.`)
                setUnsaved(false)
                navigate(`/unit/${ response.unitId }`)
            }
        })
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row my-3">
                <div className="col">
                    <h2>New Unit in { location.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/location/${ location.facilityId }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <div className="row row-info">
                    <div className="col col-info">
                        <div className="col-head">
                            Location
                        </div>
                        <div className="col-content">
                            { location.name }
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Name
                        </div>
                        <div className="col-content">
                            <input 
                               className='my-2'
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
                            <Autofill
                                list={ simpleTypes }
                                current={ capitalize(changes.type.name) }
                                setCurrent={ handleTypeChange }
                            />
                        </div>
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/location/${ location.facilityId }` } locationId={ location.facilityId } /> }
        </main>
    )
}

export default UnitCreate