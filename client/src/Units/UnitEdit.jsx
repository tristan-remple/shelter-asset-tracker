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
// This module displays the details about a single unit inside of a building. Examples include apartments and snugs.
// The items within the unit are displayed as well.
// Imported by: App

const UnitEdit = () => {

    // get context information
    const { id } = useParams()
    const { setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    const [ unsaved, setUnsaved ] = useState(false)
    const navigate = useNavigate()
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

    const [ unit, setUnit ] = useState()
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setUnit(data)
                    fetchTypes()
                }
            })
        })()
    }, [])

    // set possible changes
    const [ changes, setChanges ] = useState({
        name: "",
        type: "",
        errorFields: []
    })

    useEffect(() => {
        if (unit) {
            const newTypeIndex = unitTypes.map(type => capitalize(type.name)).indexOf(capitalize(unit.type))
            setChanges({
                name: unit.name,
                type: unitTypes[newTypeIndex],
                errorFields: []
            })
        }
    }, [ unit, simpleTypes ])

    if (err) { return <Error err={ err } /> }

    // handles type change
    // passed into Autofill
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

    // sends the item object to the apiService
    const saveChanges = async() => {

        if (changes.name === "" || changes.type === "" || changes.errorFields.length > 0) {
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

        // shape data for api
        const newChanges = {...changes}
        newChanges.id = unit.id
        newChanges.facilityId = unit.facility.id
        newChanges.type = changes.type.id

        // send api request and process api response
        await apiService.postUnitEdit(newChanges, (response) => {
            if (response.error) {
                setErr(response.error)
            } else {
                setStatus({
                    message: `You have successfully updated ${ response.name }.`,
                    error: false
                })
                setUnsaved(false)
                navigate(`/unit/${ unit.id }`)
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
                    <h2>Unit { unit.name } in { unit.facility.name }</h2>
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Return" linkTo={ `/unit/${ unit.id }` } type="nav" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Save Changes" linkTo={ saveChanges } type="admin" />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <Button text="Delete Unit" linkTo={ `/unit/${ unit.id }/delete` } type="danger" />
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
                            { unit.facility.name }
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
                                current={ capitalize(changes.type?.name) }
                                setCurrent={ handleTypeChange }
                                error={ changes.errorFields.indexOf("type") === -1 ? null : "Please select a unit type." }
                            />
                        </div>
                    </div>
                </div>
            </div>
            { unsaved && <ChangePanel save={ saveChanges } linkOut={ `/unit/${ unit.id }` } locationId={ unit.facility.id } /> }
        </main>
    )
}

export default UnitEdit