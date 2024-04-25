// external dependencies
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

// internal dependencies
import apiService from "../Services/apiService"
import { statusContext, authContext } from '../Services/Context'

// components
import Button from "../Reusables/Button"
import Error from '../Reusables/Error'
import authService from '../Services/authService'
import ChangePanel from '../Reusables/ChangePanel'

//------ MODULE INFO
// ** Available for SCSS **
// This module checks that the user wants to delete a unit.
// Imported by: App

const UnitDelete = () => {

    const navigate = useNavigate()

    // get context information
    const { id } = useParams()
    const { status, setStatus } = useContext(statusContext)
    const [ err, setErr ] = useState("loading")
    
    if (!authService.checkAdmin()) {
        setErr("permission")
    }

    // validate id
    if (id === undefined) {
        setErr("undefined")
    }

    // fetch data from the api
    const [ response, setResponse ] = useState({})
    useEffect(() => {
        (async()=>{
            await apiService.singleUnit(id, function(data){
                if (data.error) {
                    setErr(data.error)
                } else {
                    setStatus(`Click Save to delete unit ${ data.name }.`)
                    setResponse(data)
                    setErr(null)
                }
            })
        })()
    }, [])

    const confirmDelete = async() => {
        if (authService.checkUser() && authService.checkAdmin()) {
            await apiService.deleteUnit(response, (delres) => {
                if (delres.error) {
                    setErr(delres.error)
                } else {
                    setStatus(`You have successfully deleted unit ${ delres.name }.`)
                    navigate(`/location/${ delres.facilityId }`)
                }
            })
        } else {
            return <Error err="permission" />
        }
    }

    return err ? <Error err={ err } /> : (
        <main className="container">
            <div className="row title-row my-3">
                <div className="col">
                    <h2>Deleting Unit { response?.name } in { response?.facility.name }</h2>
                </div>
                <div className="col-2">
                    <Button text="Return" linkTo={ `/unit/${ id }` } type="nav" />
                </div>
            </div>
            <div className="page-content">
                { status && <div className="row row-info"><p className='my-2'>{ status }</p></div> }
                <ChangePanel save={ confirmDelete } linkOut={ `/unit/${ id }` } locationId={ response?.facility.id } />
            </div>
        </main>
    )
}

export default UnitDelete