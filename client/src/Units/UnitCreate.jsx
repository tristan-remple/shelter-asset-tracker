// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext } from '../Services/Context'
import handleChanges from '../Services/handleChanges'
import capitalize from '../Services/capitalize'

// components
import Button from "../Components/Button"
import Error from '../Components/Error'
import ChangePanel from '../Components/ChangePanel'
import Autofill from '../Components/Autofill'
import Statusbar from '../Components/Statusbar'
import RegularField from '../Components/RegularField'

//------ MODULE INFO
// This module allows an admin to add a new unit to a location.
// Imported by: App

const UnitCreate = () => {

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const navigate = useNavigate()
    const [ err, setErr ] = useState("loading")
    const [ forceValidation, setForceValidation ] = useState(0)

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
        facilityId: undefined,
        errorFields: []
    })

    // assign fetched location to new unit
    useEffect(() => {
        if (location) {
            setChanges({
                name: "",
                type: "",
                facilityId: location.facilityId,
                errorFields: []
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
            const errorIndex = changes.errorFields.indexOf("type")
            if (errorIndex !== -1) {
                newChanges.errorFields.splice(errorIndex, 1)
            }
            setChanges(newChanges)
            setUnsaved(true)
            setStatus({
                message: "",
                error: false
            })
        } else {
            if (changes.errorFields.indexOf("type") === -1) {
                const newChanges = { ...changes }
                newChanges.errorFields.push("type")
                setChanges(newChanges)
            }
            setStatus({
                message: "The type you selected cannot be found.",
                error: true
            })
        }
    }

    // send the unit object to apiService
    const saveChanges = () => {

        // light validation
        if (changes.name == "" || changes.type == "" || changes.type == "Select:" || changes.errorFields.length > 0) {
            setStatus({
                message: "Please check that you have filled all required fields correctly.",
                error: true
            })
            if (changes.errorFields.indexOf("type") === -1 && (changes.type == "" || changes.type == "Select:")) {
                const newChanges = { ...changes }
                newChanges.errorFields.push("type")
                setChanges(newChanges)
            }
            setForceValidation(forceValidation + 1)
            return
        }

        const newChanges = {...changes}
        newChanges.type = changes.type.id

        // send api request and process api response
        apiService.postNewUnit(newChanges, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully created unit ${ changes.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/unit/${ response.unitId }`)
            }
        })
    }

    const formControls = { 
        changes, setChanges, unsaved, setUnsaved, 
        force: forceValidation
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
                <Statusbar />
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
                            Unit Name *
                        </div>
                        <div className="col-content">
                            <RegularField 
                                type="text"
                                name="name"
                                formControls={ formControls }
                                required={ true }
                            />
                        </div>
                    </div>
                    <div className="col col-info">
                        <div className="col-head">
                            Unit Type *
                        </div>
                        <div className="col-content">
                            <Autofill
                                list={ simpleTypes }
                                current={ capitalize(changes.type.name) }
                                setCurrent={ handleTypeChange }
                                error={ changes.errorFields.indexOf("type") === -1 ? null : "Please select a unit type." }
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