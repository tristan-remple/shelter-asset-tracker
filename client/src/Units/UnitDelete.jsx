// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import authService from '../Services/authService'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// This module checks that the user wants to delete a unit.
// Imported by: App

const UnitDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    
    if (!authService.checkAdmin()) {
        console.log("insufficient permission")
        return <Error err="permission" />
    }

    // validate id
    if (id === undefined) {
        console.log("undefined id")
        return <Error err="undefined" />
    }

    // fetch unit data from the api
    const unit = apiService.singleUnit(id)
    if (!unit || unit.error) {
        console.log("api error")
        return <Error err="api" />
    }

    // destructure the unit
    const { unitId, unitName, locationId, locationName } = unit

    useEffect(() => {
        setStatus(`Click Save to delete unit ${ unitName }.`)
    }, [])

    const confirmDelete = () => {
        if (authService.checkUser() && authService.checkAdmin()) {
            const response = apiService.deleteUnit(unit)
            if (response.success) {
                setStatus(`You have successfully deleted unit ${ response.unitName }.`)
                navigate(`/location/${ response.locationId }`)
            } else {
                setStatus("We weren't able to process your delete unit request.")
            }
        } else {
            return <Error err="permission" />
        }
    }

    return (
        <main className="container">
            <div className="row title-row">
                <div className="col">
                    <h2>Deleting Unit { unitName } in { locationName }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/unit/${ unitId }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/unit/${ unitId }` } locationId={ locationId } />
            </div>
        </main>
    )
}

export default UnitDelete